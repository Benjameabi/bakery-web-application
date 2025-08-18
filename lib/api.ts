// Mäster Jacobs API Integration
// Based on discovered API endpoints from masterjacobs.se

// API Configuration
const API_BASE = 'https://www.masterjacobs.se/shop/api/store';
const BAKERY_ID = 'master-jacobs-bageri-konditori';

// API Endpoints
export const API_ENDPOINTS = {
  bakeryInfo: `${API_BASE}/bakeries/${BAKERY_ID}/web-shop/`,
  cart: `${API_BASE}/cart/`,
  products: `${API_BASE}/products/`,
  orders: `${API_BASE}/orders/`,
  sessions: `${API_BASE}/sessions/`,
  outlets: `${API_BASE}/bakeries/378/outlets/`,
  // Frontend URLs
  webshop: 'https://www.masterjacobs.se/shop/',
  // i18n Resources
  i18n: {
    main: 'https://www.masterjacobs.se/shop/assets/i18n/sv.json',
    marketplace: 'https://www.masterjacobs.se/shop/assets/i18n/marketplace/sv.json',
    bakery: 'https://www.masterjacobs.se/shop/assets/i18n/bakery-site/sv.json',
    widget: 'https://www.masterjacobs.se/shop/assets/i18n/widget/sv.json',
    countries: 'https://www.masterjacobs.se/shop/assets/i18n/countries/sv.json',
    references: 'https://www.masterjacobs.se/shop/assets/i18n/references/sv.json'
  }
} as const;

// Store Configuration from API Response
export interface StoreConfig {
  id: number;
  name: string;
  email: string;
  phone: string;
  currency: string;
  currencySymbol: string;
  cities: string[];
  minCartPriceForDelivery: number;
  freeDeliveryThreshold: number;
  deliveryDeposit: number;
  invoiceFee: number;
  maxDeliveryPrice: number;
  schedule: Record<string, {
    orderBefore: number; // minutes from midnight
    dayOff: boolean;
    daysBefore: number;
  }>;
}

// Cart Item Interface
export interface CartItem {
  id: string;
  productId: number;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image?: string;
}

// Cart Interface from API
export interface Cart {
  id: number;
  type: string;
  customer: any;
  price: number;
  priceWithoutVat: number;
  discount: number;
  promoCode: string | null;
  orderLines: CartItem[];
  key: string;
  createdDate: string;
  modifiedDate: string;
}

// Session Interface
export interface Session {
  key: string;
}

// Outlet/Store Location Interface
export interface Outlet {
  id: number;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  openingHours: Record<string, any>;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Internationalization Interface
export interface I18nTranslations {
  allergens: {
    canBeFreeOfSynonyms: Record<string, string>;
  };
  cakeBuilder: {
    allergensStateLabels: Record<string, string>;
    cakeSizesSection: {
      helpText: string;
      title: string;
    };
    cakeVariantsSection: {
      title: string;
    };
  };
  titles: Record<string, string>;
  [key: string]: any;
}

// API Service Class
export class MasterJacobsAPI {
  private static instance: MasterJacobsAPI;
  
  public static getInstance(): MasterJacobsAPI {
    if (!MasterJacobsAPI.instance) {
      MasterJacobsAPI.instance = new MasterJacobsAPI();
    }
    return MasterJacobsAPI.instance;
  }

  // Fetch store configuration
  async getStoreInfo(): Promise<StoreConfig> {
    try {
      const response = await fetch(API_ENDPOINTS.bakeryInfo);
      const data = await response.json();
      
      return {
        id: data.bakery.id,
        name: data.bakery.name,
        email: data.bakery.email,
        phone: data.bakery.phone,
        currency: data.bakery.country.currency,
        currencySymbol: data.bakery.country.currency_symbol,
        cities: data.bakery.cities,
        minCartPriceForDelivery: data.bakery.min_cart_price_allows_delivery,
        freeDeliveryThreshold: data.bakery.min_cart_price_allows_free_delivery,
        deliveryDeposit: data.bakery.delivery_deposit,
        invoiceFee: data.bakery.area.invoice_fee,
        maxDeliveryPrice: data.bakery.max_delivery_price,
        schedule: data.bakery.schedule,
      };
    } catch (error) {
      console.error('Error fetching store info:', error);
      throw new Error('Failed to fetch store information');
    }
  }

  // Create or get cart
  async getCart(): Promise<Cart> {
    try {
      const response = await fetch(API_ENDPOINTS.cart, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating/getting cart:', error);
      throw new Error('Failed to access cart');
    }
  }

  // Add item to cart
  async addToCart(cartId: number, productId: number, quantity: number = 1): Promise<Cart> {
    try {
      const response = await fetch(`${API_ENDPOINTS.cart}${cartId}/items/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: quantity,
        }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw new Error('Failed to add item to cart');
    }
  }

  // Check if delivery is available for postal code
  checkDeliveryAvailability(postalCode: string, cities: string[]): boolean {
    // Based on API data, delivery is available in Västerås
    const cleanCode = postalCode.replace(/\s/g, '');
    // Västerås postal codes typically start with 72x
    return cleanCode.startsWith('72') && cleanCode.length === 5;
  }

  // Calculate delivery cost
  calculateDeliveryFee(cartTotal: number, config: StoreConfig): number {
    if (cartTotal >= config.freeDeliveryThreshold) {
      return 0; // Free delivery
    }
    if (cartTotal >= config.minCartPriceForDelivery) {
      return Math.min(config.maxDeliveryPrice, config.deliveryDeposit);
    }
    return -1; // Not eligible for delivery
  }

  // Check if ordering is allowed based on schedule
  isOrderingAllowed(day: string, config: StoreConfig): {
    allowed: boolean;
    deadline?: string;
    message?: string;
  } {
    const schedule = config.schedule[day.toLowerCase()];
    if (!schedule) {
      return { allowed: false, message: 'Schedule not available' };
    }

    if (schedule.dayOff) {
      return { 
        allowed: false, 
        message: 'Beställningar stängda denna dag' 
      };
    }

    const deadlineHours = Math.floor(schedule.orderBefore / 60);
    const deadlineMinutes = schedule.orderBefore % 60;
    const deadline = `${deadlineHours.toString().padStart(2, '0')}:${deadlineMinutes.toString().padStart(2, '0')}`;

    return {
      allowed: true,
      deadline,
      message: `Beställ före ${deadline} för leverans ${schedule.daysBefore === 1 ? 'imorgon' : `om ${schedule.daysBefore} dagar`}`
    };
  }

  // Session Management
  async createSession(): Promise<Session> {
    try {
      const response = await fetch(API_ENDPOINTS.sessions, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating session:', error);
      throw new Error('Failed to create session');
    }
  }

  // Get store outlets/locations
  async getOutlets(): Promise<Outlet[]> {
    try {
      const response = await fetch(API_ENDPOINTS.outlets);
      const data = await response.json();
      return data.outlets || data || [];
    } catch (error) {
      console.error('Error fetching outlets:', error);
      throw new Error('Failed to fetch store locations');
    }
  }

  // Load Swedish translations
  async getTranslations(module: keyof typeof API_ENDPOINTS.i18n = 'main'): Promise<I18nTranslations> {
    try {
      const response = await fetch(API_ENDPOINTS.i18n[module]);
      return await response.json();
    } catch (error) {
      console.error(`Error loading ${module} translations:`, error);
      throw new Error(`Failed to load ${module} translations`);
    }
  }

  // Get allergen information in Swedish
  async getAllergenInfo(): Promise<Record<string, string>> {
    try {
      const translations = await this.getTranslations('main');
      return translations.allergens?.canBeFreeOfSynonyms || {};
    } catch (error) {
      console.error('Error fetching allergen info:', error);
      return {};
    }
  }

  // Get cake builder texts
  async getCakeBuilderTexts(): Promise<any> {
    try {
      const translations = await this.getTranslations('main');
      return translations.cakeBuilder || {};
    } catch (error) {
      console.error('Error fetching cake builder texts:', error);
      return {};
    }
  }
}

// Export singleton instance
export const masterJacobsAPI = MasterJacobsAPI.getInstance();

// Utility functions
export const formatPrice = (price: number, symbol: string = 'kr'): string => {
  return `${price} ${symbol}`;
};

export const isValidSwedishPostalCode = (code: string): boolean => {
  const cleaned = code.replace(/\s/g, '');
  return /^\d{5}$/.test(cleaned);
};
