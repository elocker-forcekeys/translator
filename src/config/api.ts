// Configuration API pour le domaine translate.forcekeys.com
export const API_CONFIG = {
  BASE_URL: 'https://translateapi.forcekeys.com/api/v1',
  TRANSLATION_API_URL: 'https://translateapi.forcekeys.com/api/v1/translate',
  ENDPOINTS: {
    // Auth
    LOGIN: '/auth/login',
    REGISTER: '/auth//register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
    
    // Translation
    TRANSLATE: '/translate',
    OCR: '/ocr',
    PDF: '/pdf',
    LANGUAGES: '/languages',
    HISTORY: '/history',
    
    // User
    USERS: '/users',
    USAGE: '/usage',
    SUBSCRIPTION: '/subscription',
    
    // Admin
    ADMIN_STATS: '/admin/stats',
    ADMIN_USERS: '/admin/users',
    ADMIN_SETTINGS: '/admin/settings',
    
    // Billing
    PLANS: '/plans',
    BILLING: '/billing',
    PAYMENT: '/payment'
  },
  
  // Headers par défaut
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  
  // Timeouts
  TIMEOUT: 30000, // 30 secondes
  
  // Retry configuration
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000 // 1 seconde
};

// Types pour les réponses API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Configuration de base de données (pour référence backend)
export const DB_CONFIG = {
  HOST: '91.234.194.20',
  USERNAME: 'cp2111737p21_translate',
  PASSWORD: '2J)ewo=OuYQk',
  DATABASE: 'cp2111737p21_translate',
  PORT: 3306,
  CHARSET: 'utf8mb4',
  TIMEZONE: '+00:00'
};

// Langues supportées avec leurs codes ISO
export const SUPPORTED_LANGUAGES = [
  { code: 'auto', name: 'Auto-detect', flag: '🌐' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴' },
  { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'he', name: 'עברית', flag: '🇮🇱' },
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
  { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' },
  { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'bg', name: 'Български', flag: '🇧🇬' },
  { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
  { code: 'sr', name: 'Српски', flag: '🇷🇸' },
  { code: 'sl', name: 'Slovenščina', flag: '🇸🇮' },
  { code: 'et', name: 'Eesti', flag: '🇪🇪' },
  { code: 'lv', name: 'Latviešu', flag: '🇱🇻' },
  { code: 'lt', name: 'Lietuvių', flag: '🇱🇹' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'be', name: 'Беларуская', flag: '🇧🇾' },
  { code: 'mk', name: 'Македонски', flag: '🇲🇰' },
  { code: 'mt', name: 'Malti', flag: '🇲🇹' },
  { code: 'is', name: 'Íslenska', flag: '🇮🇸' },
  { code: 'ga', name: 'Gaeilge', flag: '🇮🇪' },
  { code: 'cy', name: 'Cymraeg', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  { code: 'eu', name: 'Euskera', flag: '🏴󠁥󠁳󠁰󠁶󠁿' },
  { code: 'ca', name: 'Català', flag: '🏴󠁥󠁳󠁣󠁴󠁿' },
  { code: 'gl', name: 'Galego', flag: '🏴󠁥󠁳󠁧󠁡󠁿' },
  { code: 'af', name: 'Afrikaans', flag: '🇿🇦' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
  { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  { code: 'ne', name: 'नेपाली', flag: '🇳🇵' },
  { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'si', name: 'සිංහල', flag: '🇱🇰' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  { code: 'ps', name: 'پښتو', flag: '🇦🇫' },
  { code: 'sd', name: 'سنڌي', flag: '🇵🇰' },
  { code: 'ug', name: 'ئۇيغۇرچە', flag: '🇨🇳' },
  { code: 'uz', name: 'Oʻzbekcha', flag: '🇺🇿' },
  { code: 'kk', name: 'Қазақша', flag: '🇰🇿' },
  { code: 'ky', name: 'Кыргызча', flag: '🇰🇬' },
  { code: 'tg', name: 'Тоҷикӣ', flag: '🇹🇯' },
  { code: 'tk', name: 'Türkmençe', flag: '🇹🇲' },
  { code: 'mn', name: 'Монгол', flag: '🇲🇳' },
  { code: 'my', name: 'မြန်မာ', flag: '🇲🇲' },
  { code: 'km', name: 'ខ្មែរ', flag: '🇰🇭' },
  { code: 'lo', name: 'ລາວ', flag: '🇱🇦' },
  { code: 'ka', name: 'ქართული', flag: '🇬🇪' },
  { code: 'hy', name: 'Հայերեն', flag: '🇦🇲' },
  { code: 'az', name: 'Azərbaycan', flag: '🇦🇿' },
  { code: 'sq', name: 'Shqip', flag: '🇦🇱' },
  { code: 'bs', name: 'Bosanski', flag: '🇧🇦' },
  { code: 'me', name: 'Crnogorski', flag: '🇲🇪' },
  { code: 'lb', name: 'Lëtzebuergesch', flag: '🇱🇺' },
  { code: 'fo', name: 'Føroyskt', flag: '🇫🇴' },
  { code: 'gd', name: 'Gàidhlig', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { code: 'br', name: 'Brezhoneg', flag: '🇫🇷' },
  { code: 'co', name: 'Corsu', flag: '🇫🇷' },
  { code: 'oc', name: 'Occitan', flag: '🇫🇷' },
  { code: 'rm', name: 'Rumantsch', flag: '🇨🇭' },
  { code: 'fur', name: 'Furlan', flag: '🇮🇹' },
  { code: 'sc', name: 'Sardu', flag: '🇮🇹' },
  { code: 'vec', name: 'Vèneto', flag: '🇮🇹' },
  { code: 'lij', name: 'Ligure', flag: '🇮🇹' },
  { code: 'pms', name: 'Piemontèis', flag: '🇮🇹' },
  { code: 'lmo', name: 'Lombard', flag: '🇮🇹' },
  { code: 'eml', name: 'Emiliàn', flag: '🇮🇹' },
  { code: 'nap', name: 'Napulitano', flag: '🇮🇹' },
  { code: 'scn', name: 'Sicilianu', flag: '🇮🇹' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'tl', name: 'Filipino', flag: '🇵🇭' },
  { code: 'ceb', name: 'Cebuano', flag: '🇵🇭' },
  { code: 'haw', name: 'ʻŌlelo Hawaiʻi', flag: '🇺🇸' },
  { code: 'mi', name: 'Te Reo Māori', flag: '🇳🇿' },
  { code: 'sm', name: 'Gagana Samoa', flag: '🇼🇸' },
  { code: 'to', name: 'Lea Faka-Tonga', flag: '🇹🇴' },
  { code: 'fj', name: 'Na Vosa Vakaviti', flag: '🇫🇯' },
  { code: 'mg', name: 'Malagasy', flag: '🇲🇬' },
  { code: 'ny', name: 'Chichewa', flag: '🇲🇼' },
  { code: 'sn', name: 'ChiShona', flag: '🇿🇼' },
  { code: 'st', name: 'Sesotho', flag: '🇱🇸' },
  { code: 'tn', name: 'Setswana', flag: '🇧🇼' },
  { code: 'ts', name: 'Xitsonga', flag: '🇿🇦' },
  { code: 've', name: 'Tshivenda', flag: '🇿🇦' },
  { code: 'xh', name: 'isiXhosa', flag: '🇿🇦' },
  { code: 'zu', name: 'isiZulu', flag: '🇿🇦' },
  { code: 'ig', name: 'Igbo', flag: '🇳🇬' },
  { code: 'yo', name: 'Yorùbá', flag: '🇳🇬' },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
  { code: 'ff', name: 'Fulfulde', flag: '🇸🇳' },
  { code: 'wo', name: 'Wolof', flag: '🇸🇳' },
  { code: 'bm', name: 'Bamanankan', flag: '🇲🇱' },
  { code: 'ee', name: 'Eʋegbe', flag: '🇬🇭' },
  { code: 'tw', name: 'Twi', flag: '🇬🇭' },
  { code: 'ak', name: 'Akan', flag: '🇬🇭' },
  { code: 'lg', name: 'Luganda', flag: '🇺🇬' },
  { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' },
  { code: 'rn', name: 'Kirundi', flag: '🇧🇮' },
  { code: 'so', name: 'Soomaali', flag: '🇸🇴' },
  { code: 'om', name: 'Afaan Oromoo', flag: '🇪🇹' },
  { code: 'ti', name: 'ትግርኛ', flag: '🇪🇷' }
];

// Plans de tarification
export const PRICING_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    wordsLimit: 2000,
    features: ['2000 words/month', 'Basic text translation', 'Email support', 'Web access only']
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 19,
    wordsLimit: 100000,
    features: ['100K words/month', 'Text, image, PDF translation', 'Priority support', 'API access', 'Unlimited history']
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    wordsLimit: -1, // Unlimited
    features: ['Unlimited words', 'All Pro features', '24/7 dedicated support', 'High-performance API', 'Custom integrations', 'Team dashboard', '99.9% SLA']
  }
};