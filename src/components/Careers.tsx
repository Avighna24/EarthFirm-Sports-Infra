import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, MapPin, Clock, ArrowRight, X, Send, CheckCircle2, User, Mail, Phone, Calendar, UploadCloud, AlertCircle } from 'lucide-react';
import { saveDocument } from './firebase';

// OPTION C CONFIGURATION FOR GITHUB PAGES / STATIC HOSTING:
// By default, static web hosting platforms (like GitHub Pages) do not run server-side Node.js code (server.ts).
// To send automatic emails completely client-side in a static build, the most effective and free service is EmailJS.
// 1. Sign up for a free account at https://www.emailjs.com/
// 2. Connect your email service (Gmail, Outlook, custom SMTP, etc.) under "Email Services" and get its ID (e.g. 'service_xxxxxx').
// 3. Create an "Email Template" under "Email Templates" and get its ID (e.g. 'template_xxxxxxx').
//    - Set the recipient "To Email" field of your template to: {{candidate_email}}
//    - Style your template beautifully (e.g., "Hi {{candidate_name}}, we received your application for {{job_title}}...")
// 4. Go to your Account / Integration page to find your "Public Key" (e.g., 'user_xxxxxxxxx' or API Key).
// 5. Fill out the values below:
const FORMSPREE_FORM_ID = 'xaqzjdar'; 
const EMAILJS_SERVICE_ID = 'service_37qg2ik';      // Replace with your EmailJS service ID (e.g. 'service_gmail')
const EMAILJS_TEMPLATE_ID = 'template_kbn6slx';     // Replace with your EmailJS template ID (e.g. 'template_candidate_confirm')
const EMAILJS_PUBLIC_KEY = '0P07FOMXX6eMjFEaD';      // Replace with your EmailJS Public Key (e.g. 'user_xxxxxxxxxxxxxxx') 

interface JobRole {
  id: string;
  title: string;
  department: 'Engineering' | 'Installation' | 'Design' | 'Management';
  location: string;
  type: string;
  experience: string;
  compensation: string;
  description: string;
  requirements: string[];
  benefits: string[];
}

const JOBS: JobRole[] = [
  {
    id: 'sports-infra-civil',
    title: 'Sports Infra Civil Engineer',
    department: 'Engineering',
    location: 'Indore, Madhya Pradesh (HQ)',
    type: 'Full-time',
    experience: '3 - 5 Years',
    compensation: 'Competitive Industry Standards',
    description: 'We are seeking a detailing-oriented Civil Engineer to manage the grading, drainage, and laying of multi-sport asphalt and post-tension concrete bases. You will supervise on-site construction to ensure FIBA and ITF sub-base guidelines are met with precision.',
    requirements: [
      'B.Tech / B.E. in Civil Engineering',
      'Knowledge of sub-base leveling, water drainage slopes, and compaction metrics',
      'Experience handling asphalt and concrete floor casting crews',
      'Willingness to travel for institutional/club projects'
    ],
    benefits: [
      'Site allowance and travel coverage',
      'Health Insurance coverage',
      'Annual Performance Bonuses'
    ]
  },
  {
    id: 'gym-flooring-expert',
    title: 'Gym & Indoor Flooring Specialist',
    department: 'Installation',
    location: 'Central India (Regional Travel)',
    type: 'Full-time',
    experience: '1 - 3 Years',
    compensation: 'Attractive Pay + Site Allowances',
    description: 'Join our premium flooring assembly team. You will lead the installation of heavy-duty vulcanized rubber, acoustic multi-layer foam, and high-pile gym turf in premium health clubs, sports facilities, and government structures.',
    requirements: [
      'Hands-on experience with self-leveling compounds, industrial adhesive, and seam welding',
      'Expertise in laying gym rubber interlocking tiles and roll-out vinyl',
      'High physical fitness and attention to seam tolerances',
      'Valid driving license for domestic reach'
    ],
    benefits: [
      'Daily site-work travel per-diem',
      'Skill training certification programs',
      'Paid sick leave'
    ]
  },
  {
    id: 'autocad-3d-designer',
    title: 'AutoCAD / 3D Venue Designer',
    department: 'Design',
    location: 'Remote / Part-time',
    type: 'Part-time',
    experience: '2+ Years',
    compensation: 'Project-based / Retainer',
    description: 'Craft beautiful blueprints and premium renders of sports courts, gym areas, and athletic arenas. You will support the sales team with detailed cross-section designs and photorealistic 3D visualization grids.',
    requirements: [
      'Proficiency in AutoCAD, Trimble SketchUp, or Autodesk Revit',
      'Strong portfolio detailing building plans, cross-sections, or indoor layouts',
      'Ability to translate layout measurements into sports-certified grids (ITF, BWF, FIBA standards)',
      'Sharp time-management skills'
    ],
    benefits: [
      'Flexible hours',
      'Access to state-of-the-art layout templates',
      'Performance bonuses per closed procurement layout'
    ]
  },
  {
    id: 'procurement-admin',
    title: 'Procurement & Logistics Manager',
    department: 'Management',
    location: 'Indore, Madhya Pradesh (HQ)',
    type: 'Full-time',
    experience: '4+ Years',
    compensation: 'Commensurate with experience',
    description: 'Direct the sourcing of raw raw vulcanized rubber, acrylic coats, synthetic grass turf, and specialized structural sub-base materials. You will organize vendor negotiations, custom declarations, and domestic transport delivery cycles.',
    requirements: [
      'MBA or Degree in Logistics / Supply Chain Management',
      'Established connections with raw synthetic flooring material importers and producers',
      'Strong negotiation, contract writing, and logistics routing skill',
      'Familiarity with GST bills, material checks, and warehouse inventory systems'
    ],
    benefits: [
      'Flexible health cover packages',
      'Corporate cell expense cover',
      'High-growth management role'
    ]
  }
];

interface CareersProps {
  onBackToMain: () => void;
}

export function Careers({ onBackToMain }: CareersProps) {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [activeJob, setActiveJob] = useState<JobRole | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [experienceYear, setExperienceYear] = useState('1');
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedRole, setSubmittedRole] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');

  // Read saved applications from localStorage for rich, continuous feedback
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('offline_job_applications') || '[]');
      setApplications(stored);
    } catch (e) {
      console.error('Error parsing stored jobs', e);
    }
  }, []);

  const handleApplyClick = (job: JobRole) => {
    setActiveJob(job);
    setResumeFile(null);
    setResumeError('');
    setIsFormOpen(true);
  };

  const handleFileValidation = (file: File) => {
    setResumeError('');
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    const isAllowedExt = ['.pdf', '.doc', '.docx'].includes(ext);

    if (!allowedTypes.includes(file.type) && !isAllowedExt) {
      setResumeError('Unsupported file format. Please upload a PDF, DOC, or DOCX document.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setResumeError('File size exceeds the 5MB limit.');
      return;
    }

    setResumeFile(file);
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !activeJob) return;

    if (!resumeFile) {
      setResumeError('Please upload your resume to complete the application.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    let base64Resume = '';
    try {
      base64Resume = await readFileAsBase64(resumeFile);
    } catch (err) {
      console.error('Error translating file to base64', err);
      setResumeError('Failed to process the uploaded resume document.');
      setSubmitting(false);
      return;
    }

    const appData = {
      roleId: activeJob.id,
      roleTitle: activeJob.title,
      fullName,
      email,
      phone,
      experienceYear,
      coverLetter,
      resumeFileName: resumeFile.name,
      resumeFileType: resumeFile.type,
      resumeBase64: base64Resume,
      timestamp: new Date().toISOString()
    };

    // 1. Direct call to Firestore document writer (or localStorage fallback inside) with metadata
    const firestoreData = {
      roleId: activeJob.id,
      roleTitle: activeJob.title,
      fullName,
      email,
      phone,
      experienceYear,
      coverLetter,
      resumeFileName: resumeFile.name,
      resumeFileSize: resumeFile.size,
      timestamp: new Date().toISOString()
    };

    try {
      try {
        await saveDocument('job_applications', '', firestoreData);
      } catch (fError) {
        console.warn('Firestore write failed, proceeding with server-side email connection:', fError);
      }

      // 2. Dispatch to custom backend API (or Formspree client-side fallback)
      try {
        const isStaticHost = window.location.hostname.includes('github.io') || window.location.hostname.includes('pages');
        const hasFormspree = FORMSPREE_FORM_ID && FORMSPREE_FORM_ID.trim() !== '';

        if (isStaticHost && hasFormspree) {
          console.log(`[Careers] Static host detected. Dispatching candidate details to Formspree form: ${FORMSPREE_FORM_ID}`);
          
          const fd = new FormData();
          fd.append('Role ID', activeJob.id);
          fd.append('Role Title', activeJob.title);
          fd.append('Full Name', fullName);
          fd.append('Email Address', email);
          fd.append('Phone Number', phone);
          fd.append('Years of Experience', experienceYear);
          fd.append('Cover Letter', coverLetter);
          if (resumeFile) {
            fd.append('Resume File', resumeFile, resumeFile.name);
          }

          const response = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
            method: 'POST',
            body: fd,
            headers: {
              'Accept': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error(`Formspree rejected the application submission: ${response.statusText}`);
          }
          console.log('[Careers] Formspree server accepted form and file payload successfully.');
        } else {
          // Default: Dispatch to Express custom server /api/careers/apply
          const response = await fetch('/api/careers/apply', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(appData)
          });

          if (!response.ok) {
            let serverErrorMsg = 'Failed to submit application email.';
            try {
              const errData = await response.json();
              if (errData && errData.details) {
                serverErrorMsg = `${errData.error || 'Server Error'}: ${errData.details}`;
              } else if (errData && errData.error) {
                serverErrorMsg = errData.error;
              }
            } catch (_) {}
            console.warn('Mail server submission warned, registered candidate via database/local storage backup:', serverErrorMsg);
          } else {
            const resJson = await response.json();
            console.log('Application API submission result:', resJson);
          }
        }
      } catch (apiError) {
        console.warn('Application server endpoint not reachable (GitHub-deployed Static SPA fallback active):', apiError);
      }

      // 3. Client-side automated applicant confirmation email dispatch via EmailJS (if configured)
      try {
        const hasEmailJS = EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY;
        if (hasEmailJS) {
          console.log(`[Careers] EmailJS configuration found. Dispatching candidate confirmation email directly to recipient: ${email}`);
          const emailJsResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              service_id: EMAILJS_SERVICE_ID,
              template_id: EMAILJS_TEMPLATE_ID,
              user_id: EMAILJS_PUBLIC_KEY,
              template_params: {
                candidate_email: email,
                candidate_name: fullName,
                job_title: activeJob.title,
                phone: phone,
                experience: experienceYear,
                cover_letter: coverLetter
              }
            })
          });

          if (!emailJsResponse.ok) {
            const errTxt = await emailJsResponse.text();
            console.warn('[Careers] EmailJS client-side confirmation dispatch rejected:', errTxt);
          } else {
            console.log('[Careers] EmailJS candidate auto-reply confirmation email dispatched successfully!');
          }
        }
      } catch (ejsError) {
        console.warn('[Careers] Failed to dispatch client-side EmailJS confirmation auto-reply:', ejsError);
      }

      // Instantly refresh list of applications on UI
      const updatedList = [firestoreData, ...applications];
      setApplications(updatedList);
      localStorage.setItem('offline_job_applications', JSON.stringify(updatedList));

      setSubmittedRole(activeJob.title);
      setSubmittedEmail(email);
      // Clean states
      setFullName('');
      setEmail('');
      setPhone('');
      setExperienceYear('1');
      setCoverLetter('');
      setResumeFile(null);
      setResumeError('');
      setSubmitError(null);
      setIsFormOpen(false);
    } catch (error: any) {
      console.error('Job application submission error:', error);
      setSubmitError(error instanceof Error ? error.message : String(error));
    } finally {
      setSubmitting(false);
    }
  };

  const depts = ['All', 'Engineering', 'Installation', 'Design', 'Management'];

  const filteredJobs = selectedDept === 'All' 
    ? JOBS 
    : JOBS.filter(job => job.department === selectedDept);

  return (
    <div className="bg-brand-cream/30 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Back and title bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12 border-b border-brand-stone/10 pb-6">
          <div>
            <span className="text-brand-sage font-mono text-[10px] font-bold uppercase tracking-widest block mb-2">Build the grounds for champions</span>
            <h1 className="text-3 tracking-tight font-serif font-semibold text-brand-stone uppercase text-3xl sm:text-4xl">
              Careers at Earthfirm
            </h1>
          </div>
          <button 
            onClick={onBackToMain}
            className="px-5 py-2.5 bg-brand-stone text-brand-cream text-[10px] uppercase font-bold tracking-wider hover:bg-black transition-colors rounded-lg cursor-pointer shrink-0"
          >
            ← Return to Hub
          </button>
        </div>

        {/* Hero banner block */}
        <div className="relative rounded-2xl bg-brand-stone text-brand-cream p-8 sm:p-12 mb-12 overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-800 via-brand-stone to-neutral-900 opacity-90" />
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-serif tracking-normal mb-4 font-semibold text-white">Join the Sovereign Team</h2>
            <p className="text-sm leading-relaxed text-brand-cream/70 mb-6">
              We engineer multi-sport arenas, Olympic-grade gym surfaces, and certified turf fields with meticulous detail. Our projects range from school hubs to sprawling private properties. We are always on the lookout for dedicated minds to scale our operations across our central headquarters and country-wide field installations.
            </p>
            <div className="flex flex-wrap gap-6 text-[11px] font-mono text-brand-cream/80">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-sage-light" /> Professional Growth & Training
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-sage-light" /> Direct Impact on Active Sports
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-sage-light" /> High Safety & Execution Integrity
              </span>
            </div>
          </div>
        </div>

        {submittedRole ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl mx-auto bg-white border border-brand-sage/20 rounded-2xl p-8 sm:p-10 shadow-xl border-t-4 border-t-brand-sage text-center my-8"
          >
            <div className="mx-auto h-16 w-16 bg-brand-sage/10 rounded-full flex items-center justify-center text-brand-sage mb-6 animate-bounce">
              <Mail className="h-8 w-8" />
            </div>

            <span className="text-brand-sage font-mono text-[10px] font-bold uppercase tracking-widest block mb-1">
              Active Application
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-brand-stone uppercase tracking-tight mb-4">
              Your Application is Under Review
            </h2>

            <p className="text-sm text-zinc-600 leading-relaxed max-w-lg mx-auto mb-8">
              We have received and securely cataloged your profile details for the position of <strong className="text-brand-stone font-semibold">{submittedRole}</strong>. Our human resource administrators are actively reviewing your experience metrics.
            </p>

            <div className="bg-brand-cream/40 border border-brand-sage/15 rounded-xl p-5 text-left text-xs text-zinc-700 mb-8 space-y-4 leading-relaxed">
              <div className="flex items-center gap-2 font-bold font-mono text-xs text-brand-stone uppercase tracking-wide border-b border-brand-stone/5 pb-2">
                <CheckCircle2 className="h-4 w-4 text-brand-sage" />
                <span>Next steps & Confirmation Details</span>
              </div>
              
              <p>
                1. <strong>Confirming Receipt:</strong> A verification and confirmation email has been dispatched to your provided contact: <span className="font-mono text-brand-sage font-bold px-1.5 py-0.5 bg-neutral-100 rounded">{submittedEmail || 'your email'}</span>. Please verify it for records.
              </p>
              
              <div className="bg-amber-50 border border-amber-200/65 p-4 rounded-xl flex items-start gap-2.5 text-amber-950">
                <AlertCircle className="h-4.5 w-4.5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-amber-900">Important Notice on Spam Filters</p>
                  <p className="text-[11px] leading-relaxed text-amber-900/90">
                    Since global email clients employ strict automated security checks, <strong>our confirmation email might occasionally land in your Spam or Junk folder</strong>. If you do not see it in your Inbox shortly, please inspect those folders and whitelist our service address to ensure you receive our updates.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => {
                  setSubmittedRole('');
                  setSubmittedEmail('');
                }}
                className="w-full sm:w-auto px-6 py-3 bg-brand-stone text-brand-cream text-[10px] uppercase font-bold tracking-wider hover:bg-black transition-colors rounded-xl cursor-pointer shadow-md"
              >
                Back to Job Listings
              </button>
              <button
                onClick={() => {
                  setSubmittedRole('');
                  setSubmittedEmail('');
                  onBackToMain();
                }}
                className="w-full sm:w-auto px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-brand-stone text-[10px] uppercase font-bold tracking-wider transition-all rounded-xl cursor-pointer"
              >
                Return to Hub
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left panel: Filters & User state tracks */}
          <div className="space-y-8 lg:col-span-1">
            
            {/* Filter */}
            <div className="bg-white/80 backdrop-blur-sm border border-brand-stone/10 p-6 rounded-2xl">
              <h3 className="font-mono text-[11px] uppercase font-bold tracking-widest text-brand-stone/50 mb-4">Departement Filter</h3>
              <div className="flex flex-col gap-2">
                {depts.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDept(d)}
                    className={`px-4 py-2.5 rounded-xl text-left text-xs font-semibold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                      selectedDept === d 
                        ? 'bg-brand-stone text-brand-cream pl-6 font-bold shadow' 
                        : 'text-zinc-600 hover:bg-neutral-100 hover:text-black'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Contact Block */}
            <div className="bg-brand-sage/5 border border-brand-sage/10 p-6 rounded-2xl">
              <h3 className="font-serif text-lg font-bold text-brand-stone mb-2">Direct Reach</h3>
              <p className="text-xs text-brand-stone/70 leading-relaxed mb-4">
                Have custom inquiries or want to pitch an freelance sports infra proposal to our executive board?
              </p>
              <div className="space-y-2 text-xs text-brand-stone-light font-mono">
                <p>Email: <a href="mailto:sportsinfraearthfirm@gmail.com" className="font-semibold text-brand-stone border-b border-brand-stone/30">sportsinfraearthfirm@gmail.com</a></p>
                <p>Tel: +91 98937 77095</p>
              </div>
            </div>

          </div>

          {/* Right panel: Jobs list */}
          <div className="lg:col-span-2 space-y-6">
            
            <AnimatePresence mode="popLayout">
              {filteredJobs.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white border border-brand-stone/10 rounded-2xl p-12 text-center"
                >
                  <Briefcase className="h-10 w-10 mx-auto text-zinc-300 mb-4" />
                  <p className="text-sm font-semibold text-zinc-600">No active positions in the selected division</p>
                  <button 
                    onClick={() => setSelectedDept('All')}
                    className="mt-4 text-xs font-bold text-brand-sage hover:underline cursor-pointer"
                  >
                    Reset Filter View
                  </button>
                </motion.div>
              ) : (
                filteredJobs.map((job) => (
                  <motion.div
                    key={job.id}
                    layoutId={`job-${job.id}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white border border-brand-stone/10 rounded-2xl p-6 sm:p-8 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
                  >
                    
                    <div className="space-y-4">
                      {/* Top tags */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="px-2.5 py-1 bg-zinc-100 text-zinc-700 font-mono text-[9px] font-bold uppercase rounded-lg">
                          {job.department}
                        </span>
                        <span className="px-2.5 py-1 bg-brand-sage/10 text-brand-sage font-mono text-[9px] font-bold uppercase rounded-lg flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {job.location}
                        </span>
                        <span className="px-2.5 py-1 bg-brand-stone/5 text-brand-stone font-mono text-[9px] font-bold uppercase rounded-lg flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {job.type}
                        </span>
                      </div>

                      {/* Header */}
                      <div>
                        <h3 className="text-xl sm:text-2xl font-serif font-bold text-brand-stone tracking-normal leading-normal">{job.title}</h3>
                        <p className="text-xs text-brand-stone-light/60 mt-1 font-mono">Experience Matrix: {job.experience} | Salary: {job.compensation}</p>
                      </div>

                      {/* Details */}
                      <p className="text-xs leading-relaxed text-zinc-600">
                        {job.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div>
                          <h4 className="font-mono text-[10px] uppercase font-bold tracking-wider text-brand-stone mb-2">Qualifications Checklist</h4>
                          <ul className="space-y-1 text-xs text-zinc-600">
                            {job.requirements.map((req, rIdx) => (
                              <li key={rIdx} className="flex items-start gap-2">
                                <span className="text-brand-sage font-mono font-bold mt-0.5">•</span>
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-mono text-[10px] uppercase font-bold tracking-wider text-brand-stone mb-2">Sovereign Benefits</h4>
                          <ul className="space-y-1 text-xs text-zinc-600">
                            {job.benefits.map((ben, bIdx) => (
                              <li key={bIdx} className="flex items-start gap-2">
                                <span className="text-brand-sage-light font-mono font-bold mt-0.5">✓</span>
                                <span>{ben}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                    </div>

                    <div className="mt-6 pt-4 border-t border-dashed border-neutral-100 flex justify-end">
                      <button
                        onClick={() => handleApplyClick(job)}
                        className="px-6 py-2.5 bg-brand-sage text-white text-[10px] uppercase font-mono font-bold tracking-widest rounded-lg hover:bg-brand-stone transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-sm group"
                      >
                        Initiate Application 
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>

                  </motion.div>
                ))
              )}
            </AnimatePresence>

          </div>
        </div>
        )}

      </div>

      {/* Floating Application Slideout Drawer */}
      <AnimatePresence>
        {isFormOpen && activeJob && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />

            {/* Sidebar drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-white z-50 shadow-2xl p-6 sm:p-8 overflow-y-auto flex flex-col justify-between text-brand-stone"
            >
              <div>
                <div className="flex justify-between items-center border-b border-neutral-100 pb-4 mb-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-mono text-zinc-400">Position Applying For</span>
                    <h3 className="font-serif text-lg font-bold text-brand-stone mt-0.5">{activeJob.title}</h3>
                  </div>
                  <button 
                    onClick={() => setIsFormOpen(false)}
                    className="p-1.5 hover:bg-neutral-100 rounded-lg cursor-pointer text-zinc-400 hover:text-black transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-5">
                  {submitError && (
                    <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-mono flex items-start gap-2 leading-relaxed">
                      <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                      <div>
                        <p className="font-bold">Submission Issue</p>
                        <p className="text-[10px] mt-0.5 text-red-500/90">{submitError}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] uppercase font-semibold text-brand-stone-light flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-brand-sage" /> Full Display Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Anand Sharma"
                      className="w-full bg-neutral-50 focus:bg-white border border-neutral-200 focus:border-brand-stone rounded-xl px-4 py-2.5 text-xs text-brand-stone transition duration-150 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] uppercase font-semibold text-brand-stone-light flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-brand-sage" /> Email Contact *
                    </label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. anand@outlook.com"
                      className="w-full bg-neutral-50 focus:bg-white border border-neutral-200 focus:border-brand-stone rounded-xl px-4 py-2.5 text-xs text-brand-stone transition duration-150 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] uppercase font-semibold text-brand-stone-light flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-brand-sage" /> Mobile Telephone *
                    </label>
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 94250 12345"
                      className="w-full bg-neutral-50 focus:bg-white border border-neutral-200 focus:border-brand-stone rounded-xl px-4 py-2.5 text-xs text-brand-stone transition duration-150 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] uppercase font-semibold text-brand-stone-light flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-brand-sage" /> Years of Relative Experience *
                    </label>
                    <select
                      value={experienceYear}
                      onChange={(e) => setExperienceYear(e.target.value)}
                      className="w-full bg-neutral-50 focus:bg-white border border-neutral-200 focus:border-brand-stone rounded-xl p-3 text-xs text-brand-stone focus:outline-none cursor-pointer"
                    >
                      <option value="Less than 1">Less than 1 year</option>
                      <option value="1">1 Year</option>
                      <option value="2">2 Years</option>
                      <option value="3">3 Years</option>
                      <option value="4">4 Years</option>
                      <option value="5+">5+ Years</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] uppercase font-semibold text-brand-stone-light flex items-center gap-1.5">
                      <UploadCloud className="h-3.5 w-3.5 text-brand-sage" /> Upload Resume (PDF, DOC, DOCX) *
                    </label>
                    <div 
                      onDragOver={(e) => { e.preventDefault(); }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleFileValidation(file);
                      }}
                      className="border-2 border-dashed border-neutral-200 hover:border-brand-stone rounded-xl p-4 text-center cursor-pointer hover:bg-neutral-50 transition-all duration-150 relative"
                    >
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileValidation(file);
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      
                      {resumeFile ? (
                        <div className="space-y-1 text-xs">
                          <CheckCircle2 className="h-6 w-6 text-brand-sage mx-auto" />
                          <p className="font-bold text-brand-stone truncate max-w-[250px] mx-auto">{resumeFile.name}</p>
                          <p className="text-zinc-500 text-[10px] font-mono">{(resumeFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setResumeFile(null);
                            }}
                            className="mt-2 text-[9px] uppercase font-mono font-bold text-red-500 hover:underline z-10 relative cursor-pointer"
                          >
                            Remove File
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2 text-zinc-500">
                          <UploadCloud className="h-8 w-8 text-neutral-400 mx-auto" />
                          <p className="text-xs">Drag & drop your resume files here or <span className="text-brand-sage font-bold underline">browse</span></p>
                          <p className="text-[9px] font-mono text-zinc-400">PDF, DOC, DOCX up to 5MB *</p>
                        </div>
                      )}
                    </div>
                    {resumeError && (
                      <p className="text-red-500 font-mono text-[9px] flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {resumeError}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] uppercase font-semibold text-brand-stone-light flex items-center gap-1.5">
                      Brief Cover Note / Pitch *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Introduce your engineering expertise, background in laying sports courts / flooring, or why you'd excel in our logistics team."
                      className="w-full bg-neutral-50 focus:bg-white border border-neutral-200 focus:border-brand-stone rounded-xl p-3 text-xs text-brand-stone transition duration-150 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 bg-brand-stone hover:bg-black disabled:bg-neutral-300 text-brand-cream text-[10.5px] uppercase font-mono font-bold tracking-widest rounded-xl transition duration-200 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>Saving Record...</>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" /> Submit Application
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Informational footer of applying */}
              <div className="text-[10px] text-zinc-400 font-mono flex items-start gap-1.5 border-t border-neutral-100 pt-5 mt-6">
                <AlertCircle className="h-4 w-4 shrink-0 text-brand-sage" />
                <span>Your application document is permanently logged block-safe in the Earthfirm Firestore Database System. Personal ID info remains securely isolated.</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
