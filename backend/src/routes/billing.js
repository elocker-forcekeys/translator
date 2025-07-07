const express = require('express');
const { getDatabase } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Plans disponibles
router.get('/plans', async (req, res) => {
  try {
    const plans = [
      {
        id: 'free',
        name: 'Gratuit',
        price: 0,
        currency: 'EUR',
        interval: 'month',
        wordsLimit: 2000,
        features: [
          '2 000 mots par mois',
          'Traduction texte basique',
          'Support par email',
          'Accès web uniquement',
          'Historique limité (7 jours)'
        ]
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 19,
        currency: 'EUR',
        interval: 'month',
        wordsLimit: 100000,
        features: [
          '100 000 mots par mois',
          'Traduction texte, image, PDF',
          'Support prioritaire',
          'Accès API',
          'Historique illimité',
          'Intégrations avancées',
          'Formats de sortie multiples'
        ]
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 99,
        currency: 'EUR',
        interval: 'month',
        wordsLimit: -1, // Illimité
        features: [
          'Mots illimités',
          'Toutes les fonctionnalités Pro',
          'Support dédié 24/7',
          'API haute performance',
          'Intégrations personnalisées',
          'Tableau de bord équipe',
          'SLA 99.9%',
          'Formation dédiée'
        ]
      }
    ];

    res.json({
      success: true,
      data: plans
    });

  } catch (error) {
    logger.error('Erreur récupération plans:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des plans'
    });
  }
});

// Historique de facturation
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const db = getDatabase();
    
    const [payments] = await db.execute(
      `SELECT 
        id, amount, currency, status, description, created_at
       FROM payments 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      data: payments
    });

  } catch (error) {
    logger.error('Erreur historique facturation:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération de l\'historique'
    });
  }
});

// Créer un paiement (simulation)
router.post('/create-payment', authenticateToken, async (req, res) => {
  try {
    const { planId } = req.body;
    
    if (!planId) {
      return res.status(400).json({
        success: false,
        error: 'Plan ID requis'
      });
    }

    // Simulation de création de session de paiement Stripe
    const sessionId = 'cs_test_' + Math.random().toString(36).substr(2, 24);
    const paymentUrl = `https://checkout.stripe.com/pay/${sessionId}`;

    logger.info(`Session de paiement créée pour l'utilisateur ${req.user.email}: ${planId}`);

    res.json({
      success: true,
      data: {
        sessionId: sessionId,
        paymentUrl: paymentUrl
      }
    });

  } catch (error) {
    logger.error('Erreur création paiement:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création du paiement'
    });
  }
});

// Webhook Stripe (simulation)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // Dans un vrai projet, vérifier la signature Stripe
    const event = JSON.parse(req.body);
    
    logger.info('Webhook Stripe reçu:', event.type);

    switch (event.type) {
      case 'checkout.session.completed':
        // Traiter le paiement réussi
        logger.info('Paiement réussi:', event.data.object.id);
        break;
      
      case 'invoice.payment_succeeded':
        // Traiter le renouvellement d'abonnement
        logger.info('Renouvellement réussi:', event.data.object.id);
        break;
      
      case 'customer.subscription.deleted':
        // Traiter l'annulation d'abonnement
        logger.info('Abonnement annulé:', event.data.object.id);
        break;
      
      default:
        logger.info('Événement Stripe non géré:', event.type);
    }

    res.json({ received: true });

  } catch (error) {
    logger.error('Erreur webhook Stripe:', error);
    res.status(400).json({
      success: false,
      error: 'Erreur lors du traitement du webhook'
    });
  }
});

module.exports = router;