import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Navigation } from "./components/Navigation";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { CookieConsent } from "./components/CookieConsent";
import { heroImages, heroSlideTexts, instagramPosts, contactInfo } from "./lib/constants";
import { fadeInUp, fadeIn, staggerContainer, staggerItem } from "./lib/animations";
import { MapPin, Phone, Clock, Mail, Star, Instagram, Facebook, Truck, CheckCircle, ArrowRight, X } from "lucide-react";
import { Input } from "./components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";

// Import logo
const logoIcon = "/icon-mj.webp";

// CakeItEasy URLs - All ordering/checkout handled by CakeItEasy backend
const EXTERNAL_URLS = {
  webbshop: "https://mybakery.cakeiteasy.se/",
  search: "https://mybakery.cakeiteasy.se/search",
  cart: "https://mybakery.cakeiteasy.se/cart",
  products: "https://mybakery.cakeiteasy.se/products",

  bakeryInfo: "https://mybakery.cakeiteasy.se/api/store/info"
};


export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [postalCode, setPostalCode] = useState("");
  const [deliveryResult, setDeliveryResult] = useState<{
    available: boolean;
    message: string;
    zone: string | null;
  } | null>(null);

  const [favoriteCategoryTiles, setFavoriteCategoryTiles] = useState<{ id: string; name: string; image: string }[]>([]);

  const slideText = heroSlideTexts[currentSlide] || {
    line1: "Bakverk som",
    line2: "berikar din",
    accent: "vardag",
    descriptionMobile: "Från traditionella svenska recept till moderna tolkningar. Hantverksmässiga bakverk sedan 1982.",
    descriptionDesktop: "Från traditionella svenska recept till moderna tolkningar. Vårt bageri har serverat färska, \n              hantverksmässiga bakverk sedan 1982 med samma passion för kvalitet och smak."
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      const handleResize = () => {
        if (window.innerWidth >= 768) {
          setIsMobileMenuOpen(false);
        }
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isMobileMenuOpen]);

  // Favorites categories: static six tiles
  useEffect(() => {
    const getCategoryImage = (name: string) => {
      const n = name.toLowerCase();
      if (n.includes('tårtor') || n === 'tårtor' || n.includes('tartor') || n === 'tartor') return '/images/Prinsesstårta.webp';
      if (n.includes('bullar') || n === 'bullar') return '/images/Sockerkringla.webp';
      if (n.includes('bröd') || n === 'bröd' || n.includes('brod') || n === 'brod' || n.includes('matbröd')) return '/images/Aros grova.webp';
      if (n.includes('frukost')) return '/images/Surdegsbräck vallmo.webp';
      if (n.includes('smörgåstårta') || n.includes('smorgastarta')) return '/images/smorgastarta.webp';
      if (n.includes('tillbehör') || n.includes('tillbehor')) return '/images/Tillbehor.webp';
      // Fallback images for unused categories
      if (n.includes('fika')) return '/images/Sockerkringla.webp';
      if (n.includes('lunch') || n.includes('sallad')) return '/images/Aros grova.webp';
      return '/images/Prinsesstårta.webp';
    };

    const tiles: { id: string; name: string; image: string }[] = [
      { id: 'tårtor', name: 'Tårtor', image: getCategoryImage('Tårtor') },
      { id: 'bullar', name: 'Bullar', image: getCategoryImage('Bullar') },
      { id: 'bröd', name: 'Bröd', image: getCategoryImage('Bröd') },
      { id: 'frukost', name: 'Frukost', image: getCategoryImage('Frukost') },
      { id: 'smörgåstårta', name: 'Smörgåstårta', image: getCategoryImage('Smörgåstårta') },
      { id: 'tillbehor', name: 'Tillbehör', image: getCategoryImage('Tillbehör') }
    ];

    setFavoriteCategoryTiles(tiles);
  }, []);

  const checkDelivery = () => {
    const cleanedPostal = postalCode.replace(/\s/g, '');
    
    if (cleanedPostal.length !== 5 || !/^\d{5}$/.test(cleanedPostal)) {
      setDeliveryResult({
        available: false,
        message: "Ange ett giltigt 5-siffrigt postnummer.",
        zone: null
      });
      return;
    }
    
    // Check if postal code is in Västerås area (72x codes)
    if (cleanedPostal.startsWith('72')) {
      setDeliveryResult({
        available: true,
        message: "Fantastiskt! Vi levererar till ditt område i Västerås. Fri frakt över 299kr, minimum 200kr för leverans.",
        zone: "Västerås"
      });
    } else {
      setDeliveryResult({
        available: false,
        message: "Tyvärr levererar vi endast till Västerås kommun. Besök vår butik på Pettersbergatan 37 eller ring oss på 021-30 15 09!",
        zone: null
      });
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleExternalRedirect = (url: string) => {
    // For CakeItEasy ordering/checkout, redirect in the same tab
    if (url.includes('cakeiteasy.se')) {
      window.location.href = url;
    } else {
      // For other external links (social media), open in new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const iconComponents: Record<string, any> = { MapPin, Phone, Clock, Mail };


  // Removed category click handler as menu section was deleted

  // Removed product aggregation and filtering

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-cream/20 to-white">
      {/* Top Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-black via-gray-900 to-black text-white text-center py-2 md:py-3 text-xs md:text-sm font-body shadow-lg"
      >
        <div className="container mx-auto px-2 md:px-4">
          <div className="flex items-center justify-center space-x-1 md:space-x-2">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gold rounded-full animate-pulse"></div>
            <span className="text-center leading-tight">
              <span className="hidden sm:inline">HEMLEVERANS ERBJUDANDE: Fri frakt över 299kr - </span>
              <span className="underline text-gold font-semibold">
                <span className="sm:hidden">LEVERANS IMORGON</span>
                <span className="hidden sm:inline">BESTÄLL IDAG MED LEVERANS IMORGON</span>
              </span>
              <span className="hidden sm:inline"> HELA VÄSTERÅS OMRÅDET</span>
            </span>
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gold rounded-full animate-pulse"></div>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <Navigation 
        isScrolled={isScrolled}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onSearchClick={() => handleExternalRedirect(EXTERNAL_URLS.search)}
        onCartClick={() => handleExternalRedirect(EXTERNAL_URLS.cart)}
        onWebbshopClick={() => handleExternalRedirect(EXTERNAL_URLS.webbshop)}
      />

      {/* Mobile Menu Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isMobileMenuOpen ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        onClick={closeMobileMenu}
      />

      {/* Mobile Menu */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isMobileMenuOpen ? 0 : '-100%' }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed top-0 left-0 w-80 h-full bg-white/95 backdrop-blur-md shadow-2xl z-50 md:hidden border-r border-gold/20"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-12">
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-gold/10 to-gold/5 rounded-xl flex items-center justify-center">
                <img 
                  src={logoIcon} 
                  alt="Mäster Jacobs Logo" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <div className="text-xl font-heading font-bold text-black" style={{ fontFamily: 'Lato, sans-serif', fontWeight: 600 }}>MÄSTER JACOBS</div>
                <div className="text-xs text-warm-gray font-body tracking-widest" style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300 }}>BAGERI & KONDITORI</div>
              </div>
            </motion.div>
            <motion.button
              onClick={closeMobileMenu}
              className="text-black hover:text-gold p-2 rounded-xl hover:bg-gold/5 transition-all duration-300"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              style={{ 
                fontFamily: 'Lato, sans-serif', 
                fontWeight: 400, 
                fontSize: '15px', 
                lineHeight: '26px' 
              }}
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          <nav className="space-y-2">
            {[
              { name: 'Hem', href: '#home', external: false },
              { name: 'Våra Favoriter', href: '#favorites', external: false },
              { name: 'Webbshop', href: EXTERNAL_URLS.webbshop, external: true },
              { name: 'Om oss', href: '#about', external: false },
              { name: 'Våra butiker', href: '#contact', external: false },
              { name: 'Kontakta oss', href: '#contact', external: false }
            ].map((item, index) => (
              <motion.a
                key={item.name}
                href={item.external ? undefined : item.href}
                onClick={item.external ? () => {
                  handleExternalRedirect(item.href);
                  closeMobileMenu();
                } : closeMobileMenu}
                className="block text-lg font-body text-black hover:text-gold transition-all duration-300 py-4 px-4 rounded-xl hover:bg-gold/5 border border-transparent hover:border-gold/20 cursor-pointer"
                style={{ fontFamily: 'Lato, sans-serif', fontWeight: 400 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ x: 8 }}
              >
                {item.name}
              </motion.a>
            ))}

            <motion.div 
              className="pt-6 border-t border-gold/20 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                className="w-full justify-start btn-secondary flex items-center"
                onClick={() => {
                  handleExternalRedirect(EXTERNAL_URLS.search);
                  closeMobileMenu();
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowRight className="w-5 h-5 mr-3" />
                Sök produkter
              </motion.button>
            </motion.div>

            <motion.div 
              className="pt-8 border-t border-gold/20 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <p className="text-sm font-body text-warm-gray mb-6 font-semibold">Följ oss på sociala medier</p>
              <div className="flex space-x-4">
                <motion.a 
                  href="https://www.instagram.com/masterjacobsbageriochkonditori?igsh=aGxtcnJnbnF4Mmpu" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-gold to-yellow-600 hover:from-yellow-600 hover:to-gold text-black transition-all duration-300 rounded-xl shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Instagram className="w-6 h-6" />
                </motion.a>
                <motion.a 
                  href="https://www.facebook.com/masterjacobsbageriochkonditori/?locale=sv_SE" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-gold to-yellow-600 hover:from-yellow-600 hover:to-gold text-black transition-all duration-300 rounded-xl shadow-lg"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Facebook className="w-6 h-6" />
                </motion.a>
              </div>
            </motion.div>
          </nav>
        </div>
      </motion.div>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-8 md:pt-0">
        {/* Image Slideshow Background */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <motion.div
              key={index}
              className={`absolute inset-0 transition-opacity duration-2000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
              initial={{ scale: 1.1 }}
              animate={{ scale: index === currentSlide ? 1 : 1.1 }}
              transition={{ duration: 6 }}
            >
              <ImageWithFallback
                src={image}
                alt={`Bakery slideshow ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50"></div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {heroImages.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-500 rounded-full ${
                index === currentSlide 
                  ? 'w-8 md:w-12 h-2 md:h-3 bg-white shadow-lg' 
                  : 'w-2 md:w-3 h-2 md:h-3 bg-white/60 hover:bg-white/80'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 md:px-6">
          {/* Announcement Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 md:mb-8"
          >
            <motion.button 
              onClick={() => handleExternalRedirect(EXTERNAL_URLS.products)}
              className="inline-flex items-center px-3 md:px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-gold/30 text-gray-800 hover:text-gold transition-colors duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              style={{ 
                fontFamily: 'Lato, sans-serif', 
                fontWeight: 400, 
                fontSize: '15px', 
                lineHeight: '26px' 
              }}
            >
              <span className="text-center">
                <span className="sm:hidden">Nytt sortiment av hantverksbröd.</span>
                <span className="hidden sm:inline">Lanserar vårt nya sortiment av hantverksbröd.</span>
              </span>{" "}
              <span className="text-gold font-semibold ml-1">Läs mer</span>
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-2 text-gold" />
            </motion.button>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-heading font-bold text-white mb-6 md:mb-8 leading-tight drop-shadow-2xl text-center"
            style={{ fontFamily: 'Lato, sans-serif', fontWeight: 700 }}
          >
            <span className="block">{slideText.line1}</span>
            <span className="block">{slideText.line2}</span>{" "}
            <span className="text-gold drop-shadow-lg">{slideText.accent}</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 font-body mb-8 md:mb-12 leading-relaxed max-w-3xl mx-auto drop-shadow-lg text-center px-2"
            style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300 }}
          >
            <span className="block sm:hidden">
              {slideText.descriptionMobile}
            </span>
            <span className="hidden sm:block">
              {slideText.descriptionDesktop}
            </span>
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center"
          >
            <motion.button
              className="btn-raised w-full sm:w-auto"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleExternalRedirect(EXTERNAL_URLS.webbshop)}
            >
              Beställ online
            </motion.button>
            
            <motion.button
              className="btn-ghost text-white/90 hover:text-gold inline-flex items-center border border-white/30 hover:border-gold/50 backdrop-blur-sm w-full sm:w-auto justify-center"
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById('favorites')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Utforska sortiment
              <ArrowRight className="w-4 h-4 ml-2" />
            </motion.button>
          </motion.div>
        </div>

        {/* Subtle floating elements - hidden on mobile for cleaner look */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-gold/10 rounded-full blur-xl hidden md:block"
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-full blur-lg hidden md:block"
          animate={{ 
            y: [0, 15, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </section>

      {/* Call-to-Action Section removed per request */}

      {/* 1. Favorites Section - Minimalist Product Cards */}
      <section id="favorites" className="py-16 md:py-24 bg-gradient-to-b from-white via-cream/10 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            {...fadeInUp}
            viewport={{ once: true }}
            className="text-center mb-16 max-w-4xl mx-auto"
          >
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-body font-semibold text-black leading-tight tracking-tight mb-6 md:mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              style={{ fontFamily: 'Lato', fontWeight: 600 }}
            >
              Välj Bland Våra Favoriter
            </motion.h2>
            
            <motion.p 
              className="text-base md:text-lg text-gray-600 font-body font-light leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
              style={{ fontFamily: 'Lato', fontWeight: 300 }}
            >
              De mest älskade bakverken från vårt sortiment - svenska klassiker som våra kunder återkommer för igen och igen.
            </motion.p>
          </motion.div>

          {/* Categories Grid (from CSV main categories + key extras) */}
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto"
          >
            {favoriteCategoryTiles.map((tile, index) => (
              <motion.div 
                key={tile.id} 
                variants={staggerItem}
                className="group cursor-pointer"
                onClick={() => handleExternalRedirect(EXTERNAL_URLS.products)}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div className="w-full">
                  <motion.div 
                    className="relative w-full aspect-square mb-4 overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div 
                      className="relative w-full h-full overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                    >
                      <ImageWithFallback
                        src={tile.image}
                        alt={tile.name}
                        className="w-full h-full object-cover"
                      />
                      <motion.div 
                        className="absolute inset-0 bg-gold/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      >
                        <motion.div
                          className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="font-body font-medium text-black text-sm flex items-center space-x-2">
                            <ArrowRight className="w-4 h-4" />
                            <span>Visa</span>
                          </span>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                  
                  <div className="text-center">
                    <h3 className="font-body text-black leading-tight">
                      {tile.name}
                    </h3>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 2. First Full-Width Image Break - Artisan Baking */}
      <section className="relative h-[70vh] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <ImageWithFallback
            src="/images/Allatårtor.webp"
            alt="Hantverk i Varje Detalj" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50"></div>
        </motion.div>
        
        <div className="relative z-10 h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center text-white px-4 md:px-6 max-w-4xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="mb-6 md:mb-8"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-gold/20 to-yellow-100/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <img 
                  src={logoIcon} 
                  alt="Mäster Jacobs Logo small" 
                  className="w-6 h-6 md:w-10 md:h-10 object-contain brightness-0 invert"
                  style={{ filter: 'brightness(0) invert(1) sepia(1) saturate(10000%) hue-rotate(35deg)' }}
                />
              </div>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-body font-semibold text-white mb-6 md:mb-8 drop-shadow-2xl leading-tight tracking-tight text-center"
              style={{ fontFamily: 'Lato', fontWeight: 600 }}
            >
              Hantverk i Varje Detalj
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto space-y-6 md:space-y-8"
            >
              <p className="text-base sm:text-lg md:text-xl text-white font-body font-light leading-relaxed drop-shadow-lg text-center" style={{ fontFamily: 'Lato', fontWeight: 300 }}>
                Våra skickliga bagare arbetar med traditionella metoder för att skapa bakverk av högsta kvalitet, precis som de gjort sedan 1982.
              </p>
              <p className="text-base sm:text-lg md:text-xl text-gray-200 font-body font-light leading-relaxed drop-shadow-lg text-center" style={{ fontFamily: 'Lato', fontWeight: 300 }}>
                Varje morgon före gryningen börjar arbetet med att forma, baka och förbereda dagens färska sortiment med samma noggrannhet och passion som alltid präglat vårt hantverk.
              </p>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-gold/10 to-transparent rounded-full blur-xl hidden md:block"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-br from-cream/20 to-transparent rounded-full blur-lg hidden md:block"
          animate={{ scale: [1.2, 1, 1.2], rotate: [10, 0, 10] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </section>

      {/* Fullständig Meny section removed per request */}

      {/* Presenter & Tillbehör section removed per request */}

      {/* 6. About Section - Vår Historia (moved between full-width images) */}
      <section id="about" className="py-16 md:py-24 bg-gradient-to-b from-cream/20 via-white to-cream/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16">
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-body font-semibold text-black leading-tight tracking-tight mb-8 md:mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              style={{ fontFamily: 'Lato', fontWeight: 600 }}
            >
              Vår Historia
            </motion.h2>
            
            <motion.div 
              className="space-y-6 md:space-y-8 text-base md:text-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <p className="font-body font-light text-gray-600 leading-relaxed" style={{ fontFamily: 'Lato', fontWeight: 300 }}>
                I över 40 år har Mäster Jacobs bageri & konditori bakat och levererat det finaste hantverksbrödet och traditionella svenska bakverk.
              </p>
              <p className="font-body font-light text-gray-600 leading-relaxed" style={{ fontFamily: 'Lato', fontWeight: 300 }}>
                Det började som ett litet familjeföretag i Skultuna, på Mäster Jacobs väg. Redan 2 år senare var det dags att bygga ut och flytta in till "stan" sedan dess har vi funnits i Västerås och du hittar oss på Pettersbergsgatan 37.
              </p>
              <p className="font-body font-light text-gray-600 leading-relaxed" style={{ fontFamily: 'Lato', fontWeight: 300 }}>
                Härifrån levererar vi dagligen, 7 dagar i veckan till hotell, caféer, restaurang, företag och privatpersoner.
              </p>
              <p className="font-body font-light text-gray-600 leading-relaxed" style={{ fontFamily: 'Lato', fontWeight: 300 }}>
                Numer kan även du med några enkla knappval lägga din beställning idag och få leverans imorgon. Vårt signum är svenska klassiker!
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <motion.div
              {...fadeInUp}
              viewport={{ once: true }}
              className="space-y-6 md:space-y-8 lg:order-2"
            >
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
                className="flex items-center space-x-4 md:space-x-6 p-4 md:p-6 bg-gradient-to-r from-gold/10 to-yellow-100/50 rounded-xl border border-gold/20"
              >
                <div className="flex text-gold">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                    >
                      <Star className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                    </motion.div>
                  ))}
                </div>
                <div>
                  <span className="text-lg md:text-xl font-heading font-bold text-black">4.9/5</span>
                  <span className="text-warm-gray font-body ml-2 text-sm md:text-base">från 500+ recensioner</span>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
              className="relative"
            >
              <motion.div
                className="relative overflow-hidden shadow-2xl border border-gold/20"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                <ImageWithFallback
                  src="/images/Historia.webp"
                  alt="Vår Historia - Mäster Jacobs Bageri"
                  className="w-full h-80 md:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </motion.div>
              
              <motion.div 
                className="absolute -top-2 md:-top-4 -right-2 md:-right-4 w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-gold to-yellow-500 rounded-full opacity-20"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              ></motion.div>
              <motion.div 
                className="absolute -bottom-2 md:-bottom-4 -left-2 md:-left-4 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-cream to-white rounded-full shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              ></motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Second Full-Width Image Break - Delivery CTA */}
      <section className="relative h-[70vh] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <ImageWithFallback
            src="/images/section-cake.webp"
            alt="Fri hemleverans i Västerås" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50"></div>
        </motion.div>
        
        <div className="relative z-10 h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center text-white px-4 md:px-6 max-w-4xl"
          >
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-body font-semibold text-white mb-6 md:mb-8 drop-shadow-2xl leading-tight tracking-tight text-center"
              style={{ fontFamily: 'Lato', fontWeight: 600 }}
            >
              Fri hemleverans i Västerås – över 299 kr
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto space-y-6 md:space-y-8"
            >
              <p className="text-base sm:text-lg md:text-xl text-white font-body font-light leading-relaxed drop-shadow-lg text-center" style={{ fontFamily: 'Lato', fontWeight: 300 }}>
                Beställ dina favoriter direkt i mobilen – snabbt, enkelt och smidigt.
              </p>
              <p className="text-base sm:text-lg md:text-xl text-gray-200 font-body font-light leading-relaxed drop-shadow-lg text-center" style={{ fontFamily: 'Lato', fontWeight: 300 }}>
                Fri hemleverans inom Västerås vid köp över 299 kr. Vi levererar dagligen till dörren med samma kvalitet och fräschör som i vårt bageri.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              viewport={{ once: true }}
              className="mt-6 md:mt-8"
            >
              <motion.button
                className="btn-primary btn-large"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleExternalRedirect(EXTERNAL_URLS.webbshop)}
              >
                Beställ idag
              </motion.button>
              <div className="text-white/95 font-body mt-3 md:mt-4 text-sm md:text-base">Leverans imorgon</div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="absolute top-1/4 left-10 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-gold/20 to-transparent rounded-full blur-lg hidden md:block"
          animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-16 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-cream/30 to-transparent rounded-full blur-md hidden md:block"
          animate={{ y: [0, 15, 0], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </section>

      

      {/* 7. Instagram Feed Section - Följ oss */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white via-cream/10 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            {...fadeInUp}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-20 max-w-4xl mx-auto"
          >
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-body font-semibold text-black leading-tight tracking-tight mb-6 md:mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              style={{ fontFamily: 'Lato', fontWeight: 600 }}
            >
              Följ oss på Instagram
            </motion.h2>
            <motion.p 
              className="text-base md:text-lg text-gray-600 font-body font-light leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
              style={{ fontFamily: 'Lato', fontWeight: 300 }}
            >
              Se vad som är färskt ur våra ugnar dagligen och bli en del av vår gemenskap av bakentusiaster
            </motion.p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12"
          >
            {instagramPosts.map((post, index) => (
              <motion.div 
                key={index} 
                variants={staggerItem} 
                className="relative group cursor-pointer"
              >
                <motion.div
                  className="aspect-square overflow-hidden shadow-lg border border-gold/10"
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <ImageWithFallback
                    src={post.image}
                    alt={post.caption}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <div className="text-white text-center p-2 md:p-4">
                      <motion.div 
                        className="flex items-center justify-center space-x-3 md:space-x-6 mb-2 md:mb-3"
                        initial={{ y: 20, opacity: 0 }}
                        whileHover={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="flex items-center space-x-1 md:space-x-2">
                          <span className="text-sm md:text-xl">❤️</span>
                          <span className="font-heading font-bold text-sm md:text-base">{post.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1 md:space-x-2">
                          <span className="text-sm md:text-xl">💬</span>
                          <span className="font-heading font-bold text-sm md:text-base">{post.comments}</span>
                        </div>
                      </motion.div>
                      <motion.p 
                        className="text-xs md:text-sm font-body leading-relaxed"
                        initial={{ y: 20, opacity: 0 }}
                        whileHover={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {post.caption}
                      </motion.p>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            {...fadeIn}
            viewport={{ once: true }}
            className="flex justify-center items-center space-x-4 md:space-x-6"
          >
            <motion.a 
              href="https://www.instagram.com/masterjacobsbageriochkonditori?igsh=aGxtcnJnbnF4Mmpu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-gold to-yellow-600 hover:from-yellow-600 hover:to-gold text-black transition-all duration-300 shadow-xl border border-gold/20"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Instagram className="w-6 h-6 md:w-8 md:h-8" />
            </motion.a>
            <motion.a 
              href="https://facebook.com/masterjacobsbageri" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-gold to-yellow-600 hover:from-yellow-600 hover:to-gold text-black transition-all duration-300 shadow-xl border border-gold/20"
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Facebook className="w-6 h-6 md:w-8 md:h-8" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* 8. Contact Section - Hitta oss */}
      <section id="contact" className="py-16 md:py-24 bg-gradient-to-b from-cream/30 via-cream/20 to-cream/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            {...fadeInUp}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-20 max-w-4xl mx-auto"
          >
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-body font-semibold text-black leading-tight tracking-tight mb-6 md:mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              style={{ fontFamily: 'Lato', fontWeight: 600 }}
            >
              Hitta Oss
            </motion.h2>
            <motion.p 
              className="text-base md:text-lg text-gray-600 font-body font-light leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
              style={{ fontFamily: 'Lato', fontWeight: 300 }}
            >
              Välkommen till vårt mysiga bageri där doften av nybakat bröd möter dig
            </motion.p>
          </motion.div>

          <div className="mb-12 md:mb-16">
            <Tabs defaultValue="location" className="w-full">
              <div className="flex justify-center mb-8 md:mb-12">
                <motion.div
                  className="bg-white/80 backdrop-blur-sm border-2 border-gold/20 p-1.5 md:p-2 shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <TabsList className="bg-transparent gap-1 md:gap-2">
                    <TabsTrigger 
                      value="location" 
                      className="px-4 md:px-8 py-3 md:py-4 font-heading font-semibold text-sm md:text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold data-[state=active]:to-yellow-500 data-[state=active]:text-black transition-all duration-300 data-[state=active]:shadow-lg"
                    >
                      Du hittar oss här
                    </TabsTrigger>
                    <TabsTrigger 
                      value="delivery" 
                      className="px-4 md:px-8 py-3 md:py-4 font-heading font-semibold text-sm md:text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold data-[state=active]:to-yellow-500 data-[state=active]:text-black transition-all duration-300 data-[state=active]:shadow-lg"
                    >
                      Hemleverans
                    </TabsTrigger>
                  </TabsList>
                </motion.div>
              </div>

              <TabsContent value="location" className="space-y-8 md:space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
                  <motion.div 
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <motion.div 
                      className="bg-white/90 backdrop-blur-sm border-2 border-gold/20 overflow-hidden h-80 md:h-96 relative shadow-xl"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2019.234567890123!2d16.546399!3d59.611591!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465dcb5119640bcb%3A0xa80d27d3679d7766!2sPettersbergatan%2037%2C%20V%C3%A4ster%C3%A5s%2C%20Sweden!5e0!3m2!1sen!2sse!4v1703025123456!5m2!1sen!2sse"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Mäster Jacobs Bageri Västerås Location"
                      ></iframe>
                      <motion.div 
                        className="absolute top-3 md:top-6 left-3 md:left-6 bg-white/95 backdrop-blur-md p-3 md:p-6 shadow-xl max-w-xs border border-gold/20"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="flex items-start space-x-3 md:space-x-4">
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <MapPin className="w-5 h-5 md:w-7 md:h-7 text-gold flex-shrink-0 mt-1" />
                          </motion.div>
                          <div>
                            <p className="font-heading font-bold text-black text-sm md:text-base">Mäster Jacobs Bageri</p>
                            <p className="text-xs md:text-sm text-warm-gray font-body mt-1 md:mt-2 leading-relaxed">
                              Pettersbergatan 37<br />
                              Västerås, Sverige
                            </p>
                            <p className="text-xs text-warm-gray font-body mt-2 md:mt-3">
                              Västerås centrum (5 min promenad)
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="space-y-6 md:space-y-8"
                  >
                    <div className="space-y-4 md:space-y-6">
                      <h3 className="text-2xl md:text-3xl font-subheading font-bold text-black">Besök Vårt Bageri</h3>
                      <p className="text-warm-gray font-body text-base md:text-lg leading-relaxed">
                        Beläget i centrala Västerås på Pettersbergatan 37. Lätt att nå med kollektivtrafik, 
                        till fots eller cykel. Parkering finns på närliggande gator.
                      </p>
                    </div>
                    
                    <motion.div 
                      variants={staggerContainer}
                      initial="initial"
                      whileInView="whileInView"
                      viewport={{ once: true }}
                      className="space-y-4 md:space-y-5"
                    >
                      {contactInfo.map((item, index) => {
                        const IconComponent = iconComponents[item.icon];
                        return (
                          <motion.div key={item.title} variants={staggerItem}>
                            <div className="flex items-start space-x-3 md:space-x-4">
                              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center flex-shrink-0">
                                <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-gold" />
                              </div>
                              <div>
                                <h4 className="font-heading font-bold text-black mb-1 md:mb-1.5 text-sm md:text-base">{item.title}</h4>
                                <p className="text-xs md:text-sm text-warm-gray font-body whitespace-pre-line leading-relaxed">
                                  {item.content}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      viewport={{ once: true }}
                      className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-6 md:pt-8"
                    >
                      <motion.button 
                        className="btn-primary flex-1"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Vägbeskrivning
                      </motion.button>
                      <motion.button 
                        className="btn-secondary flex-1"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Ring Oss
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </div>
              </TabsContent>

              <TabsContent value="delivery" className="space-y-8 md:space-y-12">
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="max-w-3xl mx-auto"
                >
                  <motion.div 
                    className="bg-white/90 backdrop-blur-sm border-2 border-gold/20 p-8 md:p-12 text-center shadow-xl"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div 
                      className="flex justify-center mb-6 md:mb-8"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-gold/20 to-yellow-100 rounded-full flex items-center justify-center shadow-lg">
                        <Truck className="w-8 h-8 md:w-10 md:h-10 text-gold" />
                      </div>
                    </motion.div>
                    
                    <h3 className="text-2xl md:text-3xl font-subheading font-bold mb-4 md:mb-6 text-black">
                      Kontrollera Hemleverans
                    </h3>
                    <p className="text-warm-gray font-body mb-6 md:mb-8 text-base md:text-lg leading-relaxed">
                      Ange ditt postnummer för att se om vi levererar till ditt område. 
                      Vi levererar dagligen inom Stockholm med omnejd.
                    </p>

                    <div className="space-y-4 md:space-y-6">
                      <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <Input
                          placeholder="Skriv postnummer (t.ex. 11121)"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          className="flex-1 border-2 border-gold/30 focus:border-gold bg-white/80 backdrop-blur-sm py-3 px-4 text-base md:text-lg font-body"
                          maxLength={5}
                        />
                        <motion.button
                          onClick={checkDelivery}
                          className="btn-primary px-6 sm:px-8"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Kontrollera
                        </motion.button>
                      </div>

                      {deliveryResult && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.5 }}
                          className={`p-4 md:p-6 border-2 shadow-lg ${
                            deliveryResult.available 
                              ? 'bg-green-50/80 border-green-300 text-green-800' 
                              : 'bg-red-50/80 border-red-300 text-red-800'
                          }`}
                        >
                          <div className="flex items-center justify-center space-x-3 mb-3">
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.5 }}
                            >
                              {deliveryResult.available ? (
                                <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
                              ) : (
                                <X className="w-5 h-5 md:w-6 md:h-6" />
                              )}
                            </motion.div>
                            <span className="font-heading font-bold text-base md:text-lg">
                              {deliveryResult.available ? 'Vi levererar hit!' : 'Levererar ej'}
                            </span>
                          </div>
                          <p className="font-body mb-2 text-sm md:text-base">{deliveryResult.message}</p>
                          {deliveryResult.zone && (
                            <p className="text-xs md:text-sm font-body opacity-80">
                              Leveransområde: {deliveryResult.zone}
                            </p>
                          )}
                        </motion.div>
                      )}
                    </div>

                    <motion.div 
                      className="mt-8 md:mt-12 pt-6 md:pt-8 border-t-2 border-gold/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h4 className="font-heading font-bold mb-4 md:mb-6 text-black text-lg md:text-xl">Leveransinfo</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm text-warm-gray font-body">
                        {[
                          "• Leverans samma dag för beställningar före 14:00",
                          "• Fri frakt över 500kr, annars 49kr",
                          "• Leveranstid: 15:00-19:00 vardagar, 10:00-16:00 helger",
                          "• SMS bekräftelse med spårning"
                        ].map((item, index) => (
                          <motion.p
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                            className="text-left"
                          >
                            {item}
                          </motion.p>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Promotion Banner above Footer */}
      <section className="py-8 md:py-10 bg-gradient-to-r from-gold to-yellow-500 text-black">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center md:text-left">
              <div className="font-heading font-bold text-lg md:text-2xl tracking-wide">KAMPANJ: Fri hemleverans i Västerås över 299 kr</div>
              <div className="font-body text-sm md:text-base opacity-90">Beställ enkelt i mobilen – smidigt och bekvämt.</div>
            </div>
            <motion.button
              className="btn-primary btn-large"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleExternalRedirect(EXTERNAL_URLS.webbshop)}
            >
              Beställ nu
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* 9. Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-b from-black via-gray-900 to-black text-white py-12 md:py-16"
      >
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
          >
            <motion.div variants={staggerItem} className="space-y-4 md:space-y-6">
              <div className="flex items-center space-x-3 md:space-x-4">
                <motion.div
                  className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-gold/20 to-yellow-100/20 rounded-xl flex items-center justify-center"
                  animate={{ rotate: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <img 
                    src={logoIcon} 
                    alt="Mäster Jacobs Logo" 
                    className="w-6 h-6 md:w-8 md:h-8 object-contain brightness-0 invert"
                  />
                </motion.div>
                <span className="text-xl md:text-2xl font-heading font-bold">Mäster Jacobs</span>
              </div>
              <p className="text-warm-gray font-body text-base md:text-lg leading-relaxed">
                Betjänar gemenskapen med färska, hantverksbakverk sedan 1982.
              </p>
              <div className="pt-2 md:pt-3">
                <div className="flex items-center space-x-3">
                  <img 
                    src="/Swish Logo Primary Dark-BG SVG.svg" 
                    alt="Swish" 
                    className="w-8 h-8 md:w-10 md:h-10 object-contain"
                  />
                  <div className="font-body text-sm md:text-base">
                    <span className="font-semibold">Swish</span>: 123 456 78 90
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={staggerItem} className="space-y-4 md:space-y-6">
              <h4 className="font-heading font-bold text-lg md:text-xl">Snabblänkar</h4>
              <ul className="space-y-2 md:space-y-3">
                {[
                  { name: 'Hem', href: '#home', external: false },
                  { name: 'Favoriter', href: '#favorites', external: false },
                  { name: 'Produkter', href: EXTERNAL_URLS.products, external: true },
                  { name: 'Om oss', href: '#about', external: false },
                  { name: 'Kontakt', href: '#contact', external: false }
                ].map((item, index) => (
                  <motion.li key={item.name}>
                    <motion.a 
                      href={item.external ? undefined : item.href}
                      onClick={item.external ? () => handleExternalRedirect(item.href) : undefined}
                      className="text-warm-gray hover:text-white transition-colors font-body text-base md:text-lg flex items-center group cursor-pointer"
                      whileHover={{ x: 5 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <span className="w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-4 mr-2"></span>
                      {item.name}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div variants={staggerItem} className="space-y-4 md:space-y-6">
              <h4 className="font-heading font-bold text-lg md:text-xl">Följ Oss</h4>
              <p className="text-warm-gray font-body text-base md:text-lg leading-relaxed">
                Håll dig uppdaterad med våra dagliga specialiteter och nya produkter.
              </p>
              <div className="flex space-x-3 md:space-x-4">
                <motion.a 
                  href="https://facebook.com/masterjacobsbageri" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-ghost text-warm-gray hover:text-black text-sm md:text-base"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Facebook
                </motion.a>
                <motion.a 
                  href="https://www.instagram.com/masterjacobsbageriochkonditori?igsh=aGxtcnJnbnF4Mmpu" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-ghost text-warm-gray hover:text-black text-sm md:text-base"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Instagram
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="border-t border-warm-gray/30 mt-8 md:mt-12 pt-6 md:pt-8 text-center"
          >
            <p className="font-body text-warm-gray text-base md:text-lg">
              &copy; 2024 Mäster Jacobs Bageri & Konditori. Alla rättigheter förbehållna.
            </p>
          </motion.div>
        </div>
      </motion.footer>

      {/* Cookie Consent Banner */}
      <CookieConsent />
    </div>
  );
}