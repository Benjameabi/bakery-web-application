// Enhanced animation variants
export const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
};

export const fadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  transition: { duration: 1, ease: "easeOut" }
};

export const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
};

export const scaleOnHover = {
  scale: 1.02,
  transition: { duration: 0.3, ease: "easeOut" }
};