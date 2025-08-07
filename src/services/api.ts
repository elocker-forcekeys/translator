import axios from 'axios';
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
        throw new Error(data.message || `HTTP ${response.status}`);
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
      const response = await this.request(API_CONFIG.ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      return response;
    } catch (error) {
      // En cas d'erreur réseau ou serveur indisponible, utiliser la simulation temporaire
      console.warn('API non disponible, utilisation de la simulation:', error);
      
      // Simulation temporaire pour le développement
      if (email === 'admin@translate.forcekeys.com' && password === 'admin123') {
        return {
          success: true,
          data: {
            user: {
              id: '1',
              email: 'admin@translate.forcekeys.com',
              name: 'Administrator',
              role: 'admin',
              plan: 'enterprise',
              wordsUsed: 0,
              wordsLimit: -1,
              apiKey: 'tr_admin_' + Math.random().toString(36).substr(2, 16),
              emailVerified: true
            },
            token: 'mock_admin_token_' + Date.now()
          }
        };
      }
      
      // Pour les autres utilisateurs, vérifier s'ils existent dans une liste prédéfinie
      const mockUsers = [
        { email: 'user@test.com', password: 'test123', name: 'Test User', role: 'user', plan: 'free' },
        { email: 'pro@test.com', password: 'test123', name: 'Pro User', role: 'user', plan: 'pro' }
      ];
      
      const mockUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (mockUser) {
        return {
          success: true,
          data: {
            user: {
              id: Math.random().toString(36).substr(2, 9),
              email: mockUser.email,
              name: mockUser.name,
              role: mockUser.role as 'user' | 'admin',
              plan: mockUser.plan as 'free' | 'pro' | 'enterprise',
              wordsUsed: 0,
              wordsLimit: mockUser.plan === 'free' ? 2000 : mockUser.plan === 'pro' ? 100000 : -1,
              apiKey: 'tr_' + Math.random().toString(36).substr(2, 32),
              emailVerified: true
            },
            token: 'mock_token_' + Date.now()
          }
        };
      }
      
      // Utilisateur non trouvé
      return {
        success: false,
        error: 'Email ou mot de passe incorrect'
      };
    }
  }

  async register(email: string, password: string, name: string): Promise<ApiResponse<{ user: any; token: string }>> {
    try {
      const response = await this.request(API_CONFIG.ENDPOINTS.REGISTER, {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      });
      
      return response;
    } catch (error) {
      // Simulation temporaire pour le développement
      console.warn('API non disponible, utilisation de la simulation:', error);
      
      // Vérifier si l'email existe déjà (simulation)
      const existingEmails = ['admin@translate.forcekeys.com', 'user@test.com', 'pro@test.com'];
      
      if (existingEmails.includes(email)) {
        return {
          success: false,
          error: 'Cet email est déjà utilisé'
        };
      }
      
      // Créer un nouvel utilisateur (simulation)
      return {
        success: true,
        data: {
          user: {
            id: Math.random().toString(36).substr(2, 9),
            email,
            name,
            role: 'user',
            plan: 'free',
            wordsUsed: 0,
            wordsLimit: 2000,
            apiKey: 'tr_' + Math.random().toString(36).substr(2, 32),
            emailVerified: false
          },
          token: 'mock_token_' + Date.now()
        }
      };
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
      // Si l'API n'est pas disponible, essayer de récupérer depuis le localStorage
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        return {
          success: true,
          data: JSON.parse(savedUser)
        };
      }
      
      return {
        success: false,
        error: 'Utilisateur non trouvé'
      };
    }
  }

  async updateProfile(data: any): Promise<ApiResponse<any>> {
    try {
      return await this.request(API_CONFIG.ENDPOINTS.PROFILE, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch (error) {
      // Simulation de mise à jour réussie
      return { success: true, data };
    }
  }


  // Translation methods



async translate(data: {
  text: string;
  sourceLang: string;
  targetLang: string;
}): Promise<ApiResponse<{ translation: string; detectedLanguage?: string }>> {
  try {
    const response = await axios.post(API_CONFIG.TRANSLATION_API_URL, {
      text: data.text,
      sourceLang: data.sourceLang,
      targetLang: data.targetLang
    }, {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      timeout: 10000 // 10 secondes timeout
    });

    return {
      success: true,
      data: {
        translation: response.data.translation,
        detectedLanguage: response.data.detected_language
      }
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        status: error.response?.status
      };
    }
    return {
      success: false,
      error: 'Unknown error'
    };
  }
}








// OCR
  async translateOCR(formData: FormData): Promise<ApiResponse<{ 
    extractedText: string; 
    translation: string; 
    processedImage?: string;
  }>> {
    return this.request(API_CONFIG.ENDPOINTS.OCR, {
      method: 'POST',
      body: formData,
      headers: {
        ...this.getAuthHeaders(),
        // Don't set Content-Type for FormData
      },
    });
  }

  async translatePDF(formData: FormData): Promise<ApiResponse<{ 
    downloadUrl: string; 
    originalText: string; 
    translatedText: string;
  }>> {
    return this.request(API_CONFIG.ENDPOINTS.PDF, {
      method: 'POST',
      body: formData,
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async getSupportedLanguages(): Promise<ApiResponse<Array<{
    code: string;
    name: string;
    flag: string;
  }>>> {
    return this.request(API_CONFIG.ENDPOINTS.LANGUAGES);
  }

  async getTranslationHistory(page = 1, limit = 20): Promise<PaginatedResponse<any>> {
    return this.request(`${API_CONFIG.ENDPOINTS.HISTORY}?page=${page}&limit=${limit}`);
  }

  // User methods
  async getUsage(): Promise<ApiResponse<{
    wordsUsed: number;
    wordsLimit: number;
    requestsThisMonth: number;
    requestsLimit: number;
  }>> {
    return this.request(API_CONFIG.ENDPOINTS.USAGE);
  }

  async getSubscription(): Promise<ApiResponse<{
    plan: string;
    status: string;
    renewsAt: string;
    features: string[];
  }>> {
    return this.request(API_CONFIG.ENDPOINTS.SUBSCRIPTION);
  }

  // Admin methods
  async getAdminStats(): Promise<ApiResponse<{
    totalUsers: number;
    translationsToday: number;
    revenueThisMonth: number;
    conversionRate: number;
  }>> {
    return this.request(API_CONFIG.ENDPOINTS.ADMIN_STATS);
  }

  async getAdminUsers(page = 1, limit = 20): Promise<PaginatedResponse<any>> {
    return this.request(`${API_CONFIG.ENDPOINTS.ADMIN_USERS}?page=${page}&limit=${limit}`);
  }

  async updateAdminSettings(settings: any): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.ADMIN_SETTINGS, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Billing methods
  async getPlans(): Promise<ApiResponse<Array<{
    id: string;
    name: string;
    price: number;
    features: string[];
    wordsLimit: number;
  }>>> {
    return this.request(API_CONFIG.ENDPOINTS.PLANS);
  }

  async getBillingHistory(): Promise<ApiResponse<Array<{
    id: string;
    amount: number;
    date: string;
    status: string;
    description: string;
  }>>> {
    return this.request(API_CONFIG.ENDPOINTS.BILLING);
  }

  async createPayment(planId: string): Promise<ApiResponse<{
    paymentUrl: string;
    sessionId: string;
  }>> {
    return this.request(API_CONFIG.ENDPOINTS.PAYMENT, {
      method: 'POST',
      body: JSON.stringify({ planId }),
    });
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

    return this.request(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }
}

export const apiService = new ApiService();
export default apiService;
