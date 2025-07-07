const mysql = require('mysql2/promise');
const logger = require('../utils/logger');

let db = null;

const dbConfig = {
  host: process.env.DB_HOST || '91.234.194.20',
  user: process.env.DB_USER || 'cp2111737p21_translate',
  password: process.env.DB_PASSWORD || '2J)ewo=OuYQk',
  database: process.env.DB_NAME || 'cp2111737p21_translate',
  port: parseInt(process.env.DB_PORT) || 3306,
  charset: 'utf8mb4',
  timezone: '+00:00',
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function connectDatabase() {
  try {
    // Create connection pool
    db = mysql.createPool(dbConfig);
    
    // Test connection
    const connection = await db.getConnection();
    await connection.ping();
    connection.release();
    
    logger.info('✅ Connexion à la base de données réussie');
    return db;
  } catch (error) {
    logger.error('❌ Erreur de connexion à la base de données:', error);
    throw error;
  }
}

function getDatabase() {
  if (!db) {
    throw new Error('Base de données non initialisée');
  }
  return db;
}

async function closeDatabase() {
  if (db) {
    await db.end();
    logger.info('🔌 Connexion à la base de données fermée');
  }
}

module.exports = {
  connectDatabase,
  getDatabase,
  closeDatabase
};