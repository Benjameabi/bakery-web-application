import { motion } from "motion/react";
import { ShoppingCart, X, Plus, Minus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CartItem } from "../hooks/useCart";

interface CartModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  cart: CartItem[];
  getTotalItems: () => number;
  getTotalPrice: () => number;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

export function CartModal({ 
  isOpen, 
  onClose, 
  cart, 
  getTotalItems, 
  getTotalPrice, 
  onUpdateQuantity, 
  onRemove 
}: CartModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-white/95 backdrop-blur-md border-2 border-gold/20 shadow-2xl">
        <DialogHeader className="border-b border-gold/20 pb-6">
          <DialogTitle className="font-heading text-3xl text-black">
            Varukorg ({getTotalItems()} {getTotalItems() === 1 ? 'vara' : 'varor'})
          </DialogTitle>
          <DialogDescription className="font-body text-warm-gray text-lg">
            Granska och hantera de produkter du valt från vårt bageri.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {cart.length > 0 ? (
            <>
              <div className="max-h-96 overflow-y-auto space-y-4">
                {cart.map((item) => (
                  <motion.div 
                    key={item.id} 
                    className="flex items-center space-x-6 p-6 border-2 border-gold/20 bg-white/80 backdrop-blur-sm shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <motion.div
                      className="w-20 h-20 overflow-hidden shadow-lg"
                      whileHover={{ scale: 1.1 }}
                    >
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold text-black text-lg">{item.name}</h3>
                      <p className="text-warm-gray font-body">{item.category}</p>
                      {item.variant && (
                        <p className="text-xs text-warm-gray font-body">{item.variant}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <motion.button
                        className="w-10 h-10 border-2 border-gold text-gold hover:bg-gold hover:text-black transition-all duration-300 flex items-center justify-center font-heading"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Minus className="w-4 h-4" />
                      </motion.button>
                      <span className="font-heading font-bold w-12 text-center text-lg">{item.quantity}</span>
                      <motion.button
                        className="w-10 h-10 border-2 border-gold text-gold hover:bg-gold hover:text-black transition-all duration-300 flex items-center justify-center font-heading"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Plus className="w-4 h-4" />
                      </motion.button>
                    </div>
                    <div className="text-right">
                      <p className="font-heading font-bold text-gold text-lg">{item.price}</p>
                      <motion.button
                        className="text-red-600 hover:text-red-700 p-2 mt-2 hover:bg-red-50 transition-all duration-300"
                        onClick={() => onRemove(item.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                className="border-t-2 border-gold/20 pt-6 space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex justify-between items-center p-6 bg-gradient-to-r from-gold/10 to-yellow-100/50 border-2 border-gold/20">
                  <span className="font-heading font-bold text-2xl text-black">Totalt:</span>
                  <span className="font-heading font-bold text-3xl text-gold">{getTotalPrice()} kr</span>
                </div>
                
                <div className="flex gap-4">
                  <motion.button
                    className="btn-secondary flex-1"
                    onClick={() => onClose(false)}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Fortsätt handla
                  </motion.button>
                  <motion.button
                    className="btn-primary flex-1"
                    onClick={() => alert('Checkout funktionalitet skulle implementeras här!')}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Kassa
                  </motion.button>
                </div>
              </motion.div>
            </>
          ) : (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ShoppingCart className="w-20 h-20 text-warm-gray mx-auto mb-6" />
              </motion.div>
              <p className="text-warm-gray font-body text-xl mb-2">Din varukorg är tom</p>
              <p className="text-warm-gray font-body mb-8">Lägg till produkter från vårt sortiment</p>
              <motion.button
                className="btn-primary"
                onClick={() => onClose(false)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Bläddra bland produkter
              </motion.button>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}