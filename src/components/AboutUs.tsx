import { MapPin, Globe } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { motion } from 'motion/react';

const staggerItem = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
} as const;

export function AboutUs() {
  const { language } = useLanguage();
  return (
    <section className="bg-white py-24 border-b border-stone-200" id="about-us">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={staggerItem} className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-brand-sage font-mono font-bold block mb-3">
            Our Story
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-brand-stone mb-6">
            About EarthFirm Sports Infra
          </h2>
        </motion.div>

        <div className="prose prose-stone max-w-none text-stone-600 space-y-6">
          <motion.p variants={staggerItem} className="text-lg leading-relaxed">
            At EarthFirm Sports Infra, we believe that every great game begins with a great foundation. As a leading sports infrastructure company based in Indore, Madhya Pradesh, we specialize in designing, developing, and delivering world-class sports facilities that inspire performance, promote active lifestyles, and create lasting value.
          </motion.p>
          <motion.p variants={staggerItem} className="text-lg leading-relaxed">
            Our expertise covers the complete spectrum of sports infrastructure development, including stadium construction, sports complexes, tennis courts, basketball courts, badminton courts, pickleball courts, swimming pools, synthetic turf installations, athletic tracks, and customized sports facilities. From concept and planning to execution and finishing, we provide end-to-end solutions tailored to the unique needs of each project.
          </motion.p>
          <motion.p variants={staggerItem} className="text-lg leading-relaxed">
            We proudly work with schools, colleges, sports academies, clubs, residential communities, government bodies, and private developers across India. Every project we undertake is built with precision engineering, premium materials, and a strong commitment to quality, durability, safety, and timely delivery.
          </motion.p>
          <motion.p variants={staggerItem} className="text-lg leading-relaxed">
            With a vision to elevate India's sporting landscape, we are dedicated to creating infrastructure that empowers athletes, supports communities, and nurtures the next generation of champions. Whether it's a local training facility or a large-scale sports complex, our goal remains the same — To build spaces where sports thrive and dreams take shape.
          </motion.p>

          {/* Meet Our Founders Section */}
          <div className="pt-16 border-t border-stone-200">
            <motion.div variants={staggerItem} className="text-center mb-12">
              <span className="text-xs uppercase tracking-[0.2em] text-brand-sage font-mono font-bold block mb-3">
                Leadership
              </span>
              <h3 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-brand-stone">
                {language === 'hi' ? 'हमारे संस्थापकों से मिलें' : 'Meet Our Founders'}
              </h3>
              <p className="text-stone-500 text-sm max-w-md mx-auto mt-2">
                {language === 'hi' 
                  ? 'उन दूरदर्शी लोगों से मिलें जो भारत की खेल अवसंरचना को नया रूप दे रहे हैं।' 
                  : 'The visionary minds shaping high-performance civil sports environments across India.'}
              </p>
            </motion.div>

            {/* Elegant profile placeholders, showing premium outline boxes with details to be updated later */}
            <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto mt-8">
              <motion.div variants={staggerItem} className="bg-stone-50 border border-stone-200/65 rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[220px] transition-all hover:shadow-md hover:border-brand-sage/30">
                <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center text-stone-400 mb-4 border border-stone-300">
                  <span className="text-xs font-mono font-bold">1</span>
                </div>
                <h4 className="text-lg font-bold text-brand-stone font-serif">Founder Profile</h4>
                <p className="text-stone-500 text-xs font-mono mt-1 uppercase tracking-wider">Managing Director</p>
                <p className="text-stone-400 text-xs mt-3 italic">Profile and background details coming soon</p>
              </motion.div>

              <motion.div variants={staggerItem} className="bg-stone-50 border border-stone-200/65 rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[220px] transition-all hover:shadow-md hover:border-brand-sage/30">
                <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center text-stone-400 mb-4 border border-stone-300">
                  <span className="text-xs font-mono font-bold">2</span>
                </div>
                <h4 className="text-lg font-bold text-brand-stone font-serif">Co-Founder Profile</h4>
                <p className="text-stone-500 text-xs font-mono mt-1 uppercase tracking-wider">Technical Director</p>
                <p className="text-stone-400 text-xs mt-3 italic">Profile and background details coming soon</p>
              </motion.div>
            </div>
          </div>

          <motion.div variants={staggerItem} className="text-center mt-16 bg-neutral-900 text-white p-10 sm:p-12 rounded-3xl shadow-xl">
            <p className="text-2xl sm:text-3xl font-serif font-bold italic text-white mb-8">
              "EarthFirm Sports Infra — From Blueprint to Glory."
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-sm sm:text-base font-mono tracking-wider text-neutral-300">
               <div className="flex items-center gap-3">
                 <MapPin className="h-5 w-5 text-brand-sage" />
                 <span>Indore, Madhya Pradesh</span>
               </div>
               <div className="flex items-center gap-3">
                 <Globe className="h-5 w-5 text-brand-sage" />
                 <span>Serving Clients Across India</span>
               </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
