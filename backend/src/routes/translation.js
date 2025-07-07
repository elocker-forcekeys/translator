const express = require('express');
const multer = require('multer');
const { getDatabase } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest, schemas } = require('../middleware/validation');
const logger = require('../utils/logger');

const router = express.Router();

// Configuration multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || './uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'txt,pdf,jpg,jpeg,png,gif,webp').split(',');
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    
    if (allowedTypes.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé'));
    }
  }
});

// Traduction de texte
router.post('/', authenticateToken, validateRequest(schemas.translate), async (req, res) => {
  try {
    const { text, sourceLang, targetLang } = req.body;
    const db = getDatabase();

    // Vérifier les limites de mots
    const wordCount = text.trim().split(/\s+/).length;
    
    if (req.user.words_limit !== -1 && (req.user.words_used + wordCount) > req.user.words_limit) {
      return res.status(403).json({
        success: false,
        error: 'Limite de mots dépassée'
      });
    }

    // Appel à l'API de traduction
    const translationResponse = await fetch(process.env.TRANSLATION_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        source_lang: sourceLang,
        target_lang: targetLang
      })
    });

    if (!translationResponse.ok) {
      throw new Error('Erreur du service de traduction');
    }

    const translationData = await translationResponse.json();
    const translatedText = translationData.translation || translationData.translated_text;

    // Enregistrer la traduction en base
    await db.execute(
      `INSERT INTO translations (user_id, source_text, translated_text, source_language, target_language, word_count, character_count, translation_type) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'text')`,
      [req.user.id, text, translatedText, sourceLang, targetLang, wordCount, text.length]
    );

    // Mettre à jour le compteur de mots utilisés
    await db.execute(
      'UPDATE users SET words_used = words_used + ? WHERE id = ?',
      [wordCount, req.user.id]
    );

    logger.info(`Traduction effectuée par ${req.user.email}: ${wordCount} mots`);

    res.json({
      success: true,
      data: {
        translation: translatedText,
        detectedLanguage: translationData.detected_language,
        wordCount: wordCount,
        characterCount: text.length
      }
    });

  } catch (error) {
    logger.error('Erreur de traduction:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la traduction'
    });
  }
});

// OCR et traduction d'image
router.post('/ocr', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Aucune image fournie'
      });
    }

    const { targetLang } = req.body;
    
    if (!targetLang) {
      return res.status(400).json({
        success: false,
        error: 'Langue cible requise'
      });
    }

    // Simulation OCR (dans un vrai projet, utiliser Tesseract.js ou une API OCR)
    const extractedText = `[Texte extrait de l'image ${req.file.originalname}] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;
    
    // Traduction du texte extrait
    const translationResponse = await fetch(process.env.TRANSLATION_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: extractedText,
        source_lang: 'auto',
        target_lang: targetLang
      })
    });

    const translationData = await translationResponse.json();
    const translatedText = translationData.translation || translationData.translated_text;

    const wordCount = extractedText.trim().split(/\s+/).length;
    const db = getDatabase();

    // Enregistrer en base
    await db.execute(
      `INSERT INTO translations (user_id, source_text, translated_text, source_language, target_language, word_count, character_count, translation_type, file_path, file_name) 
       VALUES (?, ?, ?, 'auto', ?, ?, ?, 'ocr', ?, ?)`,
      [req.user.id, extractedText, translatedText, targetLang, wordCount, extractedText.length, req.file.path, req.file.originalname]
    );

    logger.info(`OCR et traduction effectués par ${req.user.email}: ${req.file.originalname}`);

    res.json({
      success: true,
      data: {
        extractedText: extractedText,
        translation: translatedText,
        wordCount: wordCount,
        fileName: req.file.originalname
      }
    });

  } catch (error) {
    logger.error('Erreur OCR:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors du traitement de l\'image'
    });
  }
});

// Traduction de PDF
router.post('/pdf', authenticateToken, upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Aucun fichier PDF fourni'
      });
    }

    const { sourceLang, targetLang } = req.body;
    
    if (!targetLang) {
      return res.status(400).json({
        success: false,
        error: 'Langue cible requise'
      });
    }

    // Simulation extraction PDF (dans un vrai projet, utiliser pdf-parse)
    const extractedText = `[Contenu extrait du PDF ${req.file.originalname}] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`;
    
    // Traduction du texte extrait
    const translationResponse = await fetch(process.env.TRANSLATION_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: extractedText,
        source_lang: sourceLang || 'auto',
        target_lang: targetLang
      })
    });

    const translationData = await translationResponse.json();
    const translatedText = translationData.translation || translationData.translated_text;

    const wordCount = extractedText.trim().split(/\s+/).length;
    const db = getDatabase();

    // Enregistrer en base
    await db.execute(
      `INSERT INTO translations (user_id, source_text, translated_text, source_language, target_language, word_count, character_count, translation_type, file_path, file_name) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pdf', ?, ?)`,
      [req.user.id, extractedText, translatedText, sourceLang || 'auto', targetLang, wordCount, extractedText.length, req.file.path, req.file.originalname]
    );

    logger.info(`Traduction PDF effectuée par ${req.user.email}: ${req.file.originalname}`);

    res.json({
      success: true,
      data: {
        originalText: extractedText,
        translation: translatedText,
        wordCount: wordCount,
        fileName: req.file.originalname,
        downloadUrl: `/api/v1/files/download/${req.file.filename}`
      }
    });

  } catch (error) {
    logger.error('Erreur traduction PDF:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors du traitement du PDF'
    });
  }
});

// Récupérer les langues supportées
router.get('/languages', async (req, res) => {
  try {
    const db = getDatabase();
    const [languages] = await db.execute(
      'SELECT code, name, native_name, flag FROM supported_languages WHERE is_active = 1 ORDER BY sort_order, name'
    );

    res.json({
      success: true,
      data: languages
    });

  } catch (error) {
    logger.error('Erreur récupération langues:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des langues'
    });
  }
});

// Historique des traductions
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const db = getDatabase();
    
    // Récupérer les traductions avec pagination
    const [translations] = await db.execute(
      `SELECT id, source_text, translated_text, source_language, target_language, 
              word_count, translation_type, file_name, created_at 
       FROM translations 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [req.user.id, limit, offset]
    );

    // Compter le total
    const [countResult] = await db.execute(
      'SELECT COUNT(*) as total FROM translations WHERE user_id = ?',
      [req.user.id]
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: translations,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });

  } catch (error) {
    logger.error('Erreur historique:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération de l\'historique'
    });
  }
});

module.exports = router;