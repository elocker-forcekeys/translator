const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Erreur non gérée:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Erreur de validation Joi
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      error: 'Données invalides',
      details: err.details.map(detail => detail.message)
    });
  }

  // Erreur MySQL
  if (err.code) {
    switch (err.code) {
      case 'ER_DUP_ENTRY':
        return res.status(409).json({
          success: false,
          error: 'Cette ressource existe déjà'
        });
      case 'ER_NO_REFERENCED_ROW_2':
        return res.status(400).json({
          success: false,
          error: 'Référence invalide'
        });
      default:
        logger.error('Erreur MySQL:', err);
        return res.status(500).json({
          success: false,
          error: 'Erreur de base de données'
        });
    }
  }

  // Erreur par défaut
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Erreur interne du serveur' 
    : err.message;

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;