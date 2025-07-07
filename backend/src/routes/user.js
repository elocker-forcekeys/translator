const express = require('express');
const { getDatabase } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Statistiques d'utilisation
router.get('/usage', authenticateToken, async (req, res) => {
  try {
    const db = getDatabase();
    
    // Statistiques générales
    const [userStats] = await db.execute(
      `SELECT 
        words_used, 
        words_limit,
        (SELECT COUNT(*) FROM translations WHERE user_id = ?) as total_translations,
        (SELECT COUNT(*) FROM translations WHERE user_id = ? AND created_at >= CURDATE()) as translations_today,
        (SELECT COUNT(*) FROM translations WHERE user_id = ? AND created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as translations_this_month
       FROM users WHERE id = ?`,
      [req.user.id, req.user.id, req.user.id, req.user.id]
    );

    // Statistiques par type de traduction
    const [typeStats] = await db.execute(
      `SELECT 
        translation_type,
        COUNT(*) as count,
        SUM(word_count) as total_words
       FROM translations 
       WHERE user_id = ? 
       GROUP BY translation_type`,
      [req.user.id]
    );

    // Utilisation des 30 derniers jours
    const [dailyUsage] = await db.execute(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as translations,
        SUM(word_count) as words
       FROM translations 
       WHERE user_id = ? AND created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       GROUP BY DATE(created_at)
       ORDER BY date DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      data: {
        general: userStats[0],
        byType: typeStats,
        dailyUsage: dailyUsage
      }
    });

  } catch (error) {
    logger.error('Erreur statistiques utilisateur:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des statistiques'
    });
  }
});

// Informations d'abonnement
router.get('/subscription', authenticateToken, async (req, res) => {
  try {
    const db = getDatabase();
    
    const [subscription] = await db.execute(
      `SELECT 
        s.plan_id,
        s.status,
        s.current_period_start,
        s.current_period_end,
        s.cancel_at_period_end,
        u.plan,
        u.words_limit,
        u.words_used
       FROM users u
       LEFT JOIN subscriptions s ON u.id = s.user_id AND s.status = 'active'
       WHERE u.id = ?`,
      [req.user.id]
    );

    const planFeatures = {
      free: ['2000 words/month', 'Basic text translation', 'Email support', 'Web access only'],
      pro: ['100K words/month', 'Text, image, PDF translation', 'Priority support', 'API access', 'Unlimited history'],
      enterprise: ['Unlimited words', 'All Pro features', '24/7 dedicated support', 'High-performance API', 'Custom integrations', 'Team dashboard', '99.9% SLA']
    };

    const result = subscription[0];
    
    res.json({
      success: true,
      data: {
        plan: result.plan,
        status: result.status || 'active',
        wordsUsed: result.words_used,
        wordsLimit: result.words_limit,
        features: planFeatures[result.plan] || [],
        renewsAt: result.current_period_end,
        cancelAtPeriodEnd: result.cancel_at_period_end || false
      }
    });

  } catch (error) {
    logger.error('Erreur abonnement:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération de l\'abonnement'
    });
  }
});

// Régénérer la clé API
router.post('/regenerate-api-key', authenticateToken, async (req, res) => {
  try {
    const db = getDatabase();
    
    // Générer une nouvelle clé API
    const newApiKey = 'tr_' + require('crypto').randomBytes(16).toString('hex');
    
    await db.execute(
      'UPDATE users SET api_key = ? WHERE id = ?',
      [newApiKey, req.user.id]
    );

    logger.info(`Clé API régénérée pour l'utilisateur: ${req.user.email}`);

    res.json({
      success: true,
      data: {
        apiKey: newApiKey
      }
    });

  } catch (error) {
    logger.error('Erreur régénération clé API:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la régénération de la clé API'
    });
  }
});

module.exports = router;