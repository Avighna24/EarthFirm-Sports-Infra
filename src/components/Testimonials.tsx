import { motion } from 'motion/react';
import { Quote, Star, User } from 'lucide-react';
import { useCMSData } from '../lib/cms-store';

export function Testimonials() {
  const { data } = useCMSData();
  const { testimonials } = data;

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-24 bg-brand-cream/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div className="max-w-2xl text-left">
            <h2 className="text-[10px] font-mono text-brand-sage uppercase tracking-[0.3em] font-bold mb-4">Client Echo</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-brand-stone tracking-tight leading-tight">
              A Legacy of <span className="text-brand-sage italic">Excellence</span> on Paper and the Court.
            </h3>
          </div>
          <div className="hidden md:block">
             <Quote className="h-16 w-16 text-brand-sage/20 -mb-4" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(144,157,142,0.08)] border border-brand-sage/10 flex flex-col h-full hover:translate-y-[-8px] transition-transform duration-500"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(t.stars)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <blockquote className="flex-grow text-lg text-brand-stone leading-relaxed italic mb-8">
                &quot;{t.content}&quot;
              </blockquote>

              <div className="flex items-center gap-4 pt-6 border-t border-brand-cream">
                <div className="h-12 w-12 rounded-full bg-brand-sage/10 flex items-center justify-center overflow-hidden shrink-0 border border-brand-sage/20">
                  {t.image ? (
                    <img 
                      src={t.image} 
                      alt={t.name} 
                      className="h-full w-full object-cover" 
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                    />
                  ) : <User className="h-6 w-6 text-brand-sage" />}
                </div>
                <div>
                  <h4 className="font-bold text-brand-stone text-sm">{t.name}</h4>
                  <p className="text-[10px] font-mono text-brand-sage uppercase tracking-wider font-bold">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
