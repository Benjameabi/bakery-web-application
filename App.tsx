import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Navigation } from "./components/Navigation";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { CookieConsent } from "./components/CookieConsent";
import { heroImages, heroSlideTexts, contactInfo } from "./lib/constants";
import { fadeInUp, fadeIn, staggerContainer, staggerItem } from "./lib/animations";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons';
// import { FaInstagram } from "react-icons/fa";
import { faHeart, faComment, faLocationDot, faPhone, faClock, faEnvelope, faStar, faArrowRight, faXmark } from '@fortawesome/free-solid-svg-icons';

// Import logo
const logoIcon = "/images/logos/stacked/Stacked Logo inverse color lockup.svg";
const logoIconInverse = "/images/logos/stacked/Stacked Logo inverse color lockup.svg";

// CakeItEasy URLs - All ordering/checkout handled by CakeItEasy backend
const EXTERNAL_URLS = {
  webbshop: "https://mybakery.cakeiteasy.se/",
  search: "https://mybakery.cakeiteasy.se/search",
  cart: "https://mybakery.cakeiteasy.se/cart",
  products: "https://mybakery.cakeiteasy.se/products",

  bakeryInfo: "https://mybakery.cakeiteasy.se/api/store/info"
};

const instagramPosts = [
  {
    id: 1,
    image: "public/images/posts/post-1.jpg",
    text: "Nu kan vi inte hålla oss längre – imorgon hittar ni dessa godbitar!",
    link: "https://www.instagram.com/masterjacobsbageriochkonditori/reel/DHYL_bKt_td/",
  },
  {
    id: 2,
    image: "public/images/posts/post-2.jpg",
    text: "Chokladbakelser fyllda med kärlek och magi 🍫✨",
    link: "https://www.instagram.com/masterjacobsbageriochkonditori/reel/DHJKpNPtlvt/",
  },
  {
    id: 3,
    image: "public/images/posts/post-3.jpg",
    text: "Färgglada tårtor som passar alla kalas 🎉🎂",
    link: "https://www.instagram.com/masterjacobsbageriochkonditori/reel/DHYL_bKt_td/",
  },
  {
    id: 4,
    image: "public/images/posts/post-4.jpg",
    text: "En liten bit av lycka i varje tårtbit 🌈🍰",
    link: "https://www.instagram.com/masterjacobsbageriochkonditori/reel/DICgYWMNsHp/",
  },
  {
    id: 5,
    image: "public/images/posts/post-5.jpg",
    text: "Vår passion för bakverk – direkt till ditt bord 🥐❤️",
    link: "https://www.instagram.com/masterjacobsbageriochkonditori/reel/DHxdNtZtsB6/",
  },
  {
    id: 6,
    image: "public/images/posts/post-6.jpg",
    text: "Tårtor som gör varje dag lite sötare 🍰✨",
    link: "https://www.instagram.com/masterjacobsbageriochkonditori/reel/DHLf0ObtN16/",
  },
  {
    id: 7,
    image: "public/images/posts/post-7.jpg",
    text: "Små konstverk gjorda av choklad och kärlek 🍫🎨",
    link: "https://www.instagram.com/masterjacobsbageriochkonditori/reel/DHF1JpqtU9v/",
  },
  {
    id: 8,
    image: "public/images/posts/post-8.jpg",
    text: "Skapa minnen med våra färgglada bakverk 🌸🎂",
    link: "https://www.instagram.com/masterjacobsbageriochkonditori/reel/DHA1iEztkEk/",
  },
  {
    id: 9,
    image: "public/images/posts/post-9.jpg",
    text: "En fest för ögonen och smaklökarna 🎉🍰",
    link: "https://www.instagram.com/masterjacobsbageriochkonditori/reel/DGfV7iYtz6D/",
  },
  {
    id: 10,
    image: "public/images/posts/post-10.jpg",
    text: "Njut av våra bakverk som sprider glädje i varje tugga 😍🍪",
    link: "https://www.instagram.com/masterjacobsbageriochkonditori/reel/DGdxRNmNzu-/",
  },
];


export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [favoriteCategoryTiles, setFavoriteCategoryTiles] = useState<{ id: string; name: string; image: string }[]>([]);
  // const [posts, setPosts] = useState([]);

  // useEffect(() => {
  //   const fetchInstagramPosts : any = async () => {
  //     try {
  //       const res = await fetch(
  //         `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink&access_token=YOUR_ACCESS_TOKEN`
  //       );
  //       const data = await res.json() as any;
  //       setPosts(data.data || []);
  //     } catch (error) {
  //       console.error("Error fetching Instagram posts:", error);
  //     }
  //   };

  //   fetchInstagramPosts();
  // }, []);
  // Instagram grid: fixed 9 items (3x3), no pagination
  const displayedPosts = instagramPosts.slice(0, 9);

  const slideText = heroSlideTexts[currentSlide] || {
    line1: "Bakverk som",
    line2: "berikar din",
    accent: "vardag",
    descriptionMobile: "Från traditionella svenska recept till moderna tolkningar. Hantverksmässiga bakverk sedan 1982.",
    descriptionDesktop: "Från traditionella svenska recept till moderna tolkningar. Vårt bageri har serverat färska, \n              hantverksmässiga bakverk sedan 1982 med samma passion för kvalitet och smak."
  };

  // Removed global scroll state; Navigation manages its own shrink behavior

  // Preload critical images for faster loading
  useEffect(() => {
    const criticalImages = [
      '/images/logos/horizontal/Horizontal Logo inverse color lockup.svg',
      '/images/logos/stacked/Stacked Logo full color lockup.svg',
      '/images/Prinsesstårta.webp',
      '/images/Kanelknut.webp',
      '/images/Frukost.webp',
      '/images/Aros grova.webp',
      '/images/smorgastarta.webp',
      '/images/Tillbehor.webp'
    ];

    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

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
      if (n.includes('bullar') || n === 'bullar') return '/images/Kanelknut.webp';
      if (n.includes('bröd') || n === 'bröd' || n.includes('brod') || n === 'brod' || n.includes('matbröd')) return '/images/Aros grova.webp';
      if (n.includes('frukost')) return '/images/Frukost.webp';
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

  const iconComponents: Record<string, any> = { 
    MapPin: faLocationDot, 
    Phone: faPhone, 
    Clock: faClock, 
    Mail: faEnvelope 
  };


  // Removed category click handler as menu section was deleted

  // Removed product aggregation and filtering

  return (
    <div className="min-h-screen bg-transparent overflow-x-hidden">
      {/* Top Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-black via-gray-900 to-black text-white text-center py-2 md:py-2 text-xs md:text-sm font-body shadow-lg"
        style={{ fontFamily: 'Lato, sans-serif', fontWeight: 400 }}
      >
        <div className="container mx-auto px-2 md:px-4">
          <div className="flex items-center justify-center space-x-1 md:space-x-2">
            <div className="hidden md:block w-2 h-2 bg-gold rounded-full animate-pulse"></div>
              <span className="text-center leading-tight" style={{ fontFamily: 'Lato, sans-serif', fontWeight: 400 }}>
              <span className="hidden lg:inline" style={{ fontFamily: 'Lato, sans-serif', fontWeight: 400 }}>HEMLEVERANS ERBJUDANDE: Fri frakt över 299kr - </span>
              <span className="underline text-gold font-medium" style={{ fontFamily: 'Lato, sans-serif', fontWeight: 500 }}>
                <span className="sm:hidden" style={{ fontFamily: 'Lato, sans-serif', fontWeight: 500 }}>BESTÄLL IDAG MED LEVERANS IMORGON</span>
                <span className="hidden sm:inline" style={{ fontFamily: 'Lato, sans-serif', fontWeight: 500 }}>BESTÄLL IDAG MED LEVERANS IMORGON</span>
              </span>
              <span className="hidden lg:inline" style={{ fontFamily: 'Lato, sans-serif', fontWeight: 400 }}> HELA VÄSTERÅS OMRÅDET</span>
            </span>
            <div className="hidden md:block w-2 h-2 bg-gold rounded-full animate-pulse"></div>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <Navigation 
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
              <div className="w-16 h-16 bg-gradient-to-br from-gold/10 to-gold/5 rounded-xl flex items-center justify-center">
                <img 
                  src={logoIcon} 
                  alt="Mäster Jacobs Logo" 
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div>
                <div className="text-xl font-heading font-bold text-black" style={{ fontFamily: 'Lato, sans-serif', fontWeight: 400 }}>MÄSTER JACOBS</div>
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
                fontWeight: 300, 
                fontSize: '15px', 
                lineHeight: '26px' 
              }}
            >
              <FontAwesomeIcon icon={faXmark} className="w-6 h-6" />
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
                className="nav-link block text-lg font-extrabold font-body text-black hover:text-gold transition-all duration-300 py-4 px-4 rounded-xl hover:bg-gold/5 border border-transparent hover:border-gold/20 cursor-pointer"
                style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300 }}
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
                className="w-full justify-start font-extrabold btn-secondary flex items-center"
                onClick={() => {
                  handleExternalRedirect(EXTERNAL_URLS.search);
                  closeMobileMenu();
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FontAwesomeIcon icon={faArrowRight} className="w-5 h-5 mr-3" />
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
                  <FontAwesomeIcon icon={faInstagram} className="w-6 h-6" />
                </motion.a>
                <motion.a 
                  href="https://www.facebook.com/masterjacobsbageriochkonditori/?locale=sv_SE" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-gold to-yellow-600 hover:from-yellow-600 hover:to-gold text-black transition-all duration-300 rounded-xl shadow-lg"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FontAwesomeIcon icon={faFacebookF} className="w-6 h-6" />
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

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-heading font-bold text-white mb-6 md:mb-8 leading-tight drop-shadow-2xl text-center"
            style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300 }}
          >
            <span className="block text-3xl sm:text-4xl md:text-5xl" style={{ fontFamily: 'Lato, sans-serif' }}>{slideText.line1}</span>
            <span className="block text-3xl sm:text-4xl md:text-5xl" style={{ fontFamily: 'Lato, sans-serif' }}>{slideText.line2}</span>{" "}
            <span className="text-gold font-extrabold drop-shadow-lg text-4xl sm:text-5xl md:text-6xl" style={{ fontFamily: 'Lato, sans-serif' }}>{slideText.accent}</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base md:text-lg text-white/95 font-body mb-8 md:mb-12 leading-relaxed max-w-3xl mx-auto drop-shadow-lg text-center px-2"
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
            className="flex justify-center items-center"
          >
            <motion.button
              className=" text-base uppercase btn-raised btn-small text-white rounded-[var(--button-radius) sm:text-sm]"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleExternalRedirect(EXTERNAL_URLS.webbshop)}
            >
              Beställ online
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
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-black leading-tight tracking-tight mb-6 md:mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              style={{ fontFamily: 'Lato', fontWeight: 300 }}
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
              De mest älskade bakverken från vårt sortiment Svenska klassiker!
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
                          <span className="font-body font-medium text-black text-sm flex items-center space-x-2"
                                style={{ fontFamily: 'Lato', fontWeight: 400 }}>
                            <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
                            <span>Visa</span>
                          </span>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                  
                  <div className="text-center">
                    <h3 className="font-body text-black leading-tight text-base md:text-lg"
                        style={{ fontFamily: 'Lato', fontWeight: 400 }}>
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
      <section className="relative h-[80vh] md:h-[90vh] lg:h-[110vh] overflow-hidden">
        {/* Background Image with smooth zoom-in */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <ImageWithFallback
            src="/images/Allatårtor.webp"
            alt="Hantverks bageri & konditori i Västerås sedan 1982"
            className="w-full h-full object-cover"
          />
          {/* Layered gradient overlays for better depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>
        </motion.div>

        {/* Center Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 md:px-6">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mb-6 md:mb-8"
          >
            <div className="w-28 h-28 md:w-36 md:h-36 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-gold/30 to-yellow-100/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-2xl shadow-gold/20">
              <img 
                src={logoIconInverse} 
                alt="Mäster Jacobs Logo small" 
                className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-lg"
              />
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white mb-4 md:mb-6 leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
            style={{ fontFamily: 'Lato', fontWeight: 400 }}
          >
            Hantverks bageri & konditori <br className="hidden sm:block"/> i Västerås sedan 1982
          </motion.h2>

          {/* Sub Text */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl font-light text-white leading-relaxed drop-shadow-xl"
            style={{ fontFamily: 'Lato sans-serif', fontWeight: 400 }}
          >
            Våra skickliga bagare arbetar med traditionella metoder för att skapa bakverk av högsta kvalitet.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            viewport={{ once: true }}
            className="mt-8"
          >
            <a
              href="#favorites"
              className="inline-block uppercase px-8 py-4 text-lg font-semibold bg-gradient-to-r from-gold to-yellow-500 text-black rounded-full shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300"
              style={{ fontFamily: 'Lato sans-serif', fontWeight: 400 }}
            >
              Utforska våra bakverk
            </a>
          </motion.div>
        </div>

        {/* Floating Glow Effects */}
        <motion.div
          className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-gold/15 to-transparent rounded-full blur-3xl hidden md:block"
          animate={{ scale: [1, 1.3, 1], rotate: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-br from-cream/20 to-transparent rounded-full blur-2xl hidden md:block"
          animate={{ scale: [1.3, 1, 1.3], rotate: [20, 0, 20] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </section>


      {/* Fullständig Meny section removed per request */}

      {/* Presenter & Tillbehör section removed per request */}

      {/* 6. About Section - Vår Historia (moved between full-width images) */}
      <section 
        id="about" 
        className="relative py-20 md:py-28 lg:py-40 min-h-[100vh] bg-gradient-to-b from-cream/30 via-white to-cream/10 overflow-hidden"
      >
        {/* Decorative background shapes */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-br from-gold/10 to-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-yellow-200/20 to-transparent rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Section Heading */}
          <div className="text-center max-w-5xl mx-auto mb-16 md:mb-20">
            <motion.h2 
              className="text-2xl font-light sm:text-3xl md:text-4xl lg:text-5xl text-black leading-tight tracking-tight mb-6 md:mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              style={{ fontFamily: 'Lato sans-serif' }}
            >
              Vår Historia
            </motion.h2>

            <motion.div 
              className="max-w-3xl mx-auto text-gray-700 text-base md:text-lg lg:text-xl leading-relaxed space-y-6 backdrop-blur-sm bg-white/40 p-6 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <p className="text-justify"
                  style={{ fontFamily: 'Lato sans-serif' }}>
                I över 40 år har Mäster Jacobs bageri & konditori bakat och levererat det finaste hantverksbrödet och traditionella svenska bakverk.
              </p>
              <p className="text-justify"
                  style={{ fontFamily: 'Lato sans-serif' }}>
                Det började som ett litet familjeföretag i Skultuna, på Mäster Jacobs väg. Redan 2 år senare var det dags att bygga ut och flytta in till "stan" sedan dess har vi funnits i Västerås och du hittar oss på Pettersbergsgatan 37.
              </p>
              <p className="text-justify"
                  style={{ fontFamily: 'Lato sans-serif' }}>
                Härifrån levererar vi dagligen, 7 dagar i veckan till hotell, caféer, restaurang, företag och privatpersoner.
              </p>
              <p className="text-justify"
                  style={{ fontFamily: 'Lato sans-serif' }}>
                Numer kan även du med några enkla knappval lägga din beställning idag och få leverans imorgon. Vårt signum är svenska klassiker!
              </p>
            </motion.div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Star Rating + QR */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              viewport={{ once: true }}
              className="space-y-8 lg:order-2"
            >
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
                className="flex items-center space-x-6 p-6 bg-gradient-to-r from-gold/10 to-yellow-100/50 rounded-xl border border-gold/20 shadow-md"
              >
                <div className="flex text-gold">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                    >
                      <FontAwesomeIcon icon={faStar} className="w-6 h-6 md:w-7 md:h-7 text-gold" />
                    </motion.div>
                  ))}
                </div>
                <div>
                  <span className="text-xl md:text-2xl font-heading font-bold text-black">4.9/5</span>
                  <span className="text-warm-gray font-body ml-2 text-sm md:text-base">från 500+ recensioner</span>
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  viewport={{ once: true }}
                  className="ml-auto"
                >
                  <div className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-lg shadow-lg border border-gold/20 p-2 flex items-center justify-center">
                    <img 
                      src="/images/Qrkod.webp" 
                      alt="QR-kod för Google recensioner" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-xs text-warm-gray text-center mt-1 font-body">Scanna & recensera</p>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Image */}
            <motion.div 
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
              className="relative"
            >
              <motion.div
                className="relative overflow-hidden rounded-3xl shadow-2xl border border-gold/30"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.5 }}
              >
                <ImageWithFallback
                  src="/images/Historia.webp"
                  alt="Vår Historia - Mäster Jacobs Bageri"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </motion.div>

              {/* Floating accents */}
              <motion.div 
                className="absolute -top-4 -right-4 w-20 h-20 md:w-28 md:h-28 bg-gradient-to-br from-gold to-yellow-500 rounded-full opacity-20"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              ></motion.div>
              <motion.div 
                className="absolute -bottom-4 -left-4 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-cream to-white rounded-full shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              ></motion.div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* 5. Second Full-Width Image Break - Delivery CTA */}
      <section className="relative h-[70vh] md:h-[80vh] lg:h-[100vh] overflow-hidden">
        {/* Background Image & Gradients */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <ImageWithFallback
            src="/images/section-cake.webp"
            alt="Fri hemleverans i Västerås"
            className="w-full h-full object-cover"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50"></div>
        </motion.div>

        {/* Floating Accent Shapes */}
        <motion.div 
          className="absolute top-1/4 left-10 w-20 h-20 md:w-28 md:h-28 bg-gradient-to-br from-gold/30 to-transparent rounded-full blur-2xl hidden md:block"
          animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-16 w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-cream/40 to-transparent rounded-full blur-2xl hidden md:block"
          animate={{ y: [0, 15, 0], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center text-white max-w-4xl"
          >
            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 md:mb-8 drop-shadow-2xl leading-tight"
              style={{ fontFamily: 'Lato sans-serif' }}
            >
              Fri hemleverans i Västerås – över 299 kr
            </motion.h2>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto space-y-4 md:space-y-6 text-base md:text-lg lg:text-xl text-white/90 leading-relaxed text-justify backdrop-blur-sm bg-black/20 p-6 rounded-2xl shadow-lg"
              style={{ fontFamily: 'Lato sans-serif' }}
            >
              <p className="text-white"
                  style={{ fontFamily: 'Lato sans-serif' }}>
                Beställ dina favoriter direkt i mobilen – snabbt, enkelt och smidigt.
              </p>
              <p className="text-white"
                  style={{ fontFamily: 'Lato sans-serif' }}>
                Fri hemleverans inom Västerås vid köp över 299 kr. Vi levererar dagligen till dörren med samma kvalitet och fräschör som i vårt bageri.
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              viewport={{ once: true }}
              className="mt-6 md:mt-8"
            >
              <motion.button
                className="bg-gradient-to-r uppercase from-gold to-yellow-500 text-black font-bold px-6 py-3 md:px-8 md:py-4 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleExternalRedirect(EXTERNAL_URLS.webbshop)}
                style={{ fontFamily: 'Lato sans-serif' }}
              >
                Beställ idag
              </motion.button>
              <div className="text-white/90 font-body mt-3 md:mt-4 text-sm md:text-base"
                    style={{ fontFamily: 'Lato sans-serif' }}>Leverans imorgon</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

    {/* <section className="py-12 bg-[#0f172a] text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-center gap-3 mb-10">
          <FontAwesomeIcon icon={faInstagram} className="text-3xl md:text-4xl transition-colors duration-300" />
          <h2 className="text-3xl font-bold uppercase tracking-wide">
            Follow us on Instagram
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(0, 6).map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer"
            >
              <img
                src={post.media_url}
                alt={post.caption || "Instagram post"}
                className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-center p-4">
                <p className="text-white text-sm md:text-base">
                  {post.caption?.slice(0, 100) || "View post"}…
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section> */}
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header centered with flanking lines */}
        <div className="flex items-center justify-center mb-8">
          <div className="hidden sm:block flex-1 max-w-[160px] h-px bg-gray-300"></div>
          <h2
            className="mx-4 text-center tracking-wide text-gray-900 text-sm sm:text-base md:text-lg font-medium"
            style={{ fontFamily: "Lato, sans-serif" }}
          >
            FÖLJ OSS PÅ INSTAGRAM
          </h2>
          <div className="hidden sm:block flex-1 max-w-[160px] h-px bg-gray-300"></div>
        </div>

        {/* Posts Grid 3x3 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {displayedPosts.map((post) => (
            <motion.a
              href={post.link}
              key={post.id}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden cursor-pointer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img
                src={post.image}
                alt={`Instagram post ${post.id}`}
                className="w-full aspect-square object-cover transform group-hover:scale-105 transition duration-500"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-500 flex items-center justify-center p-4">
                <p className="text-white text-center text-sm md:text-base leading-relaxed">
                  {post.text}
                </p>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>

      {/* 7. Instagram Feed Section - Följ oss (removed LightWidget embed per request) */}


      {/* 8. Contact Section - Hitta Oss */}
      <section
        id="contact"
        className="relative py-20 md:py-28 bg-gradient-to-b from-cream/40 via-white to-cream/30 overflow-hidden"
      >
        {/* Floating background circles */}
        <motion.div
          className="absolute -top-24 -left-24 w-64 h-64 bg-gold/10 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-72 h-72 bg-yellow-100/20 rounded-full blur-3xl"
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Header */}
          <motion.div
            {...fadeInUp}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-24 max-w-4xl mx-auto"
          >
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 leading-tight tracking-tight mb-6 md:mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              style={{ fontFamily: "Lato, sans-serif", fontWeight: 300 }}
            >
              Beställ <span className="text-gold font-semibold">nybakat</span> hem till dörren
            </motion.h2>
            <motion.p
              className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              style={{ fontFamily: "Lato, sans-serif", fontWeight: 300 }}
            >
              Vi bakar varje morgon med kärlek och levererar direkt hem till dig — snabbt, smidigt och alltid färskt.
            </motion.p>
          </motion.div>

          {/* Contact Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-stretch">
            {/* Map Card */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl border border-gold/30 h-full flex flex-col"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2019.234567890123!2d16.546399!3d59.611591!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465dcb5119640bcb%3A0xa80d27d3679d7766!2sPettersbergatan%2037%2C%20V%C3%A4ster%C3%A5s%2C%20Sweden!5e0!3m2!1sen!2sse!4v1703025123456!5m2!1sen!2sse"
                className="w-full h-full"
                style={{ border: 0, minHeight: "400px" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mäster Jacobs Bageri Västerås Location"
              ></iframe>

              <motion.div
                className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md p-5 rounded-xl shadow-xl border border-gold/30"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="flex items-start space-x-4">
                  <FontAwesomeIcon icon={faLocationDot} className="w-6 h-6 text-gold mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900 text-lg" style={{ fontFamily: "Lato, sans-serif" }}>
                      Mäster Jacobs Bageri
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: "Lato, sans-serif" }}>
                      Pettersbergatan 37<br />Västerås, Sverige
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Västerås centrum (5 min promenad)</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Details */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="space-y-8 md:space-y-10 h-full flex flex-col justify-between"
            >
              {/* Contact Info Header */}
              <div>
                <h3
                  className="text-3xl md:text-4xl font-light text-gray-900 mb-3"
                  style={{ fontFamily: "Lato, sans-serif"}}
                >
                  Kontakta <span className="text-gold font-medium">Oss</span>
                </h3>
                <p
                  className="text-gray-600 text-base md:text-lg leading-relaxed"
                  style={{ fontFamily: "Lato, sans-serif"}}
                >
                  Har du frågor om din beställning eller vårt sortiment? Hör gärna av dig — vi hjälper dig snabbt.
                </p>
              </div>

              {/* Contact info cards */}
              <div className="space-y-4 flex-1 flex flex-col justify-center">
                {contactInfo.map((item) => {
                  const iconName = iconComponents[item.icon];
                  return (
                    <motion.div
                      key={item.title}
                      className="flex items-start space-x-4 bg-white/60 hover:bg-white/90 p-4 rounded-xl border border-gold/10 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <FontAwesomeIcon icon={iconName} className="w-6 h-6 text-gold mt-1" />
                      <div>
                        <h4
                          className="font-semibold text-gray-900 text-base md:text-lg"
                          style={{ fontFamily: "Lato, sans-serif" }}
                        >
                          {item.title}
                        </h4>
                        <p
                          className="text-gray-600 text-sm leading-relaxed whitespace-pre-line"
                          style={{ fontFamily: "Lato, sans-serif"}}
                        >
                          {item.content}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <motion.button
                  className="flex-1 uppercase bg-gold hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                  style={{ fontFamily: "Lato, sans-serif" }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Webbshop
                </motion.button>
                <motion.button
                  className="flex-1 uppercase bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                  style={{ fontFamily: "Lato, sans-serif" }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Ring Oss
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Promotion Banner above Footer */}
      <section className="py-8 md:py-10 bg-gradient-to-r from-[#D0B05D] via-[#E3C56C] to-[#D0B05D] text-black">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6 bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-lg border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center md:text-left space-y-1">
              <div className="font-heading font-light text-2xl md:text-3xl tracking-wide drop-shadow-sm" style={{ fontFamily: 'Lato, sans-serif' }}>
                KAMPANJ: Fri hemleverans i Västerås över 299 kr
              </div>
              <div className="font-body font-light text-base md:text-lg opacity-90 drop-shadow-sm" style={{ fontFamily: 'Lato, sans-serif'}}>
                Beställ enkelt i mobilen – smidigt och bekvämt.
              </div>
            </div>
            <motion.button
              className="uppercase bg-[#B68E2F] hover:bg-[#A47A1F] text-black px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              style={{ fontFamily: 'Lato, sans-serif' }}
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
        className="relative text-white py-12 md:py-16 overflow-hidden"
        style={{
          backgroundImage: "url('/images/Pattern 2.svg')",
          backgroundSize: 'auto',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat'
        }}
      >
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
          >
            <motion.div variants={staggerItem} className="space-y-4 md:space-y-6">
              <div className="mb-2 md:mb-4">
                <img 
                  src="/images/logos/horizontal/Horizontal Logo inverse color lockup.svg" 
                  alt="Mäster Jacobs Logo" 
                  className="h-8 md:h-10 w-auto object-contain"
                />
              </div>
              <p className="text-warm-gray font-body font-normal text-base md:text-lg leading-relaxed" style={{ fontFamily: 'Lato, sans-serif', fontWeight: 400 }}>
              Hantverks bageri & konditori i Västerås sedan 1982.
              </p>
              <div className="pt-2 md:pt-3">
                <div className="flex items-center space-x-3">
                  <img 
                    src="/Swish Logo Primary Dark-BG SVG.svg" 
                    alt="Swish" 
                    className="w-8 h-8 md:w-10 md:h-10 object-contain"
                  />
                  <div className="font-body font-normal text-sm md:text-base" style={{ fontFamily: 'Lato, sans-serif', fontWeight: 400 }}>
                    <span className="font-normal">Swish</span>: 123 486 17 61
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={staggerItem} className="space-y-4 md:space-y-6">
              <h4 className="font-heading font-medium text-lg md:text-xl" style={{ fontFamily: 'Lato, sans-serif', fontWeight: 500 }}>Snabblänkar</h4>
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
                      className="text-warm-gray hover:text-white transition-colors font-body font-normal text-base md:text-lg flex items-center group cursor-pointer"
                      style={{ fontFamily: 'Lato, sans-serif', fontWeight: 400 }}
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
              <h4 className="font-heading font-medium text-lg md:text-xl" style={{ fontFamily: 'Lato, sans-serif', fontWeight: 500 }}>Följ Oss</h4>
              <p className="text-warm-gray font-body font-normal text-base md:text-lg leading-relaxed" style={{ fontFamily: 'Lato, sans-serif', fontWeight: 400 }}>
                Håll dig uppdaterad med våra dagliga specialiteter och nya produkter.
              </p>
              <div className="flex space-x-3 md:space-x-4">
                <motion.a 
                  href="https://facebook.com/masterjacobsbageri" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FontAwesomeIcon icon={faFacebookF} className="text-white text-lg md:text-xl" />
                </motion.a>
                <motion.a 
                  href="https://www.instagram.com/masterjacobsbageriochkonditori?igsh=aGxtcnJnbnF4Mmpu" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FontAwesomeIcon icon={faInstagram} className="text-white text-lg md:text-xl" />
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
            <p className="font-body font-normal text-warm-gray text-base md:text-lg" style={{ fontFamily: 'Lato, sans-serif', fontWeight: 400 }}>
              &copy; 2025 Mäster Jacobs Bageri & Konditori. Alla rättigheter förbehållna.
            </p>
          </motion.div>
        </div>
      </motion.footer>

      {/* Cookie Consent Banner */}
      <CookieConsent />
    </div>
  );
}