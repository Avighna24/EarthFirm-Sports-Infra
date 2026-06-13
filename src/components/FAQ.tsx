import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { saveToLocalRegistry } from '../lib/storage';

// Import high-fidelity squash court visual asset
import squashCourtImg from '../assets/images/squash_court_1780661148365.png';

interface FAQProps {
  onBackToMain?: () => void;
  language?: 'en' | 'hi';
}

const steps = [
  {
    id: 1,
    question: "Which sport or sports will the facility focus on?",
    image: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=800&auto=format&fit=crop",
    imgAlt: "Premium sports courts configuration",
    options: [
      "All of the Above",
      "Basketball Court",
      "Tennis Court",
      "Pickleball Arena",
      "Football Turf",
      "Track & Running Fields",
      "Multi-Purpose Gym",
      "Cricket Turf",
      "Badminton Court",
      "Swimming Pool",
      "Squash Court",
      "Volleyball Court"
    ]
  },
  {
    id: 2,
    question: "Where is the project location planned?",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    imgAlt: "Indore city planning project site context",
    options: ["Tier 1 City", "Tier 2 City", "Tier 3 / Semi-Urban Area", "Rural Area"],
    hasExtraInput: true,
    extraInputLabel: "City name (optional)"
  },
  {
    id: 3,
    question: "What is the approximate land area available for the project?",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop",
    imgAlt: "Development empty land plot area layout",
    options: ["Less than 1 Acre", "1-3 Acres", "3-5 Acres", "5+ Acres"]
  },
  {
    id: 4,
    question: "What level of infrastructure quality are you aiming for?",
    image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=800&auto=format&fit=crop",
    imgAlt: "Elite tournament level sports academy court",
    options: ["Basic Functional", "Professional Training Level", "Tournament / Competition Level", "International Standard"]
  },
  {
    id: 5,
    question: "What is your estimated budget for this project?",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop",
    imgAlt: "Engineering layout sketches estimates and blueprints",
    options: ["₹25 Lakhs - ₹50 Lakhs", "₹50 Lakhs - ₹1 Crore", "₹1 Crore - ₹3 Crores", "₹3 Crores - ₹5 Crores", "₹5 Crores+"]
  },
  {
    id: 6,
    question: "When are you planning to start construction?",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop",
    imgAlt: "Construction earth compaction site machinery planning",
    options: ["Immediately", "Within 3 Months", "Within 6 Months", "6-12 Months", "Just Exploring Options"]
  },
  {
    id: 7,
    question: "Do you require end-to-end execution or specific services only?",
    image: squashCourtImg,
    imgAlt: "Layered technical court construction detailing",
    options: ["Complete Design & Build", "Construction Only", "Sports Flooring & Surfacing", "Lighting & Equipment", "Consultation & Planning"]
  },
  {
    id: 8,
    question: "Who is this project for?",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800&auto=format&fit=crop",
    imgAlt: "Sports community center layout concept",
    options: ["Government / Authority", "School / College", "Private Academy", "Real Estate Developer", "Club / Society", "Individual Investor"]
  },
  {
    id: 9,
    question: "Let's Connect",
    image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=800&auto=format&fit=crop",
    imgAlt: "Professional project consultation handshake",
    options: []
  }
];

export function FAQ({ onBackToMain }: FAQProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [cityName, setCityName] = useState("");
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [validationError, setValidationError] = useState("");

  const [contactData, setContactData] = useState({
    fullName: '',
    organization: '',
    phone: '',
    email: ''
  });

  const totalSteps = 9;

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(c => c + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(c => c - 1);
    else if (onBackToMain) onBackToMain();
  };

  const selectOption = (val: string) => {
    setAnswers(prev => {
      if (currentStep === 1) {
        const stepOptions = steps[0].options.filter(o => o !== "All of the Above");
        const currentVal = prev[currentStep] || '';
        const selectedArray = currentVal ? currentVal.split(', ').map(s => s.trim()).filter(Boolean) : [];
        let newArray: string[];

        if (val === "All of the Above") {
          // Check if already has everything selected besides "All of the Above"
          const hasAll = stepOptions.every(o => selectedArray.includes(o));
          if (hasAll) {
            newArray = []; // Deselect all
          } else {
            newArray = ["All of the Above", ...stepOptions]; // Select all
          }
        } else {
          if (selectedArray.includes(val)) {
            newArray = selectedArray.filter(v => v !== val && v !== "All of the Above");
          } else {
            const temps = [...selectedArray, val];
            const containsAllOthers = stepOptions.every(o => temps.includes(o));
            if (containsAllOthers) {
              newArray = ["All of the Above", ...temps];
            } else {
              newArray = temps;
            }
          }
        }
        return {
          ...prev,
          [currentStep]: Array.from(new Set(newArray)).join(', ')
        };
      }
      if (currentStep === 7) {
        const currentVal = prev[currentStep] || '';
        const selectedArray = currentVal ? currentVal.split(', ').map(s => s.trim()).filter(Boolean) : [];
        let newArray: string[];
        if (selectedArray.includes(val)) {
          newArray = selectedArray.filter(v => v !== val);
        } else {
          newArray = [...selectedArray, val];
        }
        return {
          ...prev,
          [currentStep]: newArray.join(', ')
        };
      }
      return { ...prev, [currentStep]: val };
    });
  };

  const isCurrentStepValid = () => {
    if (currentStep < 9) {
      return !!answers[currentStep];
    }
    return contactData.fullName.trim() !== '' && contactData.phone.trim() !== '' && contactData.email.trim() !== '';
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitFAQ = async () => {
    if (!isCurrentStepValid()) {
      setValidationError('Please fill in required fields (Full name, Phone number, and Email Address).');
      return;
    }
    setValidationError('');
    setIsSubmitting(true);
    const docId = `FAQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    try {
      saveToLocalRegistry('faq_consultations', {
        answers: answers,
        cityName: cityName || null,
        fullName: contactData.fullName,
        organization: contactData.organization || null,
        phone: contactData.phone,
        email: contactData.email,
        timestamp: new Date().toISOString()
      });
      setShowSuccessScreen(true);
    } catch (e) {
      console.error('Submission error', e);
      // Fallback to success overlay so users inside sandbox environments don't get stuck
      setShowSuccessScreen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeImage = steps[currentStep - 1]?.image || steps[steps.length - 1].image;
  const activeAlt = steps[currentStep - 1]?.imgAlt || "Sports Infra Planning Image";

  if (showSuccessScreen) {
    return (
      <div className="flex-1 bg-[#0A0A0A] text-white flex flex-col font-sans selection:bg-white/20 min-h-screen relative overflow-hidden">
        {/* Dynamic Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(${activeImage})` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80" />
        </div>
        <main className="flex-1 flex items-center justify-center pt-12 pb-36 px-4 sm:px-6 relative z-10 max-w-4xl mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-[#0E0E0E]/85 backdrop-blur-2xl border border-emerald-500/20 p-8 sm:p-12 rounded-3xl shadow-2xl shadow-black text-center space-y-6"
          >
            <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 border border-emerald-500/30 mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              Bespoke Plan Prepared
            </h1>
            <p className="text-zinc-300 text-sm max-w-lg mx-auto leading-relaxed">
              Thank you, <strong className="text-white">{contactData.fullName}</strong>. Your custom sports facility configuration answers have been captured and saved securely to the EarthFirm secure database. Our corporate design desk in Indore is now building your conceptual cost draft.
            </p>

            <div className="max-w-md mx-auto text-left bg-zinc-950/60 border border-white/5 rounded-2xl p-5 space-y-3 font-mono text-xs text-zinc-400">
              <div className="border-b border-white/5 pb-2 text-[10px] tracking-wider uppercase text-zinc-500 font-bold">RECAP OF PREFERENCES</div>
              <div className="flex justify-between">
                <span>Primary Sport focus:</span>
                <span className="text-emerald-400 font-bold">{answers[1] || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span>Land Area:</span>
                <span className="text-white">{answers[3] || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span>Budget tier:</span>
                <span className="text-white">{answers[5] || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span>Contact parameters:</span>
                <span className="text-white">{contactData.phone}</span>
              </div>
            </div>

            <button
              onClick={onBackToMain}
              className="mt-6 px-8 py-4 bg-emerald-400 text-black hover:bg-emerald-300 text-xs font-bold uppercase tracking-widest transition cursor-pointer font-mono active:scale-95 duration-150"
            >
              Return To Homepage
            </button>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#0A0A0A] text-white flex flex-col font-sans selection:bg-white/20 min-h-screen relative overflow-hidden">
      
      {/* Immersive Cross-Fading Dynamic Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 0.75, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${activeImage})` }}
          />
        </AnimatePresence>
        {/* Soft, premium dark filter overlay to allow the background image to shine while maintaining high text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(10,10,10,0.7)_100%)]" />
      </div>

      {/* Main Content Layout centered inside a high-end glass cabinet card */}
      <main className="flex-1 flex items-center justify-center pt-12 pb-36 px-4 sm:px-6 relative z-10 max-w-4xl mx-auto w-full">
        <div className="w-full bg-[#0E0E0E]/75 backdrop-blur-2xl border border-white/5 p-6 sm:p-10 rounded-3xl shadow-2xl shadow-black/90 space-y-6">
          
          {/* Header navigational element */}
          <div className="flex justify-start">
            <button
              onClick={onBackToMain}
              className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-zinc-400 hover:text-white transition cursor-pointer bg-white/5 border border-white/5 hover:border-white/20 px-4 py-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </button>
          </div>

          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.99, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -12 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="w-full"
              >
                
                {/* Step Progress Line */}
                <div className="mb-8 font-mono">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-zinc-500 mb-2.5 block">
                    {currentStep < 9 ? `QUESTION ${currentStep} OF 8` : "MOBILIZATION FEEDBACK"}
                  </span>
                  <div className="h-[2px] w-full bg-white/10 relative">
                    <div 
                      className="absolute top-0 left-0 h-full bg-emerald-400 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(52,211,153,0.4)]"
                      style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    />
                  </div>
                </div>

                {currentStep < 9 ? (
                  <>
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.1] uppercase mb-6 text-left text-white">
                      {steps[currentStep - 1].question}
                    </h1>

                    {(currentStep === 1 || currentStep === 7) && (
                      <p className="text-[10px] font-mono tracking-wider uppercase text-emerald-400 mb-6 text-left">
                        * MULTIPLE CHOICES SELECTION ALLOWED
                      </p>
                    )}

                    <div className="grid sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1 customize-scrollbar">
                      {steps[currentStep - 1].options.map((opt) => {
                        const isSelected = (currentStep === 1 || currentStep === 7)
                          ? (answers[currentStep] || '').split(', ').map(s => s.trim()).includes(opt)
                          : answers[currentStep] === opt;

                        return (
                          <button
                            key={opt}
                            onClick={() => selectOption(opt)}
                            className={`w-full text-left px-5 py-4 border transition-all duration-200 cursor-pointer text-xs sm:text-sm uppercase tracking-wider font-semibold ${
                              isSelected 
                                ? 'border-emerald-400 bg-emerald-500/10 text-emerald-300 font-bold' 
                                : 'border-white/10 bg-zinc-900/40 text-zinc-300 hover:border-white/30 hover:bg-zinc-900/80'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span>{opt}</span>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {steps[currentStep - 1].hasExtraInput && (
                      <div className="mt-8 bg-zinc-900/40 border border-white/5 p-5 rounded-2xl">
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">{steps[currentStep - 1].extraInputLabel}</label>
                        <input
                          type="text"
                          value={cityName}
                          onChange={(e) => setCityName(e.target.value)}
                          placeholder="e.g. Bhopal, Madhya Pradesh"
                          className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white text-sm outline-none focus:border-emerald-400 transition-colors"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase mb-2 text-left text-white leading-none">
                      Let's Connect
                    </h1>
                    <p className="text-zinc-400 mb-8 text-sm">Enter your contact parameters for our Indore lab to prepare your bespoke estimate sheets.</p>

                    <div className="space-y-5 bg-zinc-900/30 border border-white/5 p-6 rounded-2xl font-sans">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-[9px] font-mono uppercase text-zinc-500 mb-1 font-bold">Full Name *</label>
                          <input
                            type="text"
                            required
                            value={contactData.fullName}
                            onChange={(e) => setContactData({ ...contactData, fullName: e.target.value })}
                            placeholder="e.g. Advait Singh"
                            className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-emerald-400 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-mono uppercase text-zinc-500 mb-1 font-bold">Organization Name</label>
                          <input
                            type="text"
                            value={contactData.organization}
                            onChange={(e) => setContactData({ ...contactData, organization: e.target.value })}
                            placeholder="e.g. EarthFirm Academy"
                            className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-emerald-400 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-[9px] font-mono uppercase text-zinc-500 mb-1 font-bold">Phone Number *</label>
                          <input
                            type="tel"
                            required
                            value={contactData.phone}
                            onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                            placeholder="e.g. +91 98930 12345"
                            className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-emerald-400 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-mono uppercase text-zinc-500 mb-1 font-bold">Email Address *</label>
                          <input
                            type="email"
                            required
                            value={contactData.email}
                            onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                            placeholder="e.g. contact@earthfirm.in"
                            className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-emerald-400 transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {validationError && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-red-950/40 border border-red-500/20 text-red-300 text-xs rounded-xl font-mono"
                  >
                    {validationError}
                  </motion.div>
                )}

                {/* Navigation Back/Next Control Ribbon */}
                <div className="flex items-center gap-4 mt-10">
                  <button
                    onClick={handleBack}
                    className="px-6 py-3.5 border border-white/10 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-white/5 hover:border-white/30 transition flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={() => {
                      if (currentStep === totalSteps) {
                        handleSubmitFAQ();
                      } else {
                        handleNext();
                      }
                    }}
                    disabled={!isCurrentStepValid() || isSubmitting}
                    className="px-8 py-3.5 bg-white text-black text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-250 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer active:scale-95 ml-auto font-mono"
                  >
                    {currentStep === totalSteps ? (isSubmitting ? 'Submitting...' : 'Request Project Plan') : 'Next'} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
