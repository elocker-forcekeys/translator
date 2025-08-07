import { API_CONFIG, ApiResponse, PaginatedResponse } from '../config/api';

class ApiService {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.defaultHeaders = API_CONFIG.DEFAULT_HEADERS;
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      ...this.defaultHeaders,
      ...this.getAuthHeaders(),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email: string, password: string): Promise<ApiResponse<{ user: any; token: string }>> {
    try {
      const response = await this.request<{ user: any; token: string }>(API_CONFIG.ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error instanceof Error ? error.message : 'Erreur de connexion');
    }
  }

  async register(email: string, password: string, name: string): Promise<ApiResponse<{ user: any; token: string }>> {
    try {
      const response = await this.request<{ user: any; token: string }>(API_CONFIG.ENDPOINTS.REGISTER, {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      });
      
      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw new Error(error instanceof Error ? error.message : 'Erreur lors de la création du compte');
    }
  }

  async logout(): Promise<ApiResponse> {
    try {
      return await this.request(API_CONFIG.ENDPOINTS.LOGOUT, {
        method: 'POST',
      });
    } catch (error) {
      // Même en cas d'erreur, considérer la déconnexion comme réussie
      return { success: true };
    }
  }

  async getProfile(): Promise<ApiResponse<any>> {
    try {
      return await this.request(API_CONFIG.ENDPOINTS.PROFILE);
    } catch (error) {
      console.error('Profile error:', error);
      throw new Error(error instanceof Error ? error.message : 'Erreur lors de la récupération du profil');
    }
  }

  async updateProfile(data: any): Promise<ApiResponse<any>> {
    try {
      return await this.request(API_CONFIG.ENDPOINTS.PROFILE, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Update profile error:', error);
      throw new Error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour du profil');
    }
  }

  // Translation methods
  async translate(data: {
    text: string;
    sourceLang: string;
    targetLang: string;
  }): Promise<ApiResponse<{ translation: string; wordCount: number; characterCount: number }>> {
    try {
      const response = await this.request<{ translation: string; wordCount: number; characterCount: number }>(API_CONFIG.ENDPOINTS.TRANSLATE, {
        method: 'POST',
        body: JSON.stringify({
          text: data.text,
          sourceLang: data.sourceLang,
          targetLang: data.targetLang
        }),
      });

      return response;
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error(error instanceof Error ? error.message : 'Erreur lors de la traduction');
    }
  }

  async translateOCR(formData: FormData): Promise<ApiResponse<{ 
    extractedText: string; 
    translation: string; 
    processedImage?: string;
  }>> {
    try {
      return await this.request(API_CONFIG.ENDPOINTS.OCR, {
        method: 'POST',
        body: formData,
        headers: {
          ...this.getAuthHeaders(),
          // Don't set Content-Type for FormData
        },
      });
    } catch (error) {
      console.error('OCR error:', error);
      throw new Error(error instanceof Error ? error.message : 'Erreur lors du traitement de l\'image');
    }
  }

  async translatePDF(formData: FormData): Promise<ApiResponse<{ 
    downloadUrl: string; 
    originalText: string; 
    translatedText: string;
  }>> {
    try {
      return await this.request(API_CONFIG.ENDPOINTS.PDF, {
        method: 'POST',
        body: formData,
        headers: {
          ...this.getAuthHeaders(),
        },
      });
    } catch (error) {
      console.error('PDF error:', error);
      throw new Error(error instanceof Error ? error.message : 'Erreur lors du traitement du PDF');
    }
  }

  async getSupportedLanguages(): Promise<ApiResponse<Array<{
    code: string;
    name: string;
    flag: string;
  }>>> {
    try {
      return await this.request(API_CONFIG.ENDPOINTS.LANGUAGES);
    } catch (error) {
      // En cas d'erreur, retourner les langues par défaut
      return {
        success: true,
        data: [
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
          { code: 'ar', name: 'العربية', flag: '🇸🇦' }
        ]
      };
    }
  }

  async getTranslationHistory(page = 1, limit = 20): Promise<PaginatedResponse<any>> {
    try {
      return await this.request(`${API_CONFIG.ENDPOINTS.HISTORY}?page=${page}&limit=${limit}`);
    } catch (error) {
      console.error('History error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la récupération de l\'historique',
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 }
      };
    }
  }

  // User methods
  async getUsage(): Promise<ApiResponse<{
    wordsUsed: number;
    wordsLimit: number;
    requestsThisMonth: number;
    requestsLimit: number;
  }>> {
    try {
      return await this.request(API_CONFIG.ENDPOINTS.USAGE);
    } catch (error) {
      console.error('Usage error:', error);
      throw new Error(error instanceof Error ? error.message : 'Erreur lors de la récupération des statistiques');
    }
  }

  async getSubscription(): Promise<ApiResponse<{
    plan: string;
    status: string;
    renewsAt: string;
    features: string[];
  }>> {
    try {
      return await this.request(API_CONFIG.ENDPOINTS.SUBSCRIPTION);
    } catch (error) {
      console.error('Subscription error:', error);
      throw new Error(error instanceof Error ? error.message : 'Erreur lors de la récupération de l\'abonnement');
    }
  }

  // Admin methods
  async getAdminStats(): Promise<ApiResponse<{
    totalUsers: number;
    translationsToday: number;
    revenueThisMonth: number;
    conversionRate: number;
  }>> {
    try {
      return await this.request(API_CONFIG.ENDPOINTS.ADMIN_STATS);
    } catch (error) {
      console.error('Admin stats error:', error);
      throw new Error(error instanceof Error ? error.message : 'Erreur lors de la récupération des statistiques admin');
    }
  }

  async getAdminUsers(page = 1, limit = 20): Promise<PaginatedResponse<any>> {
    try {
      return await this.request(`${API_CONFIG.ENDPOINTS.ADMIN_USERS}?page=${page}&limit=${limit}`);
    } catch (error) {
      console.error('Admin users error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la récupération des utilisateurs',
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 }
      };
    }
  }

  async updateAdminSettings(settings: any): Promise<ApiResponse> {
    try {
      return await this.request(API_CONFIG.ENDPOINTS.ADMIN_SETTINGS, {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
    } catch (error) {
      console.error('Admin settings error:', error);
      throw new Error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour des paramètres');
    }
  }

  // Billing methods
  async getPlans(): Promise<ApiResponse<Array<{
    id: string;
    name: string;
    price: number;
    features: string[];
    wordsLimit: number;
  }>>> {
    try {
      return await this.request(API_CONFIG.ENDPOINTS.PLANS);
    } catch (error) {
      console.error('Plans error:', error);
      // Retourner les plans par défaut en cas d'erreur
      return {
        success: true,
        data: [
          {
            id: 'free',
            name: 'Gratuit',
            price: 0,
            wordsLimit: 2000,
            features: ['2000 words/month', 'Basic text translation', 'Email support', 'Web access only']
          },
          {
            id: 'pro',
            name: 'Pro',
            price: 19,
            wordsLimit: 100000,
            features: ['100K words/month', 'Text, image, PDF translation', 'Priority support', 'API access', 'Unlimited history']
          },
          {
            id: 'enterprise',
            name: 'Enterprise',
            price: 99,
            wordsLimit: -1,
            features: ['Unlimited words', 'All Pro features', '24/7 dedicated support', 'High-performance API', 'Custom integrations', 'Team dashboard', '99.9% SLA']
          }
        ]
      };
    }
  }

  async getBillingHistory(): Promise<ApiResponse<Array<{
    id: string;
    amount: number;
    date: string;
    status: string;
    description: string;
  }>>> {
    try {
      return await this.request(API_CONFIG.ENDPOINTS.BILLING);
    } catch (error) {
      console.error('Billing history error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la récupération de l\'historique de facturation',
        data: []
      };
    }
  }

  async createPayment(planId: string): Promise<ApiResponse<{
    paymentUrl: string;
    sessionId: string;
  }>> {
    try {
      return await this.request(API_CONFIG.ENDPOINTS.PAYMENT, {
        method: 'POST',
        body: JSON.stringify({ planId }),
      });
    } catch (error) {
      console.error('Payment error:', error);
      throw new Error(error instanceof Error ? error.message : 'Erreur lors de la création du paiement');
    }
  }

  // File upload helper
  async uploadFile(file: File, endpoint: string, additionalData?: Record<string, string>): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    try {
      return await this.request(endpoint, 
        method: 'POST',
        body: formData,
        headers: {
          ...this.getAuthHeaders(),
        },
      });
    } catch (error) {
      console.error('File upload error:', error);
      throw new Error(error instanceof Error ? error.message : 'Erreur lors de l\'upload du fichier');
    }
  }
}

export const apiService = new ApiService();
export default apiService;