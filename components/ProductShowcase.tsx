import { useState } from "react";
import { motion } from "motion/react";
import { Heart, Star, ArrowRight, ShoppingCart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { staggerContainer, staggerItem, fadeInUp } from "../lib/animations";

interface ProductShowcaseProps {
  onExternalRedirect: (url: string) => void;
}

interface FavoriteProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  rating: number;
}

interface ProductCategory {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

interface GiftItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
}

export function ProductShowcase({ onExternalRedirect }: ProductShowcaseProps) {
  const favoriteProducts: FavoriteProduct[] = [
    {
      id: 1,
      name: "Prinsesstårta",
      description: "Klassisk svensk tårta med grön marsipan och vispgrädde",
      price: "295 kr",
      category: "Tårtor",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop",
      rating: 4.9
    },
    {
      id: 2,
      name: "Kanelbullar",
      description: "Traditionella svenska kanelbullar med kanel och socker",
      price: "25 kr",
      category: "Bakverk",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop",
      rating: 4.8
    },
    {
      id: 3,
      name: "Kladdkaka",
      description: "Saftig chokladkaka med intensiv chokladsmak",
      price: "45 kr",
      category: "Kakor",
      image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300&h=300&fit=crop",
      rating: 4.9
    }
  ];

  const productCategories: ProductCategory[] = [
    {
      id: "tartor",
      name: "Tårtor",
      description: "Våra signatur svenska tårtor och specialdesserter",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
      productCount: 12
    },
    {
      id: "bakverk",
      name: "Bakverk",
      description: "Dagligt bakat bröd, bullar och klassiska svenska bakverk",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
      productCount: 24
    },
    {
      id: "kakor",
      name: "Kakor & Småkakor",
      description: "Hemlagade kakor och traditionella svenska småkakor",
      image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop",
      productCount: 18
    },
    {
      id: "presenter",
      name: "Presentlådor",
      description: "Vackert presentförpackade läckerheter för alla tillfällen",
      image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=300&fit=crop",
      productCount: 8
    }
  ];

  const giftItems: GiftItem[] = [
    {
      id: 101,
      name: "Presentkort 500kr",
      description: "Perfekt present för bakvärlsälskare",
      price: "500 kr",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop",
      category: "Presentkort"
    },
    {
      id: 102,
      name: "Fika-låda Deluxe",
      description: "Kanelbullar, kakor och specialkaffe",
      price: "285 kr",
      image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=300&h=300&fit=crop",
      category: "Presentlådor"
    },
    {
      id: 103,
      name: "Bageriförkläde",
      description: "Professionellt förkläde med Mäster Jacobs-logga",
      price: "195 kr",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop",
      category: "Tillbehör"
    }
  ];

  const handleProductClick = (productId: number) => {
    // Redirect to external webshop with product
    onExternalRedirect("https://your-webshop-url.com/products");
  };

  const handleCategoryClick = (categoryId: string) => {
    // Redirect to external webshop category
    onExternalRedirect("https://your-webshop-url.com/categories");
  };

  return (
    <div className="space-y-24">
      {/* Favorites Section */}
      <section id="favorites" className="py-16 md:py-24 bg-gradient-to-b from-white via-cream/10 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            {...fadeInUp}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <motion.h2 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-subheading font-bold text-black mb-8"
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              Våra Favoriter
            </motion.h2>
            
            <motion.p 
              className="text-lg md:text-xl text-warm-gray max-w-3xl mx-auto font-body leading-relaxed"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
            >
              De mest älskade bakverken från vårt sortiment - svenska klassiker som våra kunder återkommer för igen och igen.
            </motion.p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {favoriteProducts.map((product, index) => (
              <motion.div 
                key={product.id} 
                variants={staggerItem}
                className="group bg-white border border-gold/20 rounded-xl p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative overflow-hidden rounded-lg mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    />
                  </motion.div>
                  <motion.div 
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart className="w-5 h-5 text-gold" />
                  </motion.div>
                  <div className="absolute bottom-4 left-4 flex items-center space-x-1 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white text-sm font-body">{product.rating}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-heading font-bold text-xl text-black mb-2">{product.name}</h3>
                    <p className="text-warm-gray font-body text-sm">{product.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-2xl text-gold">{product.price}</span>
                    <motion.button
                      className="btn-primary btn-small flex items-center space-x-2"
                      onClick={() => handleProductClick(product.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Köp nu</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Full Menu Categories Section */}
      <section id="menu" className="py-16 md:py-24 bg-gradient-to-b from-cream/20 via-white to-cream/10">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            {...fadeInUp}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <motion.h2 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-subheading font-bold text-black mb-8"
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              Vårt Sortiment
            </motion.h2>
            
            <motion.p 
              className="text-lg md:text-xl text-warm-gray max-w-3xl mx-auto font-body leading-relaxed"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Upptäck våra kategorier av hantverksmässiga bakverk - från traditionella svenska klassiker till moderna kreationer.
            </motion.p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {productCategories.map((category, index) => (
              <motion.div 
                key={category.id} 
                variants={staggerItem}
                className="group relative overflow-hidden rounded-2xl bg-white border border-gold/20 hover:shadow-2xl transition-all duration-500 cursor-pointer"
                whileHover={{ y: -8 }}
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="relative h-80 overflow-hidden">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <ImageWithFallback
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  
                  <motion.div 
                    className="absolute top-6 right-6 bg-gold text-black px-4 py-2 rounded-full font-heading font-bold text-sm"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    {category.productCount} produkter
                  </motion.div>
                </div>
                
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 p-8 text-white"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <h3 className="font-heading font-bold text-2xl mb-3">{category.name}</h3>
                  <p className="font-body text-white/90 mb-6 leading-relaxed">{category.description}</p>
                  
                  <motion.div 
                    className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-lg font-heading font-semibold hover:bg-white hover:text-black transition-all duration-300"
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Utforska kategori</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Accessories & Gifts Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white via-gold/5 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            {...fadeInUp}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <motion.h2 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-subheading font-bold text-black mb-8"
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              Presenter & Tillbehör
            </motion.h2>
            
            <motion.p 
              className="text-lg md:text-xl text-warm-gray max-w-3xl mx-auto font-body leading-relaxed"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Perfekta presenter för bakälskare och tillbehör för att ta med bakverksupplevelsen hem.
            </motion.p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {giftItems.map((item, index) => (
              <motion.div 
                key={item.id} 
                variants={staggerItem}
                className="group bg-gradient-to-br from-white to-cream/30 border-2 border-gold/30 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500"
                whileHover={{ y: -6, scale: 1.02 }}
              >
                <motion.div 
                  className="relative overflow-hidden rounded-xl mb-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                >
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
                
                <div className="space-y-4">
                  <div>
                    <span className="inline-block bg-gold text-black px-3 py-1 rounded-full text-xs font-heading font-bold mb-3">
                      {item.category}
                    </span>
                    <h3 className="font-heading font-bold text-xl text-black mb-2">{item.name}</h3>
                    <p className="text-warm-gray font-body text-sm leading-relaxed">{item.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-2xl text-gold">{item.price}</span>
                    <motion.button
                      className="btn-secondary btn-small flex items-center space-x-2"
                      onClick={() => handleProductClick(item.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Köp</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}