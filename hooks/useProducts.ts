import { useState, useEffect } from 'react';
import { masterJacobsAPI, MasterJacobsProduct } from '../lib/api';

interface ProductsState {
  products: MasterJacobsProduct[];
  isLoading: boolean;
  error: string | null;
  categories: string[];
}

interface ProductFilters {
  category?: string;
  search?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  allergens?: string[];
}

export function useProducts() {
  const [state, setState] = useState<ProductsState>({
    products: [],
    isLoading: false,
    error: null,
    categories: []
  });

  const [filters, setFilters] = useState<ProductFilters>({});

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const products = await masterJacobsAPI.getProducts();
      const categories = [...new Set(products.map(p => p.category))];
      
      setState(prev => ({
        ...prev,
        products,
        categories,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error loading products:', error);
      setState(prev => ({
        ...prev,
        error: 'Kunde inte ladda produkter',
        isLoading: false
      }));
    }
  };

  const searchProducts = async (query: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const products = await masterJacobsAPI.searchProducts(query);
      setState(prev => ({
        ...prev,
        products,
        isLoading: false
      }));
      
      setFilters(prev => ({ ...prev, search: query }));
    } catch (error) {
      console.error('Error searching products:', error);
      setState(prev => ({
        ...prev,
        error: 'Sökning misslyckades',
        isLoading: false
      }));
    }
  };

  const getProductsByCategory = async (category: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const products = await masterJacobsAPI.getProductsByCategory(category);
      setState(prev => ({
        ...prev,
        products,
        isLoading: false
      }));
      
      setFilters(prev => ({ ...prev, category }));
    } catch (error) {
      console.error('Error filtering by category:', error);
      setState(prev => ({
        ...prev,
        error: 'Kunde inte filtrera produkter',
        isLoading: false
      }));
    }
  };

  const getProduct = async (productId: string): Promise<MasterJacobsProduct | null> => {
    try {
      return await masterJacobsAPI.getProduct(productId);
    } catch (error) {
      console.error('Error getting product:', error);
      return null;
    }
  };

  // Filter products locally based on current filters
  const getFilteredProducts = (): MasterJacobsProduct[] => {
    let filtered = [...state.products];

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.ingredients?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by price range
    if (filters.priceRange) {
      filtered = filtered.filter(product => 
        product.price >= filters.priceRange!.min && 
        product.price <= filters.priceRange!.max
      );
    }

    // Filter by allergens (exclude products containing specific allergens)
    if (filters.allergens && filters.allergens.length > 0) {
      filtered = filtered.filter(product => 
        !product.allergens?.some(allergen => 
          filters.allergens!.includes(allergen)
        )
      );
    }

    return filtered;
  };

  // Get products by category from current state
  const getProductsInCategory = (category: string): MasterJacobsProduct[] => {
    return state.products.filter(product => product.category === category);
  };

  // Get featured/popular products
  const getFeaturedProducts = (): MasterJacobsProduct[] => {
    // Return products with higher prices or specific categories as "featured"
    return state.products
      .filter(product => 
        product.category === 'tartor' || 
        product.price > 100
      )
      .slice(0, 6);
  };

  // Get products with specific allergen information
  const getProductsWithoutAllergens = (allergens: string[]): MasterJacobsProduct[] => {
    return state.products.filter(product => 
      !product.allergens?.some(allergen => allergens.includes(allergen))
    );
  };

  // Format product price
  const formatPrice = (product: MasterJacobsProduct): string => {
    return `${product.price} ${product.currency} ${product.unit}`;
  };

  // Check if product is available
  const isProductAvailable = (product: MasterJacobsProduct): boolean => {
    return product.available;
  };

  // Get product URL for navigation
  const getProductUrl = (product: MasterJacobsProduct): string => {
    return `https://www.masterjacobs.se/shop/bestill/${product.slug || `product-${product.id}`}`;
  };

  // Category mappings for Swedish display names
  const getCategoryDisplayName = (category: string): string => {
    const categoryNames: Record<string, string> = {
      'tartor': 'Tårtor',
      'bakverk': 'Bakverk',
      'matbrod': 'Matbröd',
      'kakor': 'Kakor',
      'bullar': 'Bullar',
      'frukost': 'Frukost',
      'fika': 'Fika',
      'presenter': 'Presenter'
    };
    
    return categoryNames[category] || category;
  };

  // Update filters
  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    loadProducts(); // Reload all products
  };

  return {
    // State
    products: state.products,
    filteredProducts: getFilteredProducts(),
    isLoading: state.isLoading,
    error: state.error,
    categories: state.categories,
    filters,

    // Actions
    loadProducts,
    searchProducts,
    getProductsByCategory,
    getProduct,
    updateFilters,
    clearFilters,

    // Utilities
    getProductsInCategory,
    getFeaturedProducts,
    getProductsWithoutAllergens,
    formatPrice,
    isProductAvailable,
    getProductUrl,
    getCategoryDisplayName
  };
}
