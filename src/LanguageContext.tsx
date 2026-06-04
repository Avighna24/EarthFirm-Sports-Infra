import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    'nav.customizer': 'Interactive Customizer',
    'nav.materials': 'Material Specs',
    'nav.rfp': 'Request RFP Quote',
    'nav.contact': 'Contact Us',
    'nav.buildNow': 'Build Now',

    // Hero Section
    'hero.badge': 'Master Sports Infrastructure',
    'hero.title': 'Bespoke Athletic Courts of Meticulous Engineering',
    'hero.subtitle': 'Earthfirm engineered civil play surfaces, tournament-grade Canadian Maple systems, ITF cushion acrylic, and FIFA turf arenas. Built from the soil up in Indore, dispatched PAN India.',
    'hero.start': 'Begin Configuration',
    'hero.view': 'Explore Materials',
    'hero.showcase': 'Architectural Showcases',
    'hero.showcaseSub': 'Click a design model to load preset configurations directly into the interactive visualizer.',

    // Testimonials Section
    'test.badge': 'CLIENT TRUST & VALIDATION',
    'test.title': 'Constructed for Champions, Certified by Authorities',
    'test.subtitle': 'Read direct feedback from school athletic directors, tournament-grade clubs, and residential community boards across India who chose Earthfirm\'s meticulous engineering.',
    'test.verified': 'verified contractor',
    'test.certified': 'Certified compliance: All courts built to strictly exceed governing sports board dimensional specifications (ITF, FIBA, FIFA, BCCI).',

    // Timeline Tracker Section
    'timeline.title': 'Project Mobilization Timeline',
    'timeline.badge': 'Dynamic Timeline',
    'timeline.duration': 'Planned Assembly duration',
    'timeline.alert_title': 'Slab Preparation Notice',

    // Interactive Builder Section
    'build.title': 'Customize Court Architecture',
    'build.subtitle': 'Interact with real-time sports layout modeling, select BWF/ITF surfaces, configure floor grids, and estimate high-strength subbases with instant structural costs.',
    'build.sport': 'Select Sport Type',
    'build.dimensions': 'Adjust Playground Dimensions',
    'build.material': 'Select Surface Performance Material',
    'build.color': 'Surface Aesthetic Colors Switch',
    'build.subbase': 'Base Engineering & Foundations',
    'build.smart': 'Configure Integrated Smart Add-ons',
    'build.pricingTitle': 'Live Financial Quote',
    'build.submitRfp': 'Configure & Submit RFP Sheet below',

    // Contact RFP Section
    'rfp.badge': 'INTERACTIVE INQUIRY PROCESS',
    'rfp.title': 'Initiate Earthfirm RFP Request',
    'rfp.subtitle': 'Configure your specialized sports setup above, modify options, and submit this brief sheet. Our engineering team in Indore will contact you within 12 hours with structural designs.',
    'rfp.subbaseType': 'Subbase Type',
    'rfp.sport': 'Selected Sport',
    'rfp.surface': 'Performance Surface',
    'rfp.features': 'Smart Add-ons',
    'rfp.contactHeader': 'Commercial Procurement Information',
    'rfp.fullName': 'Full Name',
    'rfp.email': 'Corporate Email Address',
    'rfp.phone': 'Active Indian Mobile Number',
    'rfp.state': 'Project State / Location in India',
    'rfp.submitting': 'Consulting Engineering Dispatch...',
    'rfp.submit': 'Submit RFP & Project Parameters',
    'rfp.successTitle': 'RFP Specifications Lodged Successfully!',
    'rfp.successDesc': 'Your dynamic court design configurations and contact details have been registered into Earthfirm systems. An Indore design engineer will call you soon.'
  },
  hi: {
    // Navbar
    'nav.customizer': 'कस्टम कोर्ट डिज़ाइनर',
    'nav.materials': 'मटीरियल स्पेक्स',
    'nav.rfp': 'RFP कोट प्रस्ताव',
    'nav.contact': 'संपर्क करें',
    'nav.buildNow': 'अभी बनाएं',

    // Hero Section
    'hero.badge': 'सर्वश्रेष्ठ खेल बुनियादी ढांचा',
    'hero.title': 'सटीक इंजीनियरिंग से निर्मित विशेष स्पोर्ट्स कोर्ट',
    'hero.subtitle': 'अर्थफर्म द्वारा निर्मित सिविल खेल मैदान, टूर्नामेंट-स्तर के कनाडाई मेपल सिस्टम, ITF कुशन एक्रिलिक और FIFA टर्फ एरिना। इंदौर से निर्मित, पूरे भारत में वितरित।',
    'hero.start': 'डिज़ाइन शुरू करें',
    'hero.view': 'सामग्री देखें',
    'hero.showcase': 'वास्तुकला शोकेस',
    'hero.showcaseSub': 'सीधे विज़ुअलाइज़र में प्रीसेट कॉन्फ़िगरेशन लोड करने के लिए किसी डिज़ाइन मॉडल पर क्लिक करें।',

    // Testimonials Section
    'test.badge': 'ग्राहक विश्वास और सत्यापन',
    'test.title': 'चैंपियंस के लिए निर्मित, अधिकारियों द्वारा प्रमाणित',
    'test.subtitle': 'स्कूल खेल निदेशकों, टूर्नामेंट-स्तर के क्लबों और आवासीय समितियों की सीधी समीक्षा पढ़ें जिन्होंने अर्थफर्म की सूक्ष्म इंजीनियरिंग को चुना।',
    'test.verified': 'प्रमाणित ठेकेदार',
    'test.certified': 'प्रमाणित अनुपालन: सभी न्यायालय सभी शासी खेल बोर्डों (ITF, FIBA, FIFA, BCCI) के विनिर्देशों से अधिक की गुणवत्ता पर निर्मित होते हैं।',

    // Timeline Tracker Section
    'timeline.title': 'परियोजना प्रेरण समयरेखा',
    'timeline.badge': 'डायनामिक समयरेखा',
    'timeline.duration': 'नियोजित असेंबली अवधि',
    'timeline.alert_title': 'स्लैब तैयारी सूचना',

    // Interactive Builder Section
    'build.title': 'खेल मैदान आर्किटेक्चर कस्टमाइज़ करें',
    'build.subtitle': 'वास्तविक समय में स्पोर्ट्स लेआउट मॉडलिंग के साथ खेलें, BWF/ITF सतहों का चयन करें, फ्लोर ग्रिड को कॉन्फ़िगर करें और तात्कालिक संरचनात्मक लागतों का अनुमान लगाएं।',
    'build.sport': 'स्पोर्ट प्रकार चुनें',
    'build.dimensions': 'खेल का मैदान आयाम समायोजित करें',
    'build.material': 'सतह प्रदर्शन सामग्री चुनें',
    'build.color': 'सतह सौंदर्य रंग स्विच',
    'build.subbase': 'बेस इंजीनियरिंग और नींव',
    'build.smart': 'एकीकृत स्मार्ट ऐड-ऑन कॉन्फ़िगर करें',
    'build.pricingTitle': 'लाइव वित्तीय उद्धरण',
    'build.submitRfp': 'नीचे दिए गए फ़ॉर्म में RFP शीट सबमिट करें',

    // Contact RFP Section
    'rfp.badge': 'इंटरैक्टिव पूछताछ प्रक्रिया',
    'rfp.title': 'अर्थफर्म RFP अनुरोध आरंभ करें',
    'rfp.subtitle': 'ऊपर अपने विशेष स्पोर्ट्स सेटअप को कस्टमाइज़ करें, विकल्पों को संशोधित करें और इस फॉर्म को जमा करें। इंदौर में हमारी इंजीनियरिंग टीम 12 घंटे के भीतर आपसे संपर्क करेगी।',
    'rfp.subbaseType': 'सबबेस प्रकार',
    'rfp.sport': 'चयनित खेल',
    'rfp.surface': 'प्रदर्शन सतह',
    'rfp.features': 'स्मार्ट ऐड-ऑन',
    'rfp.contactHeader': 'वाणिज्यिक खरीद सूचना',
    'rfp.fullName': 'पूरा नाम',
    'rfp.email': 'कॉर्पोरेट ईमेल पता',
    'rfp.phone': 'सक्रिय मोबाइल नंबर',
    'rfp.state': 'परियोजना राज्य और स्थान',
    'rfp.submitting': 'इंजीनियरिंग प्रेषण सलाह...',
    'rfp.submit': 'RFP और प्रोजेक्ट पैरामीटर जमा करें',
    'rfp.successTitle': 'RFP विनिर्देश सफलतापूर्वक दर्ज किए गए!',
    'rfp.successDesc': 'आपकी गतिशील कोर्ट डिज़ाइन कॉन्फ़िगरेशन और संपर्क विवरण अर्थफर्म सिस्टम में पंजीकृत कर दिए गए हैं। एक इंदौर डिज़ाइन इंजीनियर जल्द ही आपको कॉल करेगा।'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
