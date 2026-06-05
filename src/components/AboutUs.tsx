import { MapPin, Globe, ArrowLeft, Trophy, ShieldCheck, Zap, Users, Target, Calendar } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { motion } from 'motion/react';

interface AboutUsProps {
  onBackToMain?: () => void;
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
} as const;

export function AboutUs({ onBackToMain }: AboutUsProps) {
  const { language } = useLanguage();

  return (
    <section className="bg-[#0A0A0A] text-white min-h-screen py-16 sm:py-24 border-b border-zinc-900 font-sans selection:bg-white/20 relative overflow-hidden" id="about-us">
      {/* Background radial soft light gradient */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-zinc-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Navigation Back Header */}
        <div className="mb-12 flex justify-start">
          <button
            onClick={onBackToMain}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/10 hover:border-white/30 text-xs font-mono tracking-widest uppercase transition-all duration-300 hover:bg-white/5 text-zinc-300 hover:text-white cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            {language === 'hi' ? 'मुख्य पृष्ठ पर वापस' : 'Back to Home'}
          </button>
        </div>

        {/* Header Intro Title */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-emerald-400 font-mono font-bold block mb-4">
            {language === 'hi' ? 'हमारा इतिहास और दर्शन' : 'Our Legacy & Vision'}
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight uppercase text-white leading-tight">
            About EarthFirm
          </h1>
          <p className="text-zinc-500 text-sm sm:text-lg max-w-2xl mx-auto mt-4 leading-relaxed font-mono">
            {language === 'hi'
              ? 'चैंपियंस के लिए जमीन तैयार करना। संपूर्ण भारत में खेलों की अवसंरचना'
              : 'BUILDING THE FOUNDATIONS FOR CHAMPIONS ACROSS THE NATION'}
          </p>
        </motion.div>

        {/* Narrative Split Details */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="grid md:grid-cols-2 gap-12 sm:gap-16 items-start mb-24"
        >
          <motion.div variants={staggerItem} className="space-y-6">
            <div className="border-l-2 border-emerald-400 pl-6 space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-white">
                {language === 'hi' ? 'विश्वस्तरीय अवसंरचना' : 'World-Class Foundations'}
              </h3>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                {language === 'hi' 
                  ? 'अर्थफ़र्म स्पोर्ट्स इंफ्रा में, हमारा मानना ​​​​है कि हर महान खेल एक महान नींव के साथ शुरू होता है। इंदौर, मध्य प्रदेश में स्थित, हम विश्व स्तरीय खेल सुविधाओं की डिजाइनिंग और विकास में विशेषज्ञ हैं।'
                  : 'At EarthFirm Sports Infra, we believe that every great game begins with a great foundation. As a premier sports infrastructure leader based in Indore, Madhya Pradesh, we specialize in designing, developing, and delivering world-class sports facilities that inspire performance.'}
              </p>
            </div>

            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed pl-6">
              {language === 'hi'
                ? 'हमारा अनुभव खेल बुनियादी ढांचे के विकास के संपूर्ण क्षेत्र को कवर करता है, जिसमें टेनिस कोर्ट, बास्केटबॉल कोर्ट, बैडमिंटन कोर्ट और बहुउद्देश्यीय सिंथेटिक टर्फ शामिल हैं।'
                : 'Our end-to-end expertise covers the complete spectrum of premium civil & synthetic infrastructure development. From custom elite basketball arenas and tournament-grade tennis courts to state-of-the-art multi-sport complexes, we execute every phase with strict precision and architectural excellence.'}
            </p>
          </motion.div>

          <motion.div variants={staggerItem} className="space-y-6">
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              {language === 'hi'
                ? 'हम पूरे भारत में स्कूलों, खेल अकादमियों, क्लबों और निजी बिल्डरों के साथ गर्व से काम करते हैं।'
                : 'We serve an elite clientele including national schools, sports academies, residential developers, private clubs, and state institutions. Every design we craft combines tournament-certified materials with advanced civil engineering practices.'}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-5 hover:border-emerald-500/20 transition-all duration-300">
                <Trophy className="h-6 w-6 text-emerald-400 mb-3" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-white">Premium Quality</h4>
                <p className="text-zinc-500 text-xs mt-1">FIBA & ITF standard ready-to-play surfaces.</p>
              </div>
              <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-5 hover:border-emerald-500/20 transition-all duration-300">
                <ShieldCheck className="h-6 w-6 text-emerald-400 mb-3" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-white">Guaranteed Trust</h4>
                <p className="text-zinc-500 text-xs mt-1">100% durable civil base stabilization.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Interactive Stats Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-24 border-y border-white/5 py-10"
        >
          <motion.div variants={staggerItem} className="text-center">
            <p className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">100%</p>
            <p className="text-zinc-500 font-mono uppercase text-[10px] sm:text-xs tracking-wider mt-2">Durable Civil Quality</p>
          </motion.div>
          <motion.div variants={staggerItem} className="text-center">
            <p className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">ITF/FIBA</p>
            <p className="text-zinc-500 font-mono uppercase text-[10px] sm:text-xs tracking-wider mt-2">Standard Surfacing</p>
          </motion.div>
          <motion.div variants={staggerItem} className="text-center">
            <p className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">PAN-IND</p>
            <p className="text-zinc-500 font-mono uppercase text-[10px] sm:text-xs tracking-wider mt-2">Active Deployments</p>
          </motion.div>
          <motion.div variants={staggerItem} className="text-center">
            <p className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">24/7</p>
            <p className="text-zinc-500 font-mono uppercase text-[10px] sm:text-xs tracking-wider mt-2">Consultation Support</p>
          </motion.div>
        </motion.div>

        {/* Meet Our Founders Section */}
        <div className="pt-8 mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-xs uppercase tracking-[0.2em] text-emerald-400 font-mono font-bold block mb-3">
              Leadership
            </span>
            <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              {language === 'hi' ? 'हमारे संस्थापकों से मिलें' : 'Meet Our Founders'}
            </h3>
            <p className="text-zinc-500 text-xs sm:text-sm max-w-md mx-auto mt-3 font-mono">
              {language === 'hi' 
                ? 'उन दूरदर्शी लोगों से मिलें जो भारत की खेल अवसंरचना को नया रूप दे रहे हैं।' 
                : 'The visionary engineers shaping high-performance civil sports environments across India.'}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-zinc-950/80 border border-white/5 rounded-3xl p-8 sm:p-10 text-center flex flex-col items-center justify-center min-h-[260px] transition-all hover:border-emerald-500/20 group hover:shadow-lg hover:shadow-emerald-500/2"
            >
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center text-emerald-400 mb-5 border border-white/10 group-hover:scale-105 transition-transform duration-300">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white uppercase tracking-wide">Technical Director</h4>
              <p className="text-emerald-400 text-xs font-mono mt-1.5 uppercase tracking-wider">Civil & Structural Operations</p>
              <p className="text-zinc-500 text-xs mt-4 italic max-w-xs leading-relaxed">
                Overseeing structural foundation concrete, precision asphalt leveling, and international safety grading compliance.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-zinc-950/80 border border-white/5 rounded-3xl p-8 sm:p-10 text-center flex flex-col items-center justify-center min-h-[260px] transition-all hover:border-emerald-500/20 group hover:shadow-lg hover:shadow-emerald-500/2"
            >
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center text-emerald-400 mb-5 border border-white/10 group-hover:scale-105 transition-transform duration-300">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white uppercase tracking-wide">Managing Director</h4>
              <p className="text-emerald-400 text-xs font-mono mt-1.5 uppercase tracking-wider">Strategic Client Alliances</p>
              <p className="text-zinc-500 text-xs mt-4 italic max-w-xs leading-relaxed">
                Leading strategic expansion, client consultation workflows, and partnerships with national academies and schools.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Bottom Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center bg-zinc-950 border border-white/5 p-10 sm:p-14 rounded-3xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none" />
          <p className="text-2xl sm:text-4xl font-serif font-medium italic text-zinc-100 mb-8 max-w-3xl mx-auto leading-normal">
            "EarthFirm Sports Infra — From Blueprint to Glory."
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-10 text-xs sm:text-sm font-mono tracking-wider text-zinc-400">
            <div className="flex items-center gap-2.5">
              <MapPin className="h-4.5 w-4.5 text-emerald-400" />
              <span>Indore, Madhya Pradesh</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Globe className="h-4.5 w-4.5 text-emerald-400" />
              <span>Serving Clients Across India</span>
            </div>
          </div>
        </motion.div>

        {/* Back Button Footer block */}
        <div className="mt-16 flex justify-center">
          <button
            onClick={onBackToMain}
            className="flex items-center gap-2 px-6 py-3.5 bg-white text-black hover:bg-zinc-200 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-lg hover:shadow-white/5 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'hi' ? 'मुख्य पृष्ठ पर वापस' : 'Back to Home'}
          </button>
        </div>

      </div>
    </section>
  );
}
