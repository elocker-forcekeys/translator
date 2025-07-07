const express = require('express');
const { getDatabase } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Toutes les routes admin nécessitent une authentification admin
router.use(authenticateToken);
router.use(requireAdmin);

// Statistiques globales
router.get('/stats', async (req, res) => {
  try {
    const db = getDatabase();
    
    // Statistiques générales
    const [generalStats] = await db.execute(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'user') as total_users,
        (SELECT COUNT(*) FROM users WHERE created_at >= CURDATE()) as new_users_today,
        (SELECT COUNT(*) FROM translations WHERE created_at >= CURDATE()) as translations_today,
        (SELECT SUM(word_count) FROM translations WHERE created_at >= CURDATE()) as words_translated_today,
        (SELECT COUNT(*) FROM translations WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as translations_this_month,
        (SELECT SUM(word_count) FROM translations WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as words_translated_this_month,
        (SELECT COUNT(*) FROM subscriptions WHERE status = 'active') as active_subscriptions,
        (SELECT SUM(amount) FROM payments WHERE status = 'completed' AND created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as revenue_this_month
    `);

    // Répartition par plan
    const [planStats] = await db.execute(`
      SELECT 
        plan,
        COUNT(*) as user_count,
        SUM(words_used) as total_words_used
      FROM users 
      WHERE role = 'user'
      GROUP BY plan
    `);

    // Activité récente
    const [recentActivity] = await db.execute(`
      SELECT 
        'user_registered' as type,
        u.name as description,
        u.email as details,
        u.created_at as timestamp
      FROM users u
      WHERE u.created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
      
      UNION ALL
      
      SELECT 
        'payment_received' as type,
        CONCAT('Payment of €', p.amount) as description,
        u.email as details,
        p.created_at as timestamp
      FROM payments p
      JOIN users u ON p.user_id = u.id
      WHERE p.status = 'completed' AND p.created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
      
      ORDER BY timestamp DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: {
        general: generalStats[0],
        planDistribution: planStats,
        recentActivity: recentActivity
      }
    });

  } catch (error) {
    logger.error('Erreur statistiques admin:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des statistiques'
    });
  }
});

// Gestion des utilisateurs
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const plan = req.query.plan || '';

    const db = getDatabase();
    
    let whereClause = "WHERE role = 'user'";
    let params = [];

    if (search) {
      whereClause += " AND (name LIKE ? OR email LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    if (plan) {
      whereClause += " AND plan = ?";
      params.push(plan);
    }

    // Récupérer les utilisateurs
    const [users] = await db.execute(
      `SELECT 
        id, email, name, plan, words_used, words_limit, 
        email_verified, last_login, created_at
       FROM users 
       ${whereClause}
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Compter le total
    const [countResult] = await db.execute(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      params
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });

  } catch (error) {
    logger.error('Erreur liste utilisateurs:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des utilisateurs'
    });
  }
});

// Détails d'un utilisateur
router.get('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const db = getDatabase();

    // Informations utilisateur
    const [userInfo] = await db.execute(
      `SELECT 
        id, email, name, role, plan, words_used, words_limit,
        email_verified, last_login, created_at
       FROM users WHERE id = ?`,
      [userId]
    );

    if (userInfo.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    // Statistiques de traduction
    const [translationStats] = await db.execute(
      `SELECT 
        COUNT(*) as total_translations,
        SUM(word_count) as total_words,
        translation_type,
        COUNT(*) as count_by_type
       FROM translations 
       WHERE user_id = ?
       GROUP BY translation_type`,
      [userId]
    );

    // Traductions récentes
    const [recentTranslations] = await db.execute(
      `SELECT 
        source_text, translated_text, source_language, target_language,
        word_count, translation_type, created_at
       FROM translations 
       WHERE user_id = ?
       ORDER BY created_at DESC 
       LIMIT 10`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        user: userInfo[0],
        translationStats: translationStats,
        recentTranslations: recentTranslations
      }
    });

  } catch (error) {
    logger.error('Erreur détails utilisateur:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des détails utilisateur'
    });
  }
});

// Mettre à jour un utilisateur
router.put('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { plan, words_limit, email_verified } = req.body;
    const db = getDatabase();

    const updates = [];
    const values = [];

    if (plan) {
      updates.push('plan = ?');
      values.push(plan);
    }

    if (words_limit !== undefined) {
      updates.push('words_limit = ?');
      values.push(words_limit);
    }

    if (email_verified !== undefined) {
      updates.push('email_verified = ?');
      values.push(email_verified);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Aucune mise à jour fournie'
      });
    }

    values.push(userId);
    await db.execute(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    logger.info(`Utilisateur ${userId} mis à jour par l'admin ${req.user.email}`);

    res.json({
      success: true,
      message: 'Utilisateur mis à jour avec succès'
    });

  } catch (error) {
    logger.error('Erreur mise à jour utilisateur:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour de l\'utilisateur'
    });
  }
});

// Performance API
router.get('/api-performance', async (req, res) => {
  try {
    const db = getDatabase();
    
    // Statistiques par endpoint
    const [endpointStats] = await db.execute(`
      SELECT 
        endpoint,
        COUNT(*) as request_count,
        AVG(response_time_ms) as avg_response_time,
        (COUNT(CASE WHEN status_code >= 400 THEN 1 END) / COUNT(*)) * 100 as error_rate
      FROM api_logs 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
      GROUP BY endpoint
      ORDER BY request_count DESC
    `);

    // Évolution du trafic
    const [trafficEvolution] = await db.execute(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as requests,
        AVG(response_time_ms) as avg_response_time
      FROM api_logs 
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    res.json({
      success: true,
      data: {
        endpointStats: endpointStats,
        trafficEvolution: trafficEvolution
      }
    });

  } catch (error) {
    logger.error('Erreur performance API:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des performances API'
    });
  }
});

// Paramètres système
router.get('/settings', async (req, res) => {
  try {
    const db = getDatabase();
    
    const [settings] = await db.execute(
      'SELECT setting_key, setting_value, setting_type, description FROM system_settings ORDER BY setting_key'
    );

    res.json({
      success: true,
      data: settings
    });

  } catch (error) {
    logger.error('Erreur paramètres système:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des paramètres'
    });
  }
});

// Mettre à jour les paramètres système
router.put('/settings', async (req, res) => {
  try {
    const settings = req.body;
    const db = getDatabase();

    for (const [key, value] of Object.entries(settings)) {
      await db.execute(
        'UPDATE system_settings SET setting_value = ? WHERE setting_key = ?',
        [value, key]
      );
    }

    logger.info(`Paramètres système mis à jour par l'admin ${req.user.email}`);

    res.json({
      success: true,
      message: 'Paramètres mis à jour avec succès'
    });

  } catch (error) {
    logger.error('Erreur mise à jour paramètres:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour des paramètres'
    });
  }
});

module.exports = router;