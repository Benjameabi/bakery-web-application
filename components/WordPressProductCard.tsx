import { motion } from "motion/react";
import { Heart, ShoppingCart, Star, ExternalLink } from "lucide-react";
import { CatalogProduct } from "../lib/csvDataProcessor";

interface WordPressProductCardProps {
  product: CatalogProduct;
  onProductClick: (productId: string) => void;
  onAddToCart: (productId: string) => void;
  index?: number;
}

export function WordPressProductCard({ 
  product, 
  onProductClick, 
  onAddToCart, 
  index = 0 
}: WordPressProductCardProps) {
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Fallback to placeholder image
    const target = e.target as HTMLImageElement;
    target.src = `https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=400&h=300&fit=crop`;
  };

  const staggerItem = {
    initial: { opacity: 0, y: 20 },
    whileInView: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        delay: index * 0.1 
      }
    }
  };

  return (
    <motion.div
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gold/10 hover:border-gold/30 cursor-pointer"
      variants={staggerItem}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={() => onProductClick(product.id)}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img 
          src={product.imageUrl.startsWith('http') 
            ? product.imageUrl 
            : `https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=400&h=300&fit=crop`
          } 
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
          onError={handleImageError}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* WordPress-style badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.featured && (
            <div className="bg-gold text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
              Populär
            </div>
          )}
          
          {!product.inStock && (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
              Slut i lager
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <motion.button
            className="p-2 bg-white/90 rounded-full shadow-lg hover:bg-gold hover:text-white transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              // Could implement wishlist functionality
            }}
          >
            <Heart className="h-4 w-4" />
          </motion.button>
          
          <motion.button
            className="p-2 bg-white/90 rounded-full shadow-lg hover:bg-blue-500 hover:text-white transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              // View in SaaS commerce (external link)
              window.open(product.commerceUrl, '_blank', 'noopener,noreferrer');
            }}
          >
            <ExternalLink className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
      
      {/* Product Information */}
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-subheading font-bold text-black group-hover:text-gold transition-colors duration-300 line-clamp-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 font-body">
              {product.category}
            </p>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-gold">
              {product.price} {product.currency}
            </span>
            {product.variant && (
              <p className="text-sm text-gray-500">
                {product.variant}
              </p>
            )}
          </div>
        </div>
        
        {/* WordPress-style description */}
        {product.description && (
          <p className="text-sm text-gray-600 font-body mb-4 line-clamp-2">
            {product.description}
          </p>
        )}
        
        {/* Product rating (if available) */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className="h-4 w-4 fill-gold text-gold opacity-60" 
            />
          ))}
          <span className="text-sm text-gray-500 ml-1">(4.8)</span>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2">
          {/* WordPress-style "Buy Now" button → SaaS commerce */}
          <motion.button
            className={`flex-1 py-3 font-subheading font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl ${
              product.inStock 
                ? 'bg-gradient-to-r from-gold to-gold/80 text-white hover:from-gold/90 hover:to-gold/70' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            whileHover={product.inStock ? { scale: 1.02 } : {}}
            whileTap={product.inStock ? { scale: 0.98 } : {}}
            onClick={(e) => {
              e.stopPropagation();
              if (product.inStock) {
                onProductClick(product.id);
              }
            }}
            disabled={!product.inStock}
          >
            {product.inStock ? 'Köp nu' : 'Ej tillgänglig'}
          </motion.button>
          
          {/* Add to cart button → SaaS commerce */}
          {product.inStock && (
            <motion.button
              className="px-4 py-3 bg-white border-2 border-gold text-gold font-subheading font-semibold rounded-xl hover:bg-gold hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product.id);
              }}
            >
              <ShoppingCart className="h-5 w-5" />
            </motion.button>
          )}
        </div>
        
        {/* WordPress-style metadata */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>SKU: {product.id}</span>
            <span className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
              {product.inStock ? 'I lager' : 'Slut'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default WordPressProductCard;
