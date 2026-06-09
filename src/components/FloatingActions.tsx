import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, PhoneCall, Mail, Navigation, Calendar, X, CheckSquare, ShieldCheck, Sparkles, User, Phone, MapPin, Send } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { saveDocument } from './firebase';

interface FloatingActionsProps {
  onScrollToContact: (elementId: string) => void;
}

export function FloatingActions({ onScrollToContact }: FloatingActionsProps) {
  const { language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    location: '',
    sportType: 'BASKETBALL',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [bookingId, setBookingId] = useState('');

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!formData.phone.trim()) {
      errors.phone = 'Mobile Number is required';
    } else if (!/^\+?[0-9\s-]{10,14}$/.test(formData.phone.trim())) {
      errors.phone = 'Please enter a valid mobile number';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email Address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.location.trim()) errors.location = 'Project Location is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Generate unique booking number
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const bId = `EF-${new Date().getFullYear()}-${randomNum}`;
      setBookingId(bId);
      setIsSubmitted(true);
      
      // Save locally (persistence)
      const cachedCons = JSON.parse(localStorage.getItem('premium_consultations') || '[]');
      const newEntry = {
        id: bId,
        ...formData,
        dateSubmitted: new Date().toISOString()
      };
      cachedCons.push(newEntry);
      localStorage.setItem('premium_consultations', JSON.stringify(cachedCons));

      // Save securely to Cloud Firestore separately
      await saveDocument('floating_consultations', bId, {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        location: formData.location,
        sportType: formData.sportType,
        notes: formData.notes
      });
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      location: '',
      sportType: 'BASKETBALL',
      notes: ''
    });
    setFormErrors({});
    setIsSubmitted(false);
    setIsModalOpen(false);
  };

  const currentWhatsappNumber = '919893777095'; // Primary hotline from footer
  const whatsappUrl = `https://wa.me/${currentWhatsappNumber}?text=Hi`;

  const sportsOptions = [
    { value: 'BASKETBALL', label: 'Basketball Court' },
    { value: 'TENNIS', label: 'Tennis Court' },
    { value: 'PICKLEBALL', label: 'Pickleball Arena' },
    { value: 'FOOTBALL', label: 'Football Turf' },
    { value: 'TRACK_FIELD', label: 'Track & Running Fields' },
    { value: 'GYM', label: 'Multi-Purpose Gym' },
    { value: 'CRICKET', label: 'Cricket Turf' },
    { value: 'BADMINTON', label: 'Badminton Court' },
    { value: 'SWIMMING_POOL', label: 'Swimming Pool' },
    { value: 'SQUASH', label: 'Squash Court' },
    { value: 'VOLLEYBALL', label: 'Volleyball Court' },
    { value: 'OTHER', label: 'Other Infrastructure' }
  ];

  return (
    <>
      {/* SUCCESS TOAST */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 right-6 z-60 bg-amber-500 text-black px-6 py-3 rounded-full shadow-2xl font-bold text-sm tracking-wide"
          >
            Inquiry received successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* PERSISTENT FLOATING CONTAINER */}
      <div 
        id="global-floating-widget"
        className="fixed bottom-6 right-6 z-50 flex flex-col items-center sm:items-end gap-3 font-sans"
      >
        {/* Row 1: Book Free Consultation Button */}
        <motion.button
          onClick={() => setIsModalOpen(true)}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 px-6 rounded-full shadow-2xl flex items-center gap-2 border border-white/20 hover:border-white/40 cursor-pointer transition-all duration-300 text-xs sm:text-sm uppercase tracking-wider"
          style={{ boxShadow: '0 10px 25px -5px rgba(217, 119, 6, 0.4)' }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          {language === 'hi' ? 'अभी फ्री परामर्श बुक करें !' : 'Book your Free Consultation Now !'}
        </motion.button>

        {/* Row 2: Secondary buttons side-by-side */}
        <div className="flex items-center gap-2.5">
          {/* WhatsApp Button */}
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full flex items-center justify-center shadow-xl cursor-pointer transition-colors border border-white/20"
            style={{ boxShadow: '0 8px 20px -4px rgba(37, 211, 102, 0.5)' }}
            title={language === 'hi' ? 'व्हाट्सएप से चैट करें' : 'Chat via WhatsApp'}
          >
            {/* Custom SVG of recognized WhatsApp Logo for premium accuracy */}
            <svg viewBox="0 0 24 24" className="w-6.5 h-6.5 fill-current">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.446L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.883-6.97C16.538 1.967 14.07 1.43 12.01 1.43c-5.442 0-9.866 4.372-9.87 9.802 0 1.63.43 3.224 1.25 4.634L2.348 21.65l5.962-1.556c-1.558.913-1.076.623-1.663.14l.002.004zM17.47 14.39c-.3-.149-1.77-.8742-2.04-.973-.272-.101-.471-.149-.668.149-.198.299-.767.973-.941 1.171-.173.197-.347.223-.647.074-.3-.149-1.265-.466-2.41-1.488-.89-.794-1.49-1.775-1.666-2.074-.173-.298-.018-.46.13-.608.136-.131.3-.348.45-.522.15-.174.198-.298.299-.497.101-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118s1.771-.723 2.022-1.408c.25-.684.25-1.272.179-1.396-.073-.124-.268-.198-.57-.348zm0 0" />
            </svg>
          </motion.a>

          {/* Contact Direct Shortcut Button */}
          <motion.button
            onClick={() => onScrollToContact('contact-operations')}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-white text-brand-stone hover:bg-stone-50 rounded-full flex items-center justify-center shadow-xl cursor-pointer transition-colors border border-stone-200"
            style={{ boxShadow: '0 8px 20px -4px rgba(28, 25, 23, 0.2)' }}
            title={language === 'hi' ? 'कंपनी संपर्क जानकारी' : 'Direct Contact Info'}
          >
            <PhoneCall className="w-5.5 h-5.5 text-brand-stone animate-[pulse_2s_infinite]" />
          </motion.button>
        </div>
      </div>

      {/* COMPREHENSIVE FREE CONSULTATION MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-lg bg-zinc-950 text-white rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl p-6 md:p-8 m-auto"
            >
              {/* Close Button */}
              <button
                onClick={resetForm}
                className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-full hover:bg-zinc-800/80 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {!isSubmitted ? (
                /* CONSULTATION BOOKING FORM */
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-amber-500/10 rounded-xl">
                      <Calendar className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold uppercase tracking-tight">
                        {language === 'hi' ? 'विशेषज्ञ खेल परामर्श' : 'Elite Sports Consultation'}
                      </h3>
                      <p className="text-xs text-zinc-400">
                        {language === 'hi' ? 'इंदौर की सर्वश्रेष्ठ सिविल और सर्फ़ेसिंग टीम' : 'Book a structured project plan with our Indore engineers'}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-zinc-800 my-4"></div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                      {language === 'hi' ? 'पूरा नाम' : 'Full Name *'}
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                        <User className="w-4 h-4 text-zinc-500" />
                      </span>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className={`w-full bg-zinc-900 border ${formErrors.fullName ? 'border-red-500' : 'border-zinc-800'} rounded-xl p-3 pl-10 text-white text-sm outline-none focus:border-amber-500 transition-colors`}
                      />
                    </div>
                    {formErrors.fullName && <p className="text-red-500 text-[11px] mt-1 font-mono">{formErrors.fullName}</p>}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                      {language === 'hi' ? 'मोबाइल नंबर' : 'Phone Number *'}
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                        <Phone className="w-4 h-4 text-zinc-500" />
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98937 XXXXX"
                        className={`w-full bg-zinc-900 border ${formErrors.phone ? 'border-red-500' : 'border-zinc-800'} rounded-xl p-3 pl-10 text-white text-sm outline-none focus:border-amber-500 transition-colors`}
                      />
                    </div>
                    {formErrors.phone && <p className="text-red-500 text-[11px] mt-1 font-mono">{formErrors.phone}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                      {language === 'hi' ? 'ईमेल पता' : 'Email Address *'}
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                        <Mail className="w-4 h-4 text-zinc-500" />
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@organization.com"
                        className={`w-full bg-zinc-900 border ${formErrors.email ? 'border-red-500' : 'border-zinc-800'} rounded-xl p-3 pl-10 text-white text-sm outline-none focus:border-amber-500 transition-colors`}
                      />
                    </div>
                    {formErrors.email && <p className="text-red-500 text-[11px] mt-1 font-mono">{formErrors.email}</p>}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                      {language === 'hi' ? 'परियोजना स्थल / राज्य' : 'Project Location *'}
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                        <MapPin className="w-4 h-4 text-zinc-500" />
                      </span>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Indore, Madhya Pradesh"
                        className={`w-full bg-zinc-900 border ${formErrors.location ? 'border-red-500' : 'border-zinc-800'} rounded-xl p-3 pl-10 text-white text-sm outline-none focus:border-amber-500 transition-colors`}
                      />
                    </div>
                    {formErrors.location && <p className="text-red-500 text-[11px] mt-1 font-mono">{formErrors.location}</p>}
                  </div>

                  {/* Sport Type */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                      {language === 'hi' ? 'खेल प्रकार' : 'Target Sport Type'}
                    </label>
                    <select
                      name="sportType"
                      value={formData.sportType}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:border-amber-500 transition-colors"
                    >
                      {sportsOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Notes / Message */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                      {language === 'hi' ? 'अतिरिक्त आवश्यकता विवरण' : 'Project Notes / Dimensions'}
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="e.g. 50x30ft courtyard, concrete base present..."
                      rows={2}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:border-amber-500 transition-colors resize-none"
                    ></textarea>
                  </div>

                  {/* Submission Button */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-extrabold uppercase py-3.5 rounded-xl text-xs tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Send className="w-4 h-4 fill-current" />
                    {language === 'hi' ? 'फ्री प्रोजेक्ट प्लान आरक्षित करें' : 'Confirm Free Expert Design'}
                  </motion.button>
                </form>
              ) : (
                /* DELUXE PREMIUM SUCCESS CONTAINER */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6 space-y-6"
                >
                  <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/30">
                    <ShieldCheck className="w-9 h-9 text-amber-500" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-2xl font-black uppercase text-amber-500 tracking-tight">
                      {language === 'hi' ? 'परामर्श दर्ज हो गया !' : 'Consultation Secured !'}
                    </h4>
                    <p className="text-zinc-400 text-xs px-2 leading-relaxed">
                      {language === 'hi' 
                        ? 'आपका प्रोजेक्ट विनिर्देश सफलतापूर्वक कस्टमाइज़ कर लिया गया है।' 
                        : 'Your architectural sports infrastructure parameters have been locked with Earthfirm.'}
                    </p>
                  </div>

                  {/* Booking Details Ticket */}
                  <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-4 max-w-sm mx-auto text-left space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono border-b border-zinc-800 pb-2 mb-2 text-zinc-500">
                      <span>OFFICIAL BOOKING TICKET</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500 uppercase font-mono">ID:</span>
                      <span className="text-amber-500 font-bold font-mono">{bookingId}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500 uppercase font-mono">CLIENT:</span>
                      <span className="text-white font-medium">{formData.fullName}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500 uppercase font-mono">SPORT:</span>
                      <span className="text-white font-medium">{formData.sportType}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500 uppercase font-mono">OFFICE:</span>
                      <span className="text-white font-medium">INDORE HQ</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed font-mono mt-4">
                    {language === 'hi' 
                      ? `इंदौर के लीड डिज़ाइन इंजीनियर अगले 12 घंटे में ${formData.phone} पर कॉल करेंगे।` 
                      : `A senior civil sports manager from Indore HQ will contact your number (${formData.phone}) within 12 hours.`}
                  </p>

                  <div className="pt-2">
                    <motion.button
                      onClick={resetForm}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-6 py-2.5 bg-white text-black font-bold uppercase rounded-lg text-xs tracking-wider hover:bg-zinc-200 cursor-pointer transition-colors"
                    >
                      {language === 'hi' ? 'वापस जाएं' : 'Return to Site'}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
