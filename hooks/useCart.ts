import { useState, useEffect } from 'react';
import { masterJacobsAPI, Cart, CartItem as APICartItem, StoreConfig } from '../lib/api';
import { products } from '../lib/constants';

export interface CartItem {
  id: string;
  productId: number;
  name: string;
  category: string;
  variant?: string;
  price: number;
  image: string;
  quantity: number;
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<number | null>(null);
  const [storeConfig, setStoreConfig] = useState<StoreConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize cart and store config
  useEffect(() => {
    initializeCart();
  }, []);

  const initializeCart = async () => {
    try {
      setIsLoading(true);
      
      // Load store configuration
      const config = await masterJacobsAPI.getStoreInfo();
      setStoreConfig(config);
      
      // Get or create cart
      const apiCart = await masterJacobsAPI.getCart();
      setCartId(apiCart.id);
      
      // Convert API cart items to local format
      const localItems: CartItem[] = apiCart.orderLines.map(item => ({
        id: item.id,
        productId: item.productId,
        name: item.name,
        category: 'unknown', // Map from API if available
        price: item.price,
        quantity: item.quantity,
        image: item.image || '',
        variant: item.variant
      }));
      
      setCart(localItems);
    } catch (error) {
      console.error('Error initializing cart:', error);
      // Fallback to localStorage if API fails
      loadFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    const savedCart = localStorage.getItem('masterjacobs-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  };

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('masterjacobs-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = async (product: typeof products[0]) => {
    try {
      if (cartId) {
        // Try to add to API cart
        await masterJacobsAPI.addToCart(cartId, product.id, 1);
      }
      
      // Update local state
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.productId === product.id);
        if (existingItem) {
          return prevCart.map(item =>
            item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        
        const price = parseInt(product.price.replace(' kr', ''));
        return [...prevCart, { 
          id: `local-${Date.now()}-${product.id}`,
          productId: product.id,
          name: product.name,
          category: product.category,
          variant: product.variant,
          price: price,
          image: product.image,
          quantity: 1 
        }];
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      // Fallback to local-only cart
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.productId === product.id);
        if (existingItem) {
          return prevCart.map(item =>
            item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        
        const price = parseInt(product.price.replace(' kr', ''));
        return [...prevCart, { 
          id: `local-${Date.now()}-${product.id}`,
          productId: product.id,
          name: product.name,
          category: product.category,
          variant: product.variant,
          price: price,
          image: product.image,
          quantity: 1 
        }];
      });
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  const updateCartQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const getTotalWithDelivery = (postalCode?: string) => {
    const subtotal = getTotalPrice();
    if (!storeConfig || !postalCode) return subtotal;
    
    const deliveryFee = masterJacobsAPI.calculateDeliveryFee(subtotal, storeConfig);
    return deliveryFee >= 0 ? subtotal + deliveryFee : subtotal;
  };

  const getDeliveryInfo = (postalCode?: string) => {
    if (!storeConfig || !postalCode) return null;
    
    const subtotal = getTotalPrice();
    const deliveryFee = masterJacobsAPI.calculateDeliveryFee(subtotal, storeConfig);
    const isEligible = deliveryFee >= 0;
    const isFree = deliveryFee === 0;
    
    return {
      eligible: isEligible,
      fee: deliveryFee,
      free: isFree,
      minRequired: storeConfig.minCartPriceForDelivery,
      freeThreshold: storeConfig.freeDeliveryThreshold,
      canDeliver: masterJacobsAPI.checkDeliveryAvailability(postalCode || '', storeConfig.cities)
    };
  };

  const formatPrice = (price: number) => {
    return storeConfig ? 
      `${price} ${storeConfig.currencySymbol}` : 
      `${price} kr`;
  };

  const getOrderingStatus = () => {
    if (!storeConfig) return null;
    
    const today = new Date().toLocaleLowerCase().slice(0, 3); // 'mon', 'tue', etc.
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][new Date().getDay()];
    
    return masterJacobsAPI.isOrderingAllowed(dayName, storeConfig);
  };

  return {
    cart,
    cartId,
    storeConfig,
    isLoading,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getTotalItems,
    getTotalPrice,
    getTotalWithDelivery,
    getDeliveryInfo,
    getOrderingStatus,
    formatPrice
  };
}