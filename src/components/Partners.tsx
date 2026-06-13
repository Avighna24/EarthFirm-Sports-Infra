import { motion } from 'motion/react';
import { useCMSData } from '../lib/cms-store';

export function Partners() {
  const { data } = useCMSData();
  const { partners } = data;

  if (partners.length === 0) return null;

  // Duplicate the partners array to create a seamless loop
  const marqueePartners = [...partners, ...partners];

  return (
    <section id="our-partners" className="py-24 bg-[#0a0c0a] relative overflow-hidden border-y border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(144,157,142,0.05),transparent)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-16">
        <div className="text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] font-mono text-brand-sage uppercase tracking-[0.4em] font-bold mb-4"
          >
            Sovereign Trust
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-serif text-white tracking-tight leading-tight"
          >
            Pioneering Industry Partners
          </motion.h3>
        </div>
      </div>

      <div className="relative">
        {/* Gradients on edges for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0a0c0a] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0a0c0a] to-transparent z-20 pointer-events-none" />

        <div className="flex overflow-hidden">
          <motion.div 
            className="flex gap-12 sm:gap-20 items-center justify-start py-4 w-max will-change-transform"
            style={{ transform: 'translateZ(0)' }}
            animate={{
              x: ["0%", "-50%"]
            }}
            transition={{
              duration: 40, // Slightly slower for better stability
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {marqueePartners.map((partner, index) => (
              <div
                key={`${partner.id}-${index}`}
                className="flex items-center justify-center shrink-0"
              >
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className="h-10 sm:h-14 md:h-16 w-auto object-contain hover:scale-105 cursor-pointer filter contrast-125 brightness-110" 
                  title={partner.name}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
