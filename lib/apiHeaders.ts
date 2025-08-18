// API Headers and Authentication for Mäster Jacobs APIs
// Based on discovered endpoints from masterjacobs.se

export interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  sessionKey?: string;
}

export class ApiHeaderManager {
  private static sessionKey: string | null = null;
  private static userAgent = 'MasterJacobs-WebApp/1.0';

  // Set session key for authenticated requests
  static setSessionKey(key: string) {
    this.sessionKey = key;
  }

  // Get common headers for API requests
  static getCommonHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': this.userAgent,
      // Swedish locale
      'Accept-Language': 'sv-SE,sv;q=0.9,en;q=0.8',
      // CORS headers
      'X-Requested-With': 'XMLHttpRequest'
    };

    // Add session key if available
    if (this.sessionKey) {
      headers['X-Session-Key'] = this.sessionKey;
      headers['Authorization'] = `Bearer ${this.sessionKey}`;
    }

    return headers;
  }

  // Get headers for cart operations
  static getCartHeaders(cartId?: number): Record<string, string> {
    const headers = this.getCommonHeaders();
    
    if (cartId) {
      headers['X-Cart-ID'] = cartId.toString();
    }

    return headers;
  }

  // Get headers for store/bakery operations
  static getBakeryHeaders(): Record<string, string> {
    const headers = this.getCommonHeaders();
    
    // Bakery-specific headers
    headers['X-Bakery-ID'] = '378';
    headers['X-Store-Key'] = 'master-jacobs-bageri-konditori';
    
    return headers;
  }

  // Get headers for i18n requests
  static getI18nHeaders(): Record<string, string> {
    return {
      'Accept': 'application/json',
      'Accept-Language': 'sv-SE,sv;q=0.9',
      'Cache-Control': 'public, max-age=3600', // Cache translations for 1 hour
      'User-Agent': this.userAgent
    };
  }

  // Get headers for geolocation/maps requests
  static getMapsHeaders(): Record<string, string> {
    return {
      'Accept': 'application/json',
      'User-Agent': this.userAgent,
      'Referer': 'https://www.masterjacobs.se/'
    };
  }

  // Create configured fetch request
  static async makeRequest(url: string, config: ApiRequestConfig = {}): Promise<Response> {
    const {
      method = 'GET',
      headers: customHeaders = {},
      body,
      sessionKey
    } = config;

    // Set session key if provided
    if (sessionKey) {
      this.setSessionKey(sessionKey);
    }

    const headers = {
      ...this.getCommonHeaders(),
      ...customHeaders
    };

    const requestConfig: RequestInit = {
      method,
      headers,
      mode: 'cors',
      credentials: 'include', // Include cookies for session management
    };

    if (body && method !== 'GET') {
      requestConfig.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    try {
      const response = await fetch(url, requestConfig);
      
      // Handle session updates from response
      const newSessionKey = response.headers.get('X-New-Session-Key');
      if (newSessionKey) {
        this.setSessionKey(newSessionKey);
      }

      return response;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Specialized request methods
  static async getWithSession(url: string, sessionKey?: string): Promise<Response> {
    return this.makeRequest(url, { 
      method: 'GET',
      sessionKey,
      headers: this.getCommonHeaders()
    });
  }

  static async postWithCart(url: string, data: any, cartId?: number): Promise<Response> {
    return this.makeRequest(url, {
      method: 'POST',
      headers: this.getCartHeaders(cartId),
      body: data
    });
  }

  static async getBakeryData(url: string): Promise<Response> {
    return this.makeRequest(url, {
      method: 'GET',
      headers: this.getBakeryHeaders()
    });
  }

  // Error handling utilities
  static async handleApiResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }

    throw new Error('Invalid response format');
  }
}

// Export common API configurations
export const API_CONFIGS = {
  // Session management
  SESSION: {
    endpoint: 'https://www.masterjacobs.se/shop/api/store/sessions/',
    method: 'POST' as const,
    headers: ApiHeaderManager.getCommonHeaders()
  },

  // Cart operations
  CART: {
    endpoint: 'https://www.masterjacobs.se/shop/api/store/cart/',
    headers: (cartId?: number) => ApiHeaderManager.getCartHeaders(cartId)
  },

  // Store information
  BAKERY: {
    endpoint: 'https://www.masterjacobs.se/shop/api/store/bakeries/master-jacobs-bageri-konditori/web-shop/',
    headers: ApiHeaderManager.getBakeryHeaders()
  },

  // Store locations
  OUTLETS: {
    endpoint: 'https://www.masterjacobs.se/shop/api/store/bakeries/378/outlets/',
    headers: ApiHeaderManager.getBakeryHeaders()
  },

  // Internationalization
  I18N: {
    main: 'https://www.masterjacobs.se/shop/assets/i18n/sv.json',
    marketplace: 'https://www.masterjacobs.se/shop/assets/i18n/marketplace/sv.json',
    bakery: 'https://www.masterjacobs.se/shop/assets/i18n/bakery-site/sv.json',
    widget: 'https://www.masterjacobs.se/shop/assets/i18n/widget/sv.json',
    countries: 'https://www.masterjacobs.se/shop/assets/i18n/countries/sv.json',
    references: 'https://www.masterjacobs.se/shop/assets/i18n/references/sv.json',
    headers: ApiHeaderManager.getI18nHeaders()
  },

  // Google Maps integration
  MAPS: {
    headers: ApiHeaderManager.getMapsHeaders()
  }
} as const;

// Export utility functions
export const createApiRequest = ApiHeaderManager.makeRequest.bind(ApiHeaderManager);
export const handleApiResponse = ApiHeaderManager.handleApiResponse.bind(ApiHeaderManager);
