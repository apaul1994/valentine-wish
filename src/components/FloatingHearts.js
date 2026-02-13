import React from 'react';
import { motion } from 'framer-motion';

const Heart = ({ left, delay, size }) => (
  <motion.div
    initial={{ y: 300, opacity: 0 }}
    animate={{ y: -100, opacity: [0, 1, 0] }}
    transition={{ duration: 6 + Math.random() * 4, delay, repeat: Infinity, ease: 'easeInOut' }}
    style={{ left }}
    className="pointer-events-none absolute"
  >
    <div style={{ fontSize: size }} className="text-valent-700">❤️</div>
  </motion.div>
);

export default function FloatingHearts() {
  const hearts = Array.from({ length: 8 }).map((_, i) => ({ left: `${10 + i * 10}%`, delay: Math.random() * 4, size: 18 + Math.random() * 28 }));

  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {hearts.map((h, i) => (
        <Heart key={i} left={h.left} delay={h.delay} size={h.size} />
      ))}
    </div>
  );
}
