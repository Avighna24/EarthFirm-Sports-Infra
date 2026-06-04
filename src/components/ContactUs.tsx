import { Phone, Mail, MapPin, Clock, Globe } from 'lucide-react';

export function ContactUs() {
  return (
    <section className="bg-black py-16 text-white border-b border-white/10" id="contact-operations">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-[0.2em] text-brand-sage font-mono font-bold block mb-2">OPERATIONAL INTEGRITY</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-white mb-4">Contact Our Corporate Office</h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              Connect directly with our headquarters and production unit in Indore. We welcome on-site consultation, civil blueprints review, and physical material inspections.
            </p>
          </div>
          <div className="shrink-0 self-start">
            <img src="./Logo.png" alt="Earthfirm Sports Infra" className="h-[174px] w-auto object-contain grayscale opacity-80 mix-blend-screen" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left direct contact column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-sm space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-neutral-500 font-bold block mb-2">DIRECT COMMUNICATION</span>
                <h3 className="text-lg font-serif font-bold text-white">Earthfirm Support Desk</h3>
                <p className="text-neutral-400 text-xs leading-normal mt-1">
                  Contact our central design office for instant estimates, site feasibility inspections and heavy civil foundation blueprints.
                </p>
              </div>

              <div className="space-y-4">
                {/* Telephone Card */}
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-neutral-800 text-brand-sage mt-0.5 shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-500 block font-bold">Hotline Support Desk</span>
                    <div className="flex flex-col gap-1">
                      <a href="tel:+919893777095" className="text-sm font-mono font-bold text-white hover:text-brand-sage transition block">
                        +91 98937 77095
                      </a>
                      <a href="tel:+919893777092" className="text-sm font-mono font-bold text-white hover:text-brand-sage transition block">
                        +91 98937 77092
                      </a>
                    </div>
                  </div>
                </div>

                {/* Mail Card */}
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-neutral-800 text-brand-sage mt-0.5 shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-500 block font-bold">RFP proposals &amp; Corporate Email</span>
                    <a href="mailto:sportsinfraearthfirm@gmail.com" className="text-sm font-mono font-bold text-white hover:text-brand-sage transition block break-all">
                      sportsinfraearthfirm@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Direct Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href="mailto:sportsinfraearthfirm@gmail.com"
                  className="flex-1 py-3 px-4 rounded-xl bg-brand-sage hover:bg-brand-sage-dark text-white text-xs font-bold font-mono tracking-wider text-center uppercase transition shadow-sm"
                >
                  Email RFP Documents
                </a>
                <a
                  href="tel:+919893777095"
                  className="flex-1 py-3 px-4 rounded-xl border border-neutral-700 hover:bg-neutral-800 text-white text-xs font-bold font-mono tracking-wider text-center uppercase transition bg-neutral-900"
                >
                  Speak to Engineer
                </a>
              </div>

            </div>

          </div>

          {/* Right operational regions panel (7 cols) */}
          <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
            
            <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
              <span className="text-xs font-mono font-bold uppercase text-neutral-500 tracking-wider">Indore Corporate Office</span>
              <span className="text-[10px] bg-brand-sage/20 text-brand-sage font-bold font-mono px-2 py-1 rounded">Headquarters Office</span>
            </div>

            {/* Hub Detail Showcase */}
            <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-5 sm:p-6 space-y-6">
              
              {/* Hub title & active status indicator */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
                <div>
                  <h4 className="text-lg font-serif font-bold text-white">
                    Central Corporate Office &amp; Facility
                  </h4>
                  <span className="text-xs text-neutral-400 font-mono mt-0.5 block">
                    Sector B, Indore — Corporate Management, Design Lab &amp; Production Dispatch
                  </span>
                </div>
                <div>
                  {/* Active dynamic state badge */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-900/30 text-emerald-400 border border-emerald-900/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Open &amp; Operational
                  </span>
                </div>
              </div>

              {/* Info block: Address & Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs leading-normal">
                
                {/* Address */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-neutral-500 font-bold uppercase tracking-wider block">Physical Address</span>
                  <a 
                    href="https://maps.google.com/?q=Sector+B,+Sanwer+Road+Industrial+Area,+Indore,+Madhya+Pradesh+452015"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-2 group cursor-pointer"
                  >
                    <MapPin className="h-4 w-4 text-brand-sage shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <p className="text-neutral-300 font-medium group-hover:text-brand-sage transition-colors">
                      Sector B, Sanwer Road Industrial Area, Indore, Madhya Pradesh 452015
                    </p>
                  </a>
                </div>

                {/* Hours */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-neutral-500 font-bold uppercase tracking-wider block">Operational Timetable</span>
                  <div className="flex gap-2">
                    <Clock className="h-4 w-4 text-brand-sage shrink-0 mt-0.5" />
                    <div className="space-y-1 text-neutral-300 font-medium">
                      <p className="flex justify-between gap-4"><span>Mon &ndash; Sat:</span> <span className="font-mono text-[11px] font-bold">08:00 AM &ndash; 08:00 PM</span></p>
                      <p className="flex justify-between gap-4"><span>Sunday:</span> <span className="text-red-400 font-bold">Closed (Dispatch Only)</span></p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
