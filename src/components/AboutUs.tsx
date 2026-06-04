import { MapPin, Globe } from 'lucide-react';

export function AboutUs() {
  return (
    <section className="bg-white py-24 border-b border-stone-200" id="about-us">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-brand-sage font-mono font-bold block mb-3">
            Our Story
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-brand-stone mb-6">
            About EarthFirm Sports Infra
          </h2>
        </div>

        <div className="prose prose-stone max-w-none text-stone-600 space-y-6">
          <p className="text-lg leading-relaxed">
            At EarthFirm Sports Infra, we believe that every great game begins with a great foundation. As a leading sports infrastructure company based in Indore, Madhya Pradesh, we specialize in designing, developing, and delivering world-class sports facilities that inspire performance, promote active lifestyles, and create lasting value.
          </p>
          <p className="text-lg leading-relaxed">
            Our expertise covers the complete spectrum of sports infrastructure development, including stadium construction, sports complexes, tennis courts, basketball courts, badminton courts, pickleball courts, swimming pools, synthetic turf installations, athletic tracks, and customized sports facilities. From concept and planning to execution and finishing, we provide end-to-end solutions tailored to the unique needs of each project.
          </p>
          <p className="text-lg leading-relaxed">
            We proudly work with schools, colleges, sports academies, clubs, residential communities, government bodies, and private developers across India. Every project we undertake is built with precision engineering, premium materials, and a strong commitment to quality, durability, safety, and timely delivery.
          </p>
          <p className="text-lg leading-relaxed">
            With a vision to elevate India's sporting landscape, we are dedicated to creating infrastructure that empowers athletes, supports communities, and nurtures the next generation of champions. Whether it's a local training facility or a large-scale sports complex, our goal remains the same — to build spaces where sports thrive and dreams take shape.
          </p>

          <div className="grid md:grid-cols-2 gap-8 my-16">
            <div className="bg-stone-50 p-10 rounded-3xl border border-stone-100 shadow-sm relative overflow-hidden group hover:border-brand-sage/30 transition-colors">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Globe className="w-32 h-32" />
              </div>
              <h3 className="text-2xl font-bold font-serif mb-4 text-brand-sage relative z-10">Our Mission</h3>
              <p className="text-stone-600 leading-relaxed relative z-10">
                To deliver innovative, durable, and high-performance sports infrastructure that enables athletes, institutions, and communities to experience world-class sporting environments while maintaining the highest standards of quality, safety, and reliability.
              </p>
            </div>
            <div className="bg-stone-50 p-10 rounded-3xl border border-stone-100 shadow-sm relative overflow-hidden group hover:border-brand-sage/30 transition-colors">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Globe className="w-32 h-32" />
              </div>
              <h3 className="text-2xl font-bold font-serif mb-4 text-brand-sage relative z-10">Our Vision</h3>
              <p className="text-stone-600 leading-relaxed relative z-10">
                To become India's most trusted sports infrastructure company by transforming spaces into iconic sporting destinations and contributing to the growth of sports culture across the nation.
              </p>
            </div>
          </div>

          <div className="text-center mt-16 bg-neutral-900 text-white p-10 sm:p-12 rounded-3xl shadow-xl">
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
          </div>

        </div>
      </div>
    </section>
  );
}
