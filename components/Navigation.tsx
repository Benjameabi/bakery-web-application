import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
const logoHorizontalInverse = "/images/logos/horizontal/Horizontal Logo inverse color lockup.svg";
const logoStackedInverse = "/images/logos/stacked/Stacked Logo inverse color lockup.svg";

interface NavigationProps {
  setIsMobileMenuOpen: (open: boolean) => void;
  onSearchClick: () => void;
  onCartClick: () => void;
  onWebbshopClick: () => void;
}

export function Navigation({ 
  setIsMobileMenuOpen, 
  onSearchClick,
  onCartClick,
  onWebbshopClick
}: NavigationProps) {
  const [isShrunk, setIsShrunk] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsShrunk(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={"absolute left-0 right-0 top-0 z-50 bg-transparent"}
    >
      <div className="container mx-auto px-4 md:px-6" style={{ height: isShrunk ? '120px' : '160px', transition: 'height 300ms ease' }}>
        <div className="flex items-center h-full relative">
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(true)}
              className={"p-2 rounded-xl transition-all duration-300 text-black hover:text-gold hover:bg-gold/5"}
            >
              <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Desktop Left Menu */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8 flex-1">
            {[
              { name: 'Vår butik', href: '#contact', external: false },
              { name: 'Kontakta oss', href: '#contact', external: false },
              { name: 'Webbshop', href: "", external: true, onClick: onWebbshopClick }
            ].map((item, index) => (
              <motion.a
                key={item.name}
                href={item.external ? undefined : item.href}
                onClick={item.external ? item.onClick : undefined}
                className={"font-body text-black hover:text-gold transition-all duration-300 relative group cursor-pointer"}
                style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: '18px', lineHeight: '28px' }}
                whileHover={{ y: -2, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></span>
              </motion.a>
            ))}
          </div>
          
          {/* Centered Logo */}
          <motion.div 
            className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center"
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <motion.div 
              className="flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              {/* Mobile + Tablet: Stacked logo (inverse) */}
              <img
                src={logoStackedInverse}
                alt="Mäster Jacobs Logo"
                className={`block lg:hidden object-contain drop-shadow-lg transition-all duration-300 ${isShrunk ? 'w-32 h-20 md:w-40 md:h-24' : 'w-40 h-24 md:w-56 md:h-28'}`}
              />
              {/* Desktop (Web): Horizontal logo (inverse) */}
              <img
                src={logoHorizontalInverse}
                alt="Mäster Jacobs Logo"
                className={`hidden lg:block object-contain drop-shadow-lg transition-all duration-300 ${isShrunk ? 'lg:w-56 lg:h-20' : 'lg:w-80 lg:h-28'}`}
              />
            </motion.div>
          </motion.div>

          {/* Mobile Cart */}
          <div className="md:hidden flex items-center">
            <motion.div 
              className="flex items-center space-x-2 cursor-pointer p-1.5"
              onClick={onCartClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FontAwesomeIcon icon={faShoppingCart} className={"w-5 h-5 text-black hover:text-gold transition-colors cursor-pointer"} />
              <motion.div 
                className="w-5 h-5 bg-gradient-to-br from-gold to-yellow-600 rounded-full flex items-center justify-center shadow-lg"
                initial={{ scale: 1 }}
              >
                <span className="text-black text-xs font-bold">0</span>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Desktop Right Menu */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6 flex-1 justify-end">
            {/* Search */}
            <motion.div 
              className="flex items-center cursor-pointer group relative"
              onClick={onSearchClick}
              whileHover={{ y: -2, scale: 1.02 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <FontAwesomeIcon icon={faSearch} className={"w-5 h-5 text-black group-hover:text-gold transition-all duration-300 cursor-pointer"} />
              <span className={"ml-2 font-body text-black group-hover:text-gold transition-all duration-300 relative"} style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: '18px', lineHeight: '28px' }}>
                Sök produkter
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></span>
              </span>
            </motion.div>
            
            {/* Shopping Cart */}
            <motion.div 
              className="flex items-center space-x-2 cursor-pointer group relative"
              onClick={onCartClick}
              whileHover={{ y: -2, scale: 1.02 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <FontAwesomeIcon icon={faShoppingCart} className={"w-5 h-5 text-black group-hover:text-gold transition-all duration-300 cursor-pointer"} />
              <span className={"font-body text-black group-hover:text-gold transition-all duration-300 relative"} style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: '18px', lineHeight: '28px' }}>
                Varukorg
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></span>
              </span>
              <motion.div 
                className="w-6 h-6 bg-gradient-to-br from-gold to-yellow-600 rounded-full flex items-center justify-center shadow-lg"
                initial={{ scale: 1 }}
              >
                <span className="text-black text-xs font-bold">0</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}