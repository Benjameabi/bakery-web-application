# Architecture Overview

## Frontend-Backend Separation

This Mäster Jacobs bakery website follows a clear separation between frontend presentation and backend ordering/checkout functionality.

### Frontend (Vercel)
- **Host**: Vercel deployment
- **Purpose**: Marketing website, product showcase, store information
- **Technology**: React + TypeScript + Vite
- **Responsibilities**:
  - Product catalog display
  - Store location and contact information
  - Marketing content and imagery
  - Brand presentation
  - Customer engagement (social media feeds)

### Backend (CakeItEasy)
- **Host**: `mybakery.cakeiteasy.se`
- **Purpose**: E-commerce functionality, ordering, checkout, payment processing
- **Responsibilities**:
  - Product catalog management
  - Shopping cart functionality
  - Order processing
  - Payment processing
  - Inventory management
  - Customer account management
  - Order fulfillment

## External URL Configuration

All ordering, cart, and checkout functionality redirects to the CakeItEasy subdomain:

```typescript
const EXTERNAL_URLS = {
  webbshop: "https://mybakery.cakeiteasy.se/",
  search: "https://mybakery.cakeiteasy.se/search",
  cart: "https://mybakery.cakeiteasy.se/cart",
  products: "https://mybakery.cakeiteasy.se/products",
  addToCart: "https://mybakery.cakeiteasy.se/cart/add",
  bakeryInfo: "https://mybakery.cakeiteasy.se/api/store/info"
};
```

## Contact Information

Contact emails and phone numbers remain pointing to the actual bakery:
- Email: `info@masterjacobs.se`, `beställning@masterjacobs.se`
- Phone: `+46 021-30 15 09`
- Address: `Pettersbergatan 37, Västerås, Sverige`

## Redirect Behavior

The frontend automatically redirects users to the CakeItEasy subdomain when they:
- Click "Beställ online" buttons
- Access the shopping cart
- Search for products
- Browse the product catalog
- Attempt to add items to cart

Social media links and internal navigation remain on the main site.
