import { motion } from 'framer-motion';

// Componente de div animada básica
export const AnimatedDiv = ({ children, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    {...props}
  >
    {children}
  </motion.div>
);

// Componente para efeito de fade-in
export const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

// Componente para slide-in em diferentes direções
export const SlideIn = ({ children, direction = 'left' }) => {
  const x = direction === 'left' ? -50 : direction === 'right' ? 50 : 0;
  const y = direction === 'up' ? 50 : direction === 'down' ? -50 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

// Componente para animação de hover
export const HoverScale = ({ children, scale = 1.05 }) => (
  <motion.div whileHover={{ scale }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
    {children}
  </motion.div>
);
