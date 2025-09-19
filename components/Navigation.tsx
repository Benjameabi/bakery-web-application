import { motion } from "motion/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
const logoHorizontal = "/images/logos/horizontal/Horizontal Logo inverse color lockup.svg";
const logoStacked = "/images/logos/stacked/Stacked Logo full color lockup.svg";

interface NavigationProps {
  isScrolled: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  onSearchClick: () => void;
  onCartClick: () => void;
  onWebbshopClick: () => void;
}

export function Navigation({ 
  isScrolled, 
  setIsMobileMenuOpen, 
  onSearchClick,
  onCartClick,
  onWebbshopClick
}: NavigationProps) {
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'top-0 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/85 shadow-2xl border-b border-gold/10' 
          : 'top-8 md:top-12 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6" style={{ height: isScrolled ? '120px' : '160px' }}>
        <div className="flex items-center h-full relative">
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(true)}
              className={`p-2 rounded-xl transition-all duration-300 ${
                isScrolled 
                  ? 'text-black hover:text-gold hover:bg-gold/5' 
                  : 'text-white hover:text-gold hover:bg-white/10'
              }`}
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
                className={`font-body hover:text-gold transition-all duration-300 relative group cursor-pointer ${
                  isScrolled ? 'text-black' : 'text-white'
                }`}
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
            animate={{ scale: isScrolled ? 0.75 : 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <motion.div 
              className="flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src={isScrolled ? logoStacked : logoHorizontal} 
                alt="Mäster Jacobs Logo" 
                className={`object-contain drop-shadow-lg transition-all duration-400 ${
                  isScrolled 
                    ? 'w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28' 
                    : 'w-48 h-20 md:w-64 md:h-24 lg:w-80 lg:h-28'
                }`}
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
              <FontAwesomeIcon icon={faShoppingCart} className={`w-5 h-5 ${isScrolled ? 'text-black' : 'text-white'} hover:text-gold transition-colors cursor-pointer`} />
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
              className="flex items-center cursor-pointer group"
              onClick={onSearchClick}
              whileHover={{ y: -2, scale: 1.02 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <FontAwesomeIcon icon={faSearch} className={`w-5 h-5 ${isScrolled ? 'text-black' : 'text-white'} group-hover:text-gold transition-all duration-300 cursor-pointer`} />
              <span className={`ml-2 font-body ${isScrolled ? 'text-black' : 'text-white'} group-hover:text-gold transition-all duration-300`} style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: '18px', lineHeight: '28px' }}>Sök produkter</span>
            </motion.div>
            
            {/* Shopping Cart */}
            <motion.div 
              className="flex items-center space-x-2 cursor-pointer group"
              onClick={onCartClick}
              whileHover={{ y: -2, scale: 1.02 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <FontAwesomeIcon icon={faShoppingCart} className={`w-5 h-5 ${isScrolled ? 'text-black' : 'text-white'} group-hover:text-gold transition-all duration-300 cursor-pointer`} />
              <span className={`font-body ${isScrolled ? 'text-black' : 'text-white'} group-hover:text-gold transition-all duration-300`} style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: '18px', lineHeight: '28px' }}>Varukorg</span>
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