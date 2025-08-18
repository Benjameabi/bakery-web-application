import { useState, useEffect } from 'react';
import { catalogProcessor, CatalogProduct, ProductCategory } from '../lib/csvDataProcessor';

interface CatalogState {
  products: CatalogProduct[];
  categories: ProductCategory[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string | null;
  currentPage: number;
  productsPerPage: number;
}

interface CatalogFilters {
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  featured?: boolean;
  inStock?: boolean;
}

export function useCatalog() {
  const [state, setState] = useState<CatalogState>({
    products: [],
    categories: [],
    isLoading: false,
    error: null,
    searchQuery: '',
    selectedCategory: null,
    currentPage: 1,
    productsPerPage: 12
  });

  const [filters, setFilters] = useState<CatalogFilters>({});

  useEffect(() => {
    loadCatalogData();
  }, []);

  // Load catalog data from CSV
  const loadCatalogData = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const products = await catalogProcessor.loadProductsFromCSV();
      const categories = catalogProcessor.getCategories();
      
      setState(prev => ({
        ...prev,
        products,
        categories,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error loading catalog:', error);
      setState(prev => ({
        ...prev,
        error: 'Kunde inte ladda produktkatalog',
        isLoading: false
      }));
    }
  };

  // Search products (WordPress-style)
  const searchProducts = (query: string) => {
    setState(prev => ({ 
      ...prev, 
      searchQuery: query,
      currentPage: 1 
    }));
  };

  // Filter by category (WordPress-style)
  const filterByCategory = (categoryId: string | null) => {
    setState(prev => ({ 
      ...prev, 
      selectedCategory: categoryId,
      currentPage: 1 
    }));
  };

  // Update filters
  const updateFilters = (newFilters: Partial<CatalogFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setState(prev => ({ ...prev, currentPage: 1 }));
  };

  // Get filtered products (WordPress-style filtering)
  const getFilteredProducts = (): CatalogProduct[] => {
    let filtered = [...state.products];

    // Search filter
    if (state.searchQuery) {
      filtered = catalogProcessor.searchProducts(state.searchQuery);
    }

    // Category filter
    if (state.selectedCategory) {
      filtered = filtered.filter(product => 
        catalogProcessor.generateSlug(product.category, '') === state.selectedCategory ||
        product.category === state.selectedCategory
      );
    }

    // Additional filters
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    if (filters.priceRange) {
      filtered = filtered.filter(product => 
        product.price >= filters.priceRange!.min && 
        product.price <= filters.priceRange!.max
      );
    }

    if (filters.featured) {
      filtered = filtered.filter(product => product.featured);
    }

    if (filters.inStock) {
      filtered = filtered.filter(product => product.inStock);
    }

    return filtered;
  };

  // Pagination (WordPress-style)
  const getPaginatedProducts = (): CatalogProduct[] => {
    const filtered = getFilteredProducts();
    const startIndex = (state.currentPage - 1) * state.productsPerPage;
    const endIndex = startIndex + state.productsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  // Get total pages
  const getTotalPages = (): number => {
    const filtered = getFilteredProducts();
    return Math.ceil(filtered.length / state.productsPerPage);
  };

  // Navigate to page
  const goToPage = (page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
  };

  // Get product details (WordPress-style)
  const getProduct = (slugOrId: string): CatalogProduct | null => {
    return catalogProcessor.getProductBySlug(slugOrId) || 
           catalogProcessor.getProductById(slugOrId);
  };

  // Get category details
  const getCategory = (categoryId: string): ProductCategory | null => {
    return state.categories.find(cat => cat.id === categoryId || cat.slug === categoryId) || null;
  };

  // Commerce integration methods
  const redirectToCommerce = (product: CatalogProduct, action: 'buy' | 'view' = 'buy') => {
    // WordPress → SaaS Commerce handoff
    if (action === 'buy') {
      // Direct purchase - go to commerce app
      window.open(product.commerceUrl, '_blank', 'noopener,noreferrer');
    } else {
      // View in commerce (for detailed product info)
      window.open(product.commerceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Add to cart via commerce API
  const addToCart = async (product: CatalogProduct, quantity: number = 1) => {
    try {
      // This would integrate with the /shop/api/store/ commerce system
      const response = await fetch('https://www.masterjacobs.se/shop/api/store/cart/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: quantity,
          source: 'catalog'
        })
      });

      if (response.ok) {
        // Redirect to commerce cart
        window.open('https://www.masterjacobs.se/shop/cart/', '_blank', 'noopener,noreferrer');
      } else {
        // Fallback to product page
        redirectToCommerce(product, 'buy');
      }
    } catch (error) {
      console.error('Cart API error:', error);
      // Fallback to product page
      redirectToCommerce(product, 'buy');
    }
  };

  // Generate WordPress-style URLs
  const getProductUrl = (product: CatalogProduct): string => {
    return product.catalogUrl;
  };

  const getCategoryUrl = (category: ProductCategory): string => {
    return `/kategori/${category.slug}`;
  };

  // SEO helpers (WordPress-style)
  const getPageTitle = (): string => {
    if (state.searchQuery) {
      return `Sök: "${state.searchQuery}" - Mäster Jacobs Bageri`;
    }
    
    if (state.selectedCategory) {
      const category = getCategory(state.selectedCategory);
      return category ? category.seoTitle : 'Produkter - Mäster Jacobs Bageri';
    }
    
    return 'Produkter - Mäster Jacobs Bageri Västerås';
  };

  const getPageDescription = (): string => {
    if (state.searchQuery) {
      return `Sökresultat för "${state.searchQuery}" i Mäster Jacobs sortiment av färska bakverk från Västerås.`;
    }
    
    if (state.selectedCategory) {
      const category = getCategory(state.selectedCategory);
      return category ? category.seoDescription : 'Upptäck vårt sortiment av färska bakverk från Mäster Jacobs bageri i Västerås.';
    }
    
    return 'Upptäck Mäster Jacobs kompletta sortiment av tårtor, bakverk och färskt bröd. Beställ online för leverans i Västerås.';
  };

  // Analytics (WordPress-style)
  const trackProductView = (product: CatalogProduct) => {
    // Track product views for SEO and analytics
    console.log('Product viewed:', product.name);
    // Would integrate with Google Analytics, etc.
  };

  const trackCategoryView = (category: ProductCategory) => {
    // Track category views
    console.log('Category viewed:', category.name);
  };

  // Breadcrumbs (WordPress-style)
  const getBreadcrumbs = () => {
    const breadcrumbs = [{ name: 'Hem', url: '/' }];
    
    if (state.selectedCategory) {
      const category = getCategory(state.selectedCategory);
      if (category) {
        breadcrumbs.push({ 
          name: category.name, 
          url: getCategoryUrl(category) 
        });
      }
    }
    
    if (state.searchQuery) {
      breadcrumbs.push({ 
        name: `Sök: "${state.searchQuery}"`, 
        url: `/sok?q=${encodeURIComponent(state.searchQuery)}` 
      });
    }
    
    return breadcrumbs;
  };

  return {
    // State
    products: state.products,
    categories: state.categories,
    isLoading: state.isLoading,
    error: state.error,
    searchQuery: state.searchQuery,
    selectedCategory: state.selectedCategory,
    currentPage: state.currentPage,
    totalPages: getTotalPages(),
    filters,

    // Data methods
    filteredProducts: getFilteredProducts(),
    paginatedProducts: getPaginatedProducts(),
    featuredProducts: catalogProcessor.getFeaturedProducts(),
    
    // Actions
    loadCatalogData,
    searchProducts,
    filterByCategory,
    updateFilters,
    goToPage,
    getProduct,
    getCategory,

    // Commerce integration
    redirectToCommerce,
    addToCart,

    // URLs
    getProductUrl,
    getCategoryUrl,

    // SEO
    getPageTitle,
    getPageDescription,
    getBreadcrumbs,

    // Analytics
    trackProductView,
    trackCategoryView,

    // Utilities
    getTotalProducts: () => getFilteredProducts().length,
    hasResults: () => getFilteredProducts().length > 0,
    clearFilters: () => {
      setFilters({});
      setState(prev => ({ 
        ...prev, 
        searchQuery: '', 
        selectedCategory: null, 
        currentPage: 1 
      }));
    }
  };
}
