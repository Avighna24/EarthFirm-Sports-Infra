import { motion } from 'motion/react';
import { MapPin, Calendar, ArrowUpRight } from 'lucide-react';
import { useCMSData } from '../lib/cms-store';

export function Portfolio() {
  const { data } = useCMSData();
  const { portfolio } = data;

  if (portfolio.length === 0) return null;

  return (
    <section id="portfolio" className="py-24 bg-white overflow-hidden text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-[10px] font-mono text-brand-sage uppercase tracking-[0.3em] font-bold mb-4">Masterpiece Works</h2>
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <h3 className="text-4xl md:text-5xl font-serif text-brand-stone tracking-tight bg-clip-text">
              The <span className="text-brand-sage italic">Sovereign</span> Arena Collection
            </h3>
            <p className="max-w-md text-brand-stone/60 text-sm leading-relaxed">
              Explore our most prestigious sports installations, ranging from FIBA-approved basketball arenas to tournament-grade athletic facilities.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {portfolio.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-[3rem] mb-6">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 will-change-transform"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-stone/90 via-brand-stone/20 to-transparent flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-white/80 text-sm leading-relaxed max-w-sm mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {item.description}
                  </p>
                  <div className="flex gap-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono text-brand-sage font-bold">
                      <MapPin className="h-3 w-3" />
                      {item.location}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono text-white/60">
                      <Calendar className="h-3 w-3" />
                      {item.year}
                    </div>
                  </div>
                </div>
                <div className="absolute top-6 right-6 h-12 w-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 hover:bg-brand-sage hover:text-black">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
                <div className="absolute top-6 left-6 px-4 py-1.5 bg-brand-sage/20 backdrop-blur-md border border-brand-sage/30 rounded-full">
                   <span className="text-[10px] font-bold font-mono text-white uppercase tracking-widest">{item.category}</span>
                </div>
              </div>
              
              <div className="px-2">
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-px bg-brand-sage/30 flex-grow" />
                  <span className="text-[10px] font-bold font-mono text-brand-sage uppercase tracking-widest">{item.year}</span>
                </div>
                <h4 className="text-2xl font-serif text-brand-stone group-hover:text-brand-sage transition-colors duration-300 tracking-tight">
                  {item.title}
                </h4>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
