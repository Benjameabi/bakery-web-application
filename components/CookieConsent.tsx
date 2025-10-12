import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem('cookies-accepted');
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookies-accepted', 'true');
    setIsVisible(false);
  };

  const learnMore = () => {
    // You can replace this with a link to your privacy policy
    window.open('/privacy-policy', '_blank');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-t border-white/10"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-white font-body text-sm leading-relaxed">
                  Vi använder cookies för att kunna ge dig bättre service. Fortsätt att bläddra eller tryck "OK" för att acceptera.{" "}
                  <button
                    onClick={learnMore}
                    className="text-gold underline hover:text-yellow-400 transition-colors"
                  >
                    Läs mer
                  </button>
                </p>
              </div>
              <motion.button
                onClick={acceptCookies}
                className="btn-primary btn-small px-8 py-2 text-sm rounded-[var(--button-radius)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                OK
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

