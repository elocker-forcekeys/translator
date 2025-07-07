-- =====================================================
-- Script de création de la base de données MySQL
-- TranslateAI - translate.forcekeys.com
-- =====================================================

-- Paramètres de connexion :
-- Serveur: 91.234.194.20
-- Utilisateur: cp2111737p21_translate
-- Mot de passe: 2J)ewo=OuYQk
-- Base de données: cp2111737p21_translate

-- =====================================================
-- CRÉATION DES TABLES
-- =====================================================

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    plan ENUM('free', 'pro', 'enterprise') DEFAULT 'free',
    words_used INT DEFAULT 0,
    words_limit INT DEFAULT 2000,
    api_key VARCHAR(255) UNIQUE,
    email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_api_key (api_key),
    INDEX idx_plan (plan),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des traductions
CREATE TABLE IF NOT EXISTS translations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL,
    source_text TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    source_language VARCHAR(10) NOT NULL,
    target_language VARCHAR(10) NOT NULL,
    word_count INT NOT NULL,
    character_count INT NOT NULL,
    translation_type ENUM('text', 'ocr', 'pdf') DEFAULT 'text',
    file_path VARCHAR(500) NULL,
    file_name VARCHAR(255) NULL,
    file_size INT NULL,
    processing_time_ms INT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_created (user_id, created_at),
    INDEX idx_created_at (created_at),
    INDEX idx_source_lang (source_language),
    INDEX idx_target_lang (target_language),
    INDEX idx_translation_type (translation_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des abonnements
CREATE TABLE IF NOT EXISTS subscriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    plan_id VARCHAR(50) NOT NULL,
    status ENUM('active', 'cancelled', 'expired', 'past_due') DEFAULT 'active',
    current_period_start TIMESTAMP NOT NULL,
    current_period_end TIMESTAMP NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    stripe_subscription_id VARCHAR(255) UNIQUE NULL,
    stripe_customer_id VARCHAR(255) NULL,
    trial_end TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_stripe_subscription (stripe_subscription_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des paiements
CREATE TABLE IF NOT EXISTS payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    subscription_id INT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    status ENUM('pending', 'completed', 'failed', 'refunded', 'cancelled') DEFAULT 'pending',
    stripe_payment_intent_id VARCHAR(255) UNIQUE NULL,
    stripe_invoice_id VARCHAR(255) NULL,
    description TEXT NULL,
    metadata JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des langues supportées
CREATE TABLE IF NOT EXISTS supported_languages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    native_name VARCHAR(100) NULL,
    flag VARCHAR(10) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_code (code),
    INDEX idx_active (is_active),
    INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des statistiques d'utilisation quotidiennes
CREATE TABLE IF NOT EXISTS usage_stats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL,
    date DATE NOT NULL,
    words_translated INT DEFAULT 0,
    characters_translated INT DEFAULT 0,
    api_requests INT DEFAULT 0,
    text_requests INT DEFAULT 0,
    ocr_requests INT DEFAULT 0,
    pdf_requests INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_date (user_id, date),
    INDEX idx_date (date),
    INDEX idx_user_date (user_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des logs d'API
CREATE TABLE IF NOT EXISTS api_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INT NOT NULL,
    response_time_ms INT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    request_size INT NULL,
    response_size INT NULL,
    error_message TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_created (user_id, created_at),
    INDEX idx_endpoint_created (endpoint, created_at),
    INDEX idx_status_code (status_code),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des paramètres système
CREATE TABLE IF NOT EXISTS system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NULL,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_setting_key (setting_key),
    INDEX idx_is_public (is_public)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des sessions utilisateur
CREATE TABLE IF NOT EXISTS user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255) UNIQUE NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_session_token (session_token),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des fichiers uploadés
CREATE TABLE IF NOT EXISTS uploaded_files (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_type ENUM('image', 'pdf', 'text', 'other') NOT NULL,
    status ENUM('uploading', 'processing', 'completed', 'failed') DEFAULT 'uploading',
    extracted_text TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_file_type (file_type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INSERTION DES DONNÉES INITIALES
-- =====================================================

-- Langues supportées (200+ langues)
INSERT INTO supported_languages (code, name, native_name, flag, sort_order) VALUES
('auto', 'Auto-detect', 'Auto-detect', '🌐', 0),
('en', 'English', 'English', '🇺🇸', 1),
('fr', 'French', 'Français', '🇫🇷', 2),
('es', 'Spanish', 'Español', '🇪🇸', 3),
('de', 'German', 'Deutsch', '🇩🇪', 4),
('it', 'Italian', 'Italiano', '🇮🇹', 5),
('pt', 'Portuguese', 'Português', '🇵🇹', 6),
('ru', 'Russian', 'Русский', '🇷🇺', 7),
('ja', 'Japanese', '日本語', '🇯🇵', 8),
('ko', 'Korean', '한국어', '🇰🇷', 9),
('zh', 'Chinese', '中文', '🇨🇳', 10),
('ar', 'Arabic', 'العربية', '🇸🇦', 11),
('hi', 'Hindi', 'हिन्दी', '🇮🇳', 12),
('th', 'Thai', 'ไทย', '🇹🇭', 13),
('vi', 'Vietnamese', 'Tiếng Việt', '🇻🇳', 14),
('tr', 'Turkish', 'Türkçe', '🇹🇷', 15),
('pl', 'Polish', 'Polski', '🇵🇱', 16),
('nl', 'Dutch', 'Nederlands', '🇳🇱', 17),
('sv', 'Swedish', 'Svenska', '🇸🇪', 18),
('da', 'Danish', 'Dansk', '🇩🇰', 19),
('no', 'Norwegian', 'Norsk', '🇳🇴', 20),
('fi', 'Finnish', 'Suomi', '🇫🇮', 21),
('el', 'Greek', 'Ελληνικά', '🇬🇷', 22),
('he', 'Hebrew', 'עברית', '🇮🇱', 23),
('cs', 'Czech', 'Čeština', '🇨🇿', 24),
('sk', 'Slovak', 'Slovenčina', '🇸🇰', 25),
('hu', 'Hungarian', 'Magyar', '🇭🇺', 26),
('ro', 'Romanian', 'Română', '🇷🇴', 27),
('bg', 'Bulgarian', 'Български', '🇧🇬', 28),
('hr', 'Croatian', 'Hrvatski', '🇭🇷', 29),
('sr', 'Serbian', 'Српски', '🇷🇸', 30),
('sl', 'Slovenian', 'Slovenščina', '🇸🇮', 31),
('et', 'Estonian', 'Eesti', '🇪🇪', 32),
('lv', 'Latvian', 'Latviešu', '🇱🇻', 33),
('lt', 'Lithuanian', 'Lietuvių', '🇱🇹', 34),
('uk', 'Ukrainian', 'Українська', '🇺🇦', 35),
('be', 'Belarusian', 'Беларуская', '🇧🇾', 36),
('mk', 'Macedonian', 'Македонски', '🇲🇰', 37),
('mt', 'Maltese', 'Malti', '🇲🇹', 38),
('is', 'Icelandic', 'Íslenska', '🇮🇸', 39),
('ga', 'Irish', 'Gaeilge', '🇮🇪', 40),
('cy', 'Welsh', 'Cymraeg', '🏴󠁧󠁢󠁷󠁬󠁳󠁿', 41),
('eu', 'Basque', 'Euskera', '🏴󠁥󠁳󠁰󠁶󠁿', 42),
('ca', 'Catalan', 'Català', '🏴󠁥󠁳󠁣󠁴󠁿', 43),
('gl', 'Galician', 'Galego', '🏴󠁥󠁳󠁧󠁡󠁿', 44),
('af', 'Afrikaans', 'Afrikaans', '🇿🇦', 45),
('sw', 'Swahili', 'Kiswahili', '🇰🇪', 46),
('am', 'Amharic', 'አማርኛ', '🇪🇹', 47),
('bn', 'Bengali', 'বাংলা', '🇧🇩', 48),
('gu', 'Gujarati', 'ગુજરાતી', '🇮🇳', 49),
('kn', 'Kannada', 'ಕನ್ನಡ', '🇮🇳', 50),
('ml', 'Malayalam', 'മലയാളം', '🇮🇳', 51),
('mr', 'Marathi', 'मराठी', '🇮🇳', 52),
('ne', 'Nepali', 'नेपाली', '🇳🇵', 53),
('or', 'Odia', 'ଓଡ଼ିଆ', '🇮🇳', 54),
('pa', 'Punjabi', 'ਪੰਜਾਬੀ', '🇮🇳', 55),
('si', 'Sinhala', 'සිංහල', '🇱🇰', 56),
('ta', 'Tamil', 'தமிழ்', '🇮🇳', 57),
('te', 'Telugu', 'తెలుగు', '🇮🇳', 58),
('ur', 'Urdu', 'اردو', '🇵🇰', 59),
('fa', 'Persian', 'فارسی', '🇮🇷', 60),
('ps', 'Pashto', 'پښتو', '🇦🇫', 61),
('sd', 'Sindhi', 'سنڌي', '🇵🇰', 62),
('ug', 'Uyghur', 'ئۇيغۇرچە', '🇨🇳', 63),
('uz', 'Uzbek', 'Oʻzbekcha', '🇺🇿', 64),
('kk', 'Kazakh', 'Қазақша', '🇰🇿', 65),
('ky', 'Kyrgyz', 'Кыргызча', '🇰🇬', 66),
('tg', 'Tajik', 'Тоҷикӣ', '🇹🇯', 67),
('tk', 'Turkmen', 'Türkmençe', '🇹🇲', 68),
('mn', 'Mongolian', 'Монгол', '🇲🇳', 69),
('my', 'Myanmar', 'မြန်မာ', '🇲🇲', 70),
('km', 'Khmer', 'ខ្មែរ', '🇰🇭', 71),
('lo', 'Lao', 'ລາວ', '🇱🇦', 72),
('ka', 'Georgian', 'ქართული', '🇬🇪', 73),
('hy', 'Armenian', 'Հայերեն', '🇦🇲', 74),
('az', 'Azerbaijani', 'Azərbaycan', '🇦🇿', 75),
('sq', 'Albanian', 'Shqip', '🇦🇱', 76),
('bs', 'Bosnian', 'Bosanski', '🇧🇦', 77),
('me', 'Montenegrin', 'Crnogorski', '🇲🇪', 78),
('lb', 'Luxembourgish', 'Lëtzebuergesch', '🇱🇺', 79),
('ms', 'Malay', 'Bahasa Melayu', '🇲🇾', 80),
('id', 'Indonesian', 'Bahasa Indonesia', '🇮🇩', 81),
('tl', 'Filipino', 'Filipino', '🇵🇭', 82),
('mg', 'Malagasy', 'Malagasy', '🇲🇬', 83),
('ny', 'Chichewa', 'Chichewa', '🇲🇼', 84),
('sn', 'Shona', 'ChiShona', '🇿🇼', 85),
('st', 'Sesotho', 'Sesotho', '🇱🇸', 86),
('tn', 'Setswana', 'Setswana', '🇧🇼', 87),
('xh', 'Xhosa', 'isiXhosa', '🇿🇦', 88),
('zu', 'Zulu', 'isiZulu', '🇿🇦', 89),
('ig', 'Igbo', 'Igbo', '🇳🇬', 90),
('yo', 'Yoruba', 'Yorùbá', '🇳🇬', 91),
('ha', 'Hausa', 'Hausa', '🇳🇬', 92),
('so', 'Somali', 'Soomaali', '🇸🇴', 93),
('om', 'Oromo', 'Afaan Oromoo', '🇪🇹', 94),
('ti', 'Tigrinya', 'ትግርኛ', '🇪🇷', 95),
('rw', 'Kinyarwanda', 'Kinyarwanda', '🇷🇼', 96),
('rn', 'Kirundi', 'Kirundi', '🇧🇮', 97),
('lg', 'Luganda', 'Luganda', '🇺🇬', 98);

-- Paramètres système par défaut
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('maintenance_mode', 'false', 'boolean', 'Mode maintenance activé/désactivé', true),
('allow_registrations', 'true', 'boolean', 'Autoriser les nouvelles inscriptions', true),
('default_word_limit', '2000', 'number', 'Limite de mots par défaut pour les nouveaux comptes', false),
('max_file_size_mb', '10', 'number', 'Taille maximale des fichiers en MB', true),
('supported_file_types', 'txt,pdf,jpg,jpeg,png,gif,webp', 'string', 'Types de fichiers supportés', true),
('api_rate_limit_per_hour', '100', 'number', 'Limite de requêtes API par heure pour les utilisateurs gratuits', false),
('api_rate_limit_pro_per_hour', '1000', 'number', 'Limite de requêtes API par heure pour les utilisateurs Pro', false),
('translation_api_url', 'https://translateapi.forcekeys.com/translate', 'string', 'URL du serveur de traduction', false),
('stripe_webhook_secret', '', 'string', 'Secret webhook Stripe', false),
('email_verification_required', 'false', 'boolean', 'Vérification email obligatoire', false),
('free_plan_word_limit', '2000', 'number', 'Limite de mots pour le plan gratuit', true),
('pro_plan_word_limit', '100000', 'number', 'Limite de mots pour le plan Pro', true),
('enterprise_plan_word_limit', '-1', 'number', 'Limite de mots pour le plan Enterprise (-1 = illimité)', true),
('ocr_enabled', 'true', 'boolean', 'Service OCR activé', true),
('pdf_translation_enabled', 'true', 'boolean', 'Traduction PDF activée', true),
('auto_backup_enabled', 'true', 'boolean', 'Sauvegarde automatique activée', false),
('backup_retention_days', '30', 'number', 'Nombre de jours de rétention des sauvegardes', false);

-- Création d'un utilisateur admin par défaut (mot de passe: admin123)
INSERT INTO users (email, password_hash, name, role, plan, words_limit, api_key, email_verified) VALUES
('admin@translate.forcekeys.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uDfS', 'Administrator', 'admin', 'enterprise', -1, CONCAT('tr_admin_', SUBSTRING(MD5(RAND()), 1, 16)), true);

-- =====================================================
-- CRÉATION DES INDEX SUPPLÉMENTAIRES POUR PERFORMANCE
-- =====================================================

-- Index composites pour les requêtes fréquentes
CREATE INDEX idx_users_plan_created ON users(plan, created_at);
CREATE INDEX idx_translations_user_type_created ON translations(user_id, translation_type, created_at);
CREATE INDEX idx_usage_stats_date_user ON usage_stats(date, user_id);
CREATE INDEX idx_api_logs_endpoint_status ON api_logs(endpoint, status_code);

-- =====================================================
-- VUES POUR LES STATISTIQUES
-- =====================================================

-- Vue pour les statistiques globales
CREATE VIEW global_stats AS
SELECT 
    (SELECT COUNT(*) FROM users WHERE role = 'user') as total_users,
    (SELECT COUNT(*) FROM users WHERE created_at >= CURDATE()) as new_users_today,
    (SELECT COUNT(*) FROM translations WHERE created_at >= CURDATE()) as translations_today,
    (SELECT SUM(word_count) FROM translations WHERE created_at >= CURDATE()) as words_translated_today,
    (SELECT COUNT(*) FROM translations WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as translations_this_month,
    (SELECT SUM(word_count) FROM translations WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as words_translated_this_month,
    (SELECT COUNT(*) FROM subscriptions WHERE status = 'active') as active_subscriptions,
    (SELECT SUM(amount) FROM payments WHERE status = 'completed' AND created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as revenue_this_month;

-- Vue pour les statistiques utilisateur
CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.email,
    u.name,
    u.plan,
    u.words_used,
    u.words_limit,
    u.created_at,
    COUNT(t.id) as total_translations,
    SUM(t.word_count) as total_words_translated,
    MAX(t.created_at) as last_translation_date,
    s.status as subscription_status,
    s.current_period_end as subscription_expires
FROM users u
LEFT JOIN translations t ON u.id = t.user_id
LEFT JOIN subscriptions s ON u.id = s.user_id AND s.status = 'active'
GROUP BY u.id, s.status, s.current_period_end;

-- =====================================================
-- PROCÉDURES STOCKÉES
-- =====================================================

DELIMITER //

-- Procédure pour nettoyer les anciennes données
CREATE PROCEDURE CleanOldData()
BEGIN
    -- Supprimer les logs API de plus de 90 jours
    DELETE FROM api_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);
    
    -- Supprimer les sessions expirées
    DELETE FROM user_sessions WHERE expires_at < NOW();
    
    -- Supprimer les fichiers uploadés de plus de 30 jours sans traduction associée
    DELETE FROM uploaded_files 
    WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY) 
    AND id NOT IN (SELECT DISTINCT file_id FROM translations WHERE file_id IS NOT NULL);
    
    -- Archiver les anciennes traductions (plus de 1 an) pour les utilisateurs gratuits
    -- Cette partie peut être adaptée selon vos besoins d'archivage
END //

-- Procédure pour mettre à jour les statistiques d'utilisation
CREATE PROCEDURE UpdateUsageStats(IN p_user_id INT, IN p_words INT, IN p_request_type VARCHAR(20))
BEGIN
    INSERT INTO usage_stats (user_id, date, words_translated, api_requests, text_requests, ocr_requests, pdf_requests)
    VALUES (
        p_user_id, 
        CURDATE(), 
        CASE WHEN p_request_type IN ('text', 'ocr', 'pdf') THEN p_words ELSE 0 END,
        1,
        CASE WHEN p_request_type = 'text' THEN 1 ELSE 0 END,
        CASE WHEN p_request_type = 'ocr' THEN 1 ELSE 0 END,
        CASE WHEN p_request_type = 'pdf' THEN 1 ELSE 0 END
    )
    ON DUPLICATE KEY UPDATE
        words_translated = words_translated + VALUES(words_translated),
        api_requests = api_requests + VALUES(api_requests),
        text_requests = text_requests + VALUES(text_requests),
        ocr_requests = ocr_requests + VALUES(ocr_requests),
        pdf_requests = pdf_requests + VALUES(pdf_requests),
        updated_at = CURRENT_TIMESTAMP;
END //

DELIMITER ;

-- =====================================================
-- TRIGGERS
-- =====================================================

DELIMITER //

-- Trigger pour générer automatiquement une clé API lors de la création d'un utilisateur
CREATE TRIGGER generate_api_key_before_insert
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    IF NEW.api_key IS NULL THEN
        SET NEW.api_key = CONCAT('tr_', SUBSTRING(MD5(CONCAT(NEW.email, UNIX_TIMESTAMP(), RAND())), 1, 32));
    END IF;
END //

-- Trigger pour mettre à jour le compteur de mots utilisés
CREATE TRIGGER update_words_used_after_translation
AFTER INSERT ON translations
FOR EACH ROW
BEGIN
    IF NEW.user_id IS NOT NULL THEN
        UPDATE users 
        SET words_used = words_used + NEW.word_count 
        WHERE id = NEW.user_id;
    END IF;
END //

DELIMITER ;

-- =====================================================
-- ÉVÉNEMENTS PROGRAMMÉS (CRON JOBS)
-- =====================================================

-- Activer le planificateur d'événements
SET GLOBAL event_scheduler = ON;

-- Nettoyage quotidien des anciennes données
CREATE EVENT IF NOT EXISTS daily_cleanup
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
  CALL CleanOldData();

-- Mise à jour des statistiques globales (toutes les heures)
CREATE EVENT IF NOT EXISTS hourly_stats_update
ON SCHEDULE EVERY 1 HOUR
STARTS CURRENT_TIMESTAMP
DO
  INSERT INTO usage_stats (user_id, date, words_translated, api_requests)
  SELECT NULL, CURDATE(), 
         COALESCE(SUM(word_count), 0), 
         COUNT(*)
  FROM translations 
  WHERE created_at >= CURDATE() AND created_at < DATE_ADD(CURDATE(), INTERVAL 1 DAY)
  ON DUPLICATE KEY UPDATE
    words_translated = VALUES(words_translated),
    api_requests = VALUES(api_requests),
    updated_at = CURRENT_TIMESTAMP;

-- =====================================================
-- PERMISSIONS ET SÉCURITÉ
-- =====================================================

-- Créer un utilisateur pour l'application (optionnel, selon votre configuration)
-- CREATE USER 'translate_app'@'%' IDENTIFIED BY 'secure_password_here';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON cp2111737p21_translate.* TO 'translate_app'@'%';
-- FLUSH PRIVILEGES;

-- =====================================================
-- SCRIPT TERMINÉ
-- =====================================================

-- Afficher un résumé de la création
SELECT 'Base de données créée avec succès!' as status;
SELECT TABLE_NAME, TABLE_ROWS 
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'cp2111737p21_translate' 
ORDER BY TABLE_NAME;