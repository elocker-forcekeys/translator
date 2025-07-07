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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index pour la table users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_api_key ON users(api_key);
CREATE INDEX idx_users_plan ON users(plan);
CREATE INDEX idx_users_created_at ON users(created_at);

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
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index pour la table translations
CREATE INDEX idx_translations_user_created ON translations(user_id, created_at);
CREATE INDEX idx_translations_created_at ON translations(created_at);
CREATE INDEX idx_translations_source_lang ON translations(source_language);
CREATE INDEX idx_translations_target_lang ON translations(target_language);
CREATE INDEX idx_translations_type ON translations(translation_type);

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
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index pour la table subscriptions
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);

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
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index pour la table payments
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);

-- Table des langues supportées
CREATE TABLE IF NOT EXISTS supported_languages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    native_name VARCHAR(100) NULL,
    flag VARCHAR(10) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index pour la table supported_languages
CREATE INDEX idx_languages_code ON supported_languages(code);
CREATE INDEX idx_languages_active ON supported_languages(is_active);
CREATE INDEX idx_languages_sort ON supported_languages(sort_order);

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
    UNIQUE KEY unique_user_date (user_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index pour la table usage_stats
CREATE INDEX idx_usage_stats_date ON usage_stats(date);
CREATE INDEX idx_usage_stats_user_date ON usage_stats(user_id, date);

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
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index pour la table api_logs
CREATE INDEX idx_api_logs_user_created ON api_logs(user_id, created_at);
CREATE INDEX idx_api_logs_endpoint_created ON api_logs(endpoint, created_at);
CREATE INDEX idx_api_logs_status_code ON api_logs(status_code);
CREATE INDEX idx_api_logs_created_at ON api_logs(created_at);

-- Table des paramètres système
CREATE TABLE IF NOT EXISTS system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NULL,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index pour la table system_settings
CREATE INDEX idx_settings_key ON system_settings(setting_key);
CREATE INDEX idx_settings_public ON system_settings(is_public);

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
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index pour la table user_sessions
CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at);

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
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index pour la table uploaded_files
CREATE INDEX idx_files_user_id ON uploaded_files(user_id);
CREATE INDEX idx_files_type ON uploaded_files(file_type);
CREATE INDEX idx_files_status ON uploaded_files(status);
CREATE INDEX idx_files_created_at ON uploaded_files(created_at);

-- =====================================================
-- INSERTION DES DONNÉES INITIALES
-- =====================================================

-- Langues supportées (principales)
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
('kn', 'Kannada', 'ಕನ್ನಡ', '🇮🇳', 50);

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
-- Hash bcrypt pour 'admin123': $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uDfS
INSERT INTO users (email, password_hash, name, role, plan, words_limit, email_verified) VALUES
('admin@translate.forcekeys.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uDfS', 'Administrator', 'admin', 'enterprise', -1, true);

-- =====================================================
-- TRIGGERS POUR GÉNÉRATION AUTOMATIQUE
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
-- SCRIPT TERMINÉ
-- =====================================================

SELECT 'Base de données créée avec succès!' as status;
SELECT 'Tables créées: users, translations, subscriptions, payments, supported_languages, usage_stats, api_logs, system_settings, user_sessions, uploaded_files' as tables_created;
SELECT 'Utilisateur admin créé: admin@translate.forcekeys.com (mot de passe: admin123)' as admin_user;
SELECT 'Langues supportées: 50+ langues ajoutées' as languages_added;