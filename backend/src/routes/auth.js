const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDatabase } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest, schemas } = require('../middleware/validation');
const logger = require('../utils/logger');

const router = express.Router();

// Inscription
router.post('/register', validateRequest(schemas.register), async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const db = getDatabase();

    // Vérifier si l'email existe déjà
    const [existingUsers] = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cet email est déjà utilisé'
      });
    }

    // Hacher le mot de passe
    const passwordHash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 12);

    // Insérer le nouvel utilisateur
    const [result] = await db.execute(
      'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
      [email, passwordHash, name]
    );

    // Récupérer l'utilisateur créé
    const [newUser] = await db.execute(
      'SELECT id, email, name, role, plan, words_used, words_limit, api_key, email_verified FROM users WHERE id = ?',
      [result.insertId]
    );

    const user = newUser[0];

    // Générer un token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    logger.info(`Nouvel utilisateur inscrit: ${email}`);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          plan: user.plan,
          wordsUsed: user.words_used,
          wordsLimit: user.words_limit,
          apiKey: user.api_key,
          emailVerified: user.email_verified
        },
        token
      }
    });

  } catch (error) {
    logger.error('Erreur d\'inscription:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
});

// Connexion
router.post('/login', validateRequest(schemas.login), async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = getDatabase();

    // Rechercher l'utilisateur
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Email ou mot de passe incorrect'
      });
    }

    const user = rows[0];

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Email ou mot de passe incorrect'
      });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Mettre à jour la dernière connexion
    await db.execute(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );

    logger.info(`Utilisateur connecté: ${email}`);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          plan: user.plan,
          wordsUsed: user.words_used,
          wordsLimit: user.words_limit,
          apiKey: user.api_key,
          emailVerified: user.email_verified
        },
        token
      }
    });

  } catch (error) {
    logger.error('Erreur de connexion:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
});

// Récupérer le profil utilisateur
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const db = getDatabase();
    const [rows] = await db.execute(
      'SELECT id, email, name, role, plan, words_used, words_limit, api_key, email_verified, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    const user = rows[0];

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: user.plan,
        wordsUsed: user.words_used,
        wordsLimit: user.words_limit,
        apiKey: user.api_key,
        emailVerified: user.email_verified,
        createdAt: user.created_at
      }
    });

  } catch (error) {
    logger.error('Erreur profil:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
});

// Mettre à jour le profil
router.put('/profile', authenticateToken, validateRequest(schemas.updateProfile), async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const db = getDatabase();

    // Si changement de mot de passe
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          error: 'Mot de passe actuel requis'
        });
      }

      // Vérifier le mot de passe actuel
      const [userRows] = await db.execute(
        'SELECT password_hash FROM users WHERE id = ?',
        [req.user.id]
      );

      const isValidPassword = await bcrypt.compare(currentPassword, userRows[0].password_hash);
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          error: 'Mot de passe actuel incorrect'
        });
      }

      // Hacher le nouveau mot de passe
      const newPasswordHash = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS) || 12);
      
      await db.execute(
        'UPDATE users SET password_hash = ? WHERE id = ?',
        [newPasswordHash, req.user.id]
      );
    }

    // Mettre à jour les autres champs
    const updates = [];
    const values = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }

    if (email && email !== req.user.email) {
      // Vérifier si le nouvel email existe déjà
      const [existingUsers] = await db.execute(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, req.user.id]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Cet email est déjà utilisé'
        });
      }

      updates.push('email = ?');
      values.push(email);
    }

    if (updates.length > 0) {
      values.push(req.user.id);
      await db.execute(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    logger.info(`Profil mis à jour pour l'utilisateur: ${req.user.email}`);

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès'
    });

  } catch (error) {
    logger.error('Erreur mise à jour profil:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
});

// Déconnexion
router.post('/logout', authenticateToken, (req, res) => {
  // Dans une implémentation complète, on pourrait blacklister le token
  logger.info(`Utilisateur déconnecté: ${req.user.email}`);
  
  res.json({
    success: true,
    message: 'Déconnexion réussie'
  });
});

module.exports = router;