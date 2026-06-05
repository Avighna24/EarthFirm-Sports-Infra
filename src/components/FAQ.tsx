import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { saveDocument } from '../firebase';

interface FAQProps {
  onBackToMain?: () => void;
  language?: 'en' | 'hi';
}

const steps = [
  {
    id: 1,
    question: "Which sport or sports will the facility focus on?",
    options: [
      "Basketball Court",
      "Tennis Court",
      "Pickleball Arena",
      "Football Turf",
      "Track & Running Fields",
      "Multi-Purpose Gym",
      "Box Cricket",
      "Badminton Court",
      "Swimming Pool",
      "Squash Court",
      "Volleyball Court"
    ]
  },
  {
    id: 2,
    question: "Where is the project location planned?",
    options: ["Tier 1 City", "Tier 2 City", "Tier 3 / Semi-Urban Area", "Rural Area"],
    hasExtraInput: true,
    extraInputLabel: "City name (optional)"
  },
  {
    id: 3,
    question: "What is the approximate land area available for the project?",
    options: ["Less than 1 Acre", "1-3 Acres", "3-5 Acres", "5+ Acres"]
  },
  {
    id: 4,
    question: "What level of infrastructure quality are you aiming for?",
    options: ["Basic Functional", "Professional Training Level", "Tournament / Competition Level", "International Standard"]
  },
  {
    id: 5,
    question: "What is your estimated budget for this project?",
    options: ["₹25 Lakhs - ₹50 Lakhs", "₹50 Lakhs - ₹1 Crore", "₹1 Crore - ₹3 Crores", "₹3 Crores - ₹5 Crores", "₹5 Crores+"]
  },
  {
    id: 6,
    question: "When are you planning to start construction?",
    options: ["Immediately", "Within 3 Months", "Within 6 Months", "6-12 Months", "Just Exploring Options"]
  },
  {
    id: 7,
    question: "Do you require end-to-end execution or specific services only?",
    options: ["Complete Design & Build", "Construction Only", "Sports Flooring & Surfacing", "Lighting & Equipment", "Consultation & Planning"]
  },
  {
    id: 8,
    question: "Who is this project for?",
    options: ["Government / Authority", "School / College", "Private Academy", "Real Estate Developer", "Club / Society", "Individual Investor"]
  }
];

export function FAQ({ onBackToMain }: FAQProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [cityName, setCityName] = useState("");

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
      if (currentStep === 1 || currentStep === 7) {
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
      alert('Please fill in required fields.');
      return;
    }
    setIsSubmitting(true);
    const docId = `FAQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    try {
      await saveDocument('faq_consultations', docId, {
        answers: answers,
        cityName: cityName || null,
        fullName: contactData.fullName,
        organization: contactData.organization || null,
        phone: contactData.phone,
        email: contactData.email
      });
      alert('Thank you! Project Plan request submitted successfully.');
      if (onBackToMain) onBackToMain();
    } catch (e) {
      console.error('Submission error', e);
      alert('Submission complete!');
      if (onBackToMain) onBackToMain();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-[#0A0A0A] text-white flex flex-col font-sans selection:bg-white/20">
      
      {/* Main Form Content */}
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 relative z-10">
        
        {/* Subtle background element */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-end overflow-hidden opacity-10">
          <div className="w-[80vw] h-[80vw] rounded-full border-[100px] border-white/10 -translate-y-1/4 translate-x-1/4"></div>
        </div>

        <div className="w-full max-w-2xl relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              
              {/* Progress Line */}
              <div className="mb-8">
                <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-zinc-500 mb-3 block text-left">
                  {currentStep < 9 ? `Step ${currentStep} of 9` : ""}
                </span>
                <div className="h-[2px] w-full bg-white/10 relative">
                  <div 
                    className="absolute top-0 left-0 h-full bg-white transition-all duration-500 ease-out"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  />
                </div>
              </div>

              {currentStep < 9 ? (
                <>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight uppercase mb-4 text-left">
                    {steps[currentStep - 1].question}
                  </h1>

                  {(currentStep === 1 || currentStep === 7) && (
                    <p className="text-[11px] font-mono tracking-wider uppercase text-zinc-500 mb-6 text-left">
                      * Multiple choices allowed (Select all that apply)
                    </p>
                  )}

                  <div className="space-y-3">
                    {steps[currentStep - 1].options.map((opt) => {
                      const isSelected = (currentStep === 1 || currentStep === 7)
                        ? (answers[currentStep] || '').split(', ').map(s => s.trim()).includes(opt)
                        : answers[currentStep] === opt;

                      return (
                        <button
                          key={opt}
                          onClick={() => selectOption(opt)}
                          className={`w-full text-left px-5 py-4 border transition-colors cursor-pointer text-sm sm:text-base ${
                            isSelected 
                              ? 'border-white bg-white/5 text-white font-medium' 
                              : 'border-white/10 text-zinc-300 hover:border-white/40 hover:bg-white/5'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {steps[currentStep - 1].hasExtraInput && (
                    <div className="mt-8">
                      <label className="block text-sm text-zinc-500 mb-2">{steps[currentStep - 1].extraInputLabel}</label>
                      <input
                        type="text"
                        value={cityName}
                        onChange={(e) => setCityName(e.target.value)}
                        className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white outline-none focus:border-white transition-colors"
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase mb-2 text-left">
                    Let's Connect
                  </h1>
                  <p className="text-zinc-400 mb-10 text-sm">Enter your details for a detailed project consultation.</p>

                  <div className="space-y-6">
                    <div>
                      <input
                        type="text"
                        placeholder="Full Name *"
                        required
                        value={contactData.fullName}
                        onChange={(e) => setContactData({ ...contactData, fullName: e.target.value })}
                        className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white text-sm outline-none focus:border-white transition-colors placeholder:text-zinc-600"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Organization Name"
                        value={contactData.organization}
                        onChange={(e) => setContactData({ ...contactData, organization: e.target.value })}
                        className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white text-sm outline-none focus:border-white transition-colors placeholder:text-zinc-600"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="Phone Number *"
                        required
                        value={contactData.phone}
                        onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                        className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white text-sm outline-none focus:border-white transition-colors placeholder:text-zinc-600"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Email Address *"
                        required
                        value={contactData.email}
                        onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                        className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white text-sm outline-none focus:border-white transition-colors placeholder:text-zinc-600"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Navigation Footer */}
              <div className="flex items-center gap-4 mt-12 bg-transparent">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 border border-white/20 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 transition flex items-center gap-2 cursor-pointer"
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
                  className="px-6 py-3 bg-white text-black text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                >
                  {currentStep === totalSteps ? (isSubmitting ? 'Submitting...' : 'Get My Project Plan') : 'Next'} <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </main>

    </div>
  );
}
