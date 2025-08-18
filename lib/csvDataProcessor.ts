// CSV Data Processor for Mäster Jacobs Products
// Simulates WordPress product management with CSV data

export interface CatalogProduct {
  id: string;
  category: string;
  name: string;
  variant: string;
  price: number;
  currency: string;
  imageUrl: string;
  slug: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  inStock: boolean;
  featured: boolean;
  // WordPress-style metadata
  catalogUrl: string; // For SEO and browsing
  commerceUrl: string; // For actual purchase
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  productCount: number;
  imageUrl?: string;
}

export class CatalogDataProcessor {
  private static instance: CatalogDataProcessor;
  private products: CatalogProduct[] = [];
  private categories: ProductCategory[] = [];

  public static getInstance(): CatalogDataProcessor {
    if (!CatalogDataProcessor.instance) {
      CatalogDataProcessor.instance = new CatalogDataProcessor();
    }
    return CatalogDataProcessor.instance;
  }

  // Process CSV data and create catalog products
  async loadProductsFromCSV(): Promise<CatalogProduct[]> {
    try {
      // Load main products
      const mainProducts = await this.parseCSV('/master_jacobs_products.csv');
      
      // Load extras
      const extraProducts = await this.parseCSV('/master_jacobs_extras.csv');
      
      // Combine and process
      const allProducts = [...mainProducts, ...extraProducts];
      this.products = allProducts.map(this.transformToProduct);
      
      // Generate categories
      this.generateCategories();
      
      return this.products;
    } catch (error) {
      console.error('Error loading CSV data:', error);
      return this.getFallbackProducts();
    }
  }

  // Parse CSV file
  private async parseCSV(filePath: string): Promise<any[]> {
    try {
      console.log('Loading CSV from:', filePath);
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Failed to load CSV: ${response.status} ${response.statusText}`);
      }
      const csvText = await response.text();
      console.log('CSV loaded successfully, length:', csvText.length);
      
      const lines = csvText.trim().split('\n');
      const headers = lines[0].split(',');
      
      return lines.slice(1).map(line => {
        const values = line.split(',');
        const product: any = {};
        headers.forEach((header, index) => {
          product[header.trim()] = values[index]?.trim() || '';
        });
        return product;
      });
    } catch (error) {
      console.error(`Error parsing CSV ${filePath}:`, error);
      return [];
    }
  }

  // Transform CSV row to catalog product
  private transformToProduct = (csvRow: any): CatalogProduct => {
    const id = this.generateProductId(csvRow.name, csvRow.variant);
    const slug = this.generateSlug(csvRow.name, csvRow.variant);
    
    return {
      id,
      category: csvRow.category || 'Okategoriserad',
      name: csvRow.name || 'Okänd produkt',
      variant: csvRow.variant || '',
      price: parseInt(csvRow.price_kr) || 0,
      currency: 'kr',
      imageUrl: csvRow.image_url || 'placeholder.jpg',
      slug,
      description: this.generateDescription(csvRow),
      seoTitle: this.generateSEOTitle(csvRow),
      seoDescription: this.generateSEODescription(csvRow),
      inStock: true,
      featured: this.isFeaturedProduct(csvRow),
      // WordPress-style URLs
      catalogUrl: `/produkter/${slug}`,
      // Commerce URLs (external SaaS)
      commerceUrl: `https://www.masterjacobs.se/shop/bestill/${slug}-${id}`
    };
  };

  // Generate unique product ID
  private generateProductId(name: string, variant: string): string {
    const combined = `${name}-${variant}`.toLowerCase()
      .replace(/[åäöÅÄÖ]/g, (match) => {
        const map: Record<string, string> = {
          'å': 'a', 'ä': 'a', 'ö': 'o',
          'Å': 'A', 'Ä': 'A', 'Ö': 'O'
        };
        return map[match] || match;
      })
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Add hash for uniqueness
    const hash = Math.abs(this.simpleHash(combined)).toString().slice(-4);
    return `${combined}-${hash}`;
  }

  // Generate SEO-friendly slug
  private generateSlug(name: string, variant: string): string {
    return `${name} ${variant}`.toLowerCase()
      .replace(/[åäöÅÄÖ]/g, (match) => {
        const map: Record<string, string> = {
          'å': 'a', 'ä': 'a', 'ö': 'o',
          'Å': 'A', 'Ä': 'A', 'Ö': 'O'
        };
        return map[match] || match;
      })
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // Simple hash function
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  // Generate product description
  private generateDescription(csvRow: any): string {
    const descriptions: Record<string, string> = {
      'Prinsesstårta': 'Klassisk svensk prinsesstårta med grön marsipan, vispgrädde och hallonsylt. En riktig favorit för alla tillfällen.',
      'Carl Gustav-tårta': 'Elegant tårta med ljus chokladmousse och färska bär. Perfekt för festliga tillfällen.',
      'Gräddtårta': 'Luftig sockerkaka med vispgrädde och färska säsongens bär. En tidlös klassiker.',
      'Budapest tårta': 'Exklusiv tårta med rik chokladmousse och hasselnötter. Lyxig smakupplevelse.',
      'Kanelknut': 'Nybakad kanelknut med äkta kanel och socker. Perfekt till morgonkaffet.',
      'Chokladboll': 'Klassisk chokladboll rullade i kokosströssel. Gjord på traditionellt sätt.',
      'Kladdkaka': 'Saftig kladdkaka med intensiv chokladsmak. Serveras gärna med grädde.',
      'Foccacia': 'Italienskt tunnbröd med örter och olivolja. Färskt bakat dagligen.'
    };
    
    return descriptions[csvRow.name] || `Färsk ${csvRow.name} ${csvRow.variant} från Mäster Jacobs bageri.`;
  }

  // Generate SEO title
  private generateSEOTitle(csvRow: any): string {
    return `${csvRow.name} ${csvRow.variant} - ${csvRow.price_kr} kr | Mäster Jacobs Bageri`;
  }

  // Generate SEO description
  private generateSEODescription(csvRow: any): string {
    return `Beställ ${csvRow.name} ${csvRow.variant} för ${csvRow.price_kr} kr från Mäster Jacobs bageri i Västerås. Färskt bakat dagligen med traditionella recept.`;
  }

  // Check if product should be featured
  private isFeaturedProduct(csvRow: any): boolean {
    const featuredProducts = ['Prinsesstårta', 'Kanelknut', 'Chokladboll', 'Kladdkaka'];
    return featuredProducts.includes(csvRow.name);
  }

  // Generate categories from products
  private generateCategories(): void {
    const categoryMap = new Map<string, number>();
    
    this.products.forEach(product => {
      const count = categoryMap.get(product.category) || 0;
      categoryMap.set(product.category, count + 1);
    });

    this.categories = Array.from(categoryMap.entries()).map(([name, count]) => ({
      id: this.generateSlug(name, ''),
      name,
      slug: this.generateSlug(name, ''),
      description: this.getCategoryDescription(name),
      seoTitle: `${name} - Mäster Jacobs Bageri Västerås`,
      seoDescription: `Upptäck vårt sortiment av ${name.toLowerCase()} från Mäster Jacobs bageri. Färskt bakat dagligen i Västerås.`,
      productCount: count,
      imageUrl: this.getCategoryImage(name)
    }));
  }

  // Get category description
  private getCategoryDescription(categoryName: string): string {
    const descriptions: Record<string, string> = {
      'Tårtor & bakelser': 'Våra signatur svenska tårtor och klassiska bakelser för alla tillfällen',
      'Fika': 'Perfekt för svenska fika-stunder med vänner och familj',
      'Frukost': 'Näringsrika frukostalternativ för en bra start på dagen',
      'Matbröd/Bullar': 'Dagligt bakat bröd och bullar med traditionella recept',
      'Extras': 'Tillbehör och presenter för att göra din beställning extra speciell'
    };
    
    return descriptions[categoryName] || `Utforska vårt sortiment av ${categoryName.toLowerCase()}`;
  }

  // Get category image
  private getCategoryImage(categoryName: string): string {
    const images: Record<string, string> = {
      'Tårtor & bakelser': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
      'Fika': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
      'Frukost': 'https://images.unsplash.com/photo-1553530979-4c9d4e0d4b42?w=400&h=300&fit=crop',
      'Matbröd/Bullar': 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=400&h=300&fit=crop',
      'Extras': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'
    };
    
    return images[categoryName] || 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=400&h=300&fit=crop';
  }

  // Fallback products if CSV loading fails
  private getFallbackProducts(): CatalogProduct[] {
    return [
      {
        id: 'prinsesstarta-6-bitar-1001',
        category: 'Tårtor & bakelser',
        name: 'Prinsesstårta',
        variant: '6 bitar',
        price: 149,
        currency: 'kr',
        imageUrl: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop',
        slug: 'prinsesstarta-6-bitar',
        description: 'Klassisk svensk prinsesstårta med grön marsipan',
        seoTitle: 'Prinsesstårta 6 bitar - 149 kr | Mäster Jacobs',
        seoDescription: 'Beställ klassisk prinsesstårta från Mäster Jacobs bageri i Västerås',
        inStock: true,
        featured: true,
        catalogUrl: '/produkter/prinsesstarta-6-bitar',
        commerceUrl: 'https://www.masterjacobs.se/shop/bestill/prinsesstarta-6-bitar-1001'
      },
      {
        id: 'chokladboll-strossel-2001',
        category: 'Fika',
        name: 'Chokladboll',
        variant: 'Strössel',
        price: 20,
        currency: 'kr',
        imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop',
        slug: 'chokladboll-strossel',
        description: 'Klassisk chokladboll rullade i kokosströssel',
        seoTitle: 'Chokladboll Strössel - 20 kr | Mäster Jacobs',
        seoDescription: 'Beställ traditionella chokladbollar från Mäster Jacobs bageri',
        inStock: true,
        featured: true,
        catalogUrl: '/produkter/chokladboll-strossel',
        commerceUrl: 'https://www.masterjacobs.se/shop/bestill/chokladboll-strossel-2001'
      },
      {
        id: 'kanelknut-standard-3001',
        category: 'Matbröd/Bullar',
        name: 'Kanelknut',
        variant: 'Standard',
        price: 20,
        currency: 'kr',
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
        slug: 'kanelknut-standard',
        description: 'Nybakad kanelknut med äkta kanel och socker',
        seoTitle: 'Kanelknut Standard - 20 kr | Mäster Jacobs',
        seoDescription: 'Färska kanelknutar bakade dagligen med traditionella recept',
        inStock: true,
        featured: false,
        catalogUrl: '/produkter/kanelknut-standard',
        commerceUrl: 'https://www.masterjacobs.se/shop/bestill/kanelknut-standard-3001'
      }
    ];
  }

  // Public getters
  getProducts(): CatalogProduct[] {
    return this.products;
  }

  getCategories(): ProductCategory[] {
    return this.categories;
  }

  getProductById(id: string): CatalogProduct | null {
    return this.products.find(p => p.id === id) || null;
  }

  getProductBySlug(slug: string): CatalogProduct | null {
    return this.products.find(p => p.slug === slug) || null;
  }

  getProductsByCategory(categoryId: string): CatalogProduct[] {
    return this.products.filter(p => 
      this.generateSlug(p.category, '') === categoryId || 
      p.category === categoryId
    );
  }

  searchProducts(query: string): CatalogProduct[] {
    const searchTerm = query.toLowerCase();
    return this.products.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.description?.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm)
    );
  }

  getFeaturedProducts(): CatalogProduct[] {
    return this.products.filter(p => p.featured);
  }
}

// Export singleton instance
export const catalogProcessor = CatalogDataProcessor.getInstance();
