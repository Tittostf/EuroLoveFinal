const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}/api${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          errorData = { detail: `HTTP Error: ${response.status}` };
        }
        
        // Create a more detailed error object
        const error = new Error(errorData.detail || errorData.message || `HTTP Error: ${response.status}`);
        error.response = {
          status: response.status,
          data: errorData
        };
        throw error;
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      
      // If it's a network error, provide a user-friendly message
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        const networkError = new Error('Network error. Please check your internet connection.');
        networkError.response = { data: { detail: 'Network error. Please check your internet connection.' } };
        throw networkError;
      }
      
      throw error;
    }
  }

  // Authentication
  async register(userData) {
    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // User Profile
  async getProfile() {
    return this.request('/profile');
  }

  // Gift System
  async sendGift(giftData) {
    return this.request('/send-gift', {
      method: 'POST',
      body: JSON.stringify(giftData),
    });
  }

  async getGiftHistory() {
    return this.request('/gift-history');
  }

  // Repost System
  async repostAd(escortId) {
    return this.request('/repost', {
      method: 'POST',
      body: JSON.stringify({ escort_id: escortId }),
    });
  }

  async getRepostHistory() {
    return this.request('/repost-history');
  }

  // Leaderboards
  async getClientLeaderboard() {
    return this.request('/leaderboard-clients');
  }

  async getEscortLeaderboard() {
    return this.request('/leaderboard-escorts');
  }

  // Escorts Discovery
  async getEscorts(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/escorts${params.toString() ? `?${params.toString()}` : ''}`);
  }

  // Admin
  async getAdminStats() {
    return this.request('/admin/stats');
  }

  async createAdmin(adminData) {
    return this.request('/admin/create-admin', {
      method: 'POST',
      body: JSON.stringify(adminData),
    });
  }

  // Health Check
  async healthCheck() {
    return this.request('/health');
  }
}

export default new ApiService();