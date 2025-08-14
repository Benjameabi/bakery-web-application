import { motion } from "motion/react";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { products } from "../lib/constants";
import { staggerContainer, staggerItem } from "../lib/animations";

interface SearchModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  searchQuery: string;
  onSearch: (query: string) => void;
  onAddToCart: (product: typeof products[0]) => void;
}

export function SearchModal({ isOpen, onClose, searchQuery, onSearch, onAddToCart }: SearchModalProps) {
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[85vh] bg-white/95 backdrop-blur-md border-2 border-gold/20 shadow-2xl">
        <DialogHeader className="border-b border-gold/20 pb-6">
          <DialogTitle className="font-heading text-3xl text-black">Sök produkter</DialogTitle>
          <DialogDescription className="font-body text-warm-gray text-lg">
            Sök efter produkter, kategorier eller beskrivningar i vårt sortiment.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Input
              placeholder="Sök efter produkter, kategorier eller beskrivningar..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="text-xl p-6 border-2 border-gold/30 focus:border-gold bg-white/80 backdrop-blur-sm font-body"
              autoFocus
            />
          </motion.div>
          
          <div className="max-h-96 overflow-y-auto">
            {searchQuery.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={staggerContainer}
                initial="initial"
                animate="whileInView"
              >
                {filteredProducts.map((product) => (
                  <motion.div 
                    key={product.id} 
                    variants={staggerItem}
                    className="flex items-center space-x-6 p-6 border-2 border-gold/20 hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <motion.div
                      className="w-20 h-20 overflow-hidden shadow-lg"
                      whileHover={{ scale: 1.1 }}
                    >
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold text-black text-lg">{product.name}</h3>
                      <p className="text-warm-gray font-body">{product.category}</p>
                      {product.variant && (
                        <p className="text-xs text-warm-gray font-body">{product.variant}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-heading font-bold text-gold text-lg">{product.price}</p>
                      <motion.button
                        className="btn-primary btn-small mt-3"
                        onClick={() => {
                          onAddToCart(product);
                          onClose(false);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Lägg i varukorg
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
                {filteredProducts.length === 0 && (
                  <div className="text-center py-12 col-span-2">
                    <p className="text-warm-gray font-body text-lg">Inga produkter hittades för "{searchQuery}"</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-warm-gray mx-auto mb-4" />
                <p className="text-warm-gray font-body text-lg">Börja skriva för att söka efter produkter...</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}