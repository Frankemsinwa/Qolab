import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react';
import { gsap } from 'gsap';

interface ContactPageProps {
  onBack: () => void;
}

interface FormState {
  fullName: string;
  email: string;
  businessName: string;
  website: string;
  whatDoesBusinessDo: string;
  whoDoYouServe: string;
  stage: string;
  needs: string[];
  notWorking: string;
  triedBefore: string;
  vision: string;
  budget: string;
  ready: string;
  timeline: string;
  honeypot: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  fullName: '',
  email: '',
  businessName: '',
  website: '',
  whatDoesBusinessDo: '',
  whoDoYouServe: '',
  stage: '',
  needs: [],
  notWorking: '',
  triedBefore: '',
  vision: '',
  budget: '',
  ready: '',
  timeline: '',
  honeypot: '',
};

const NEEDS = [
  'Brand identity and design',
  'Website design and development',
  'Marketing strategy and content',
  'Full brand build — all of the above',
];

const BUDGETS = [
  '₦500,000–₦1,500,000 ($300–$1,000)',
  '₦1,500,000–₦3,500,000 ($1,000–$2,300)',
  '₦3,500,000+ ($2,300+)',
  'I am not sure yet',
];

export default function ContactPage({ onBack }: ContactPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.from('.contact-reveal', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const toggleNeed = (need: string) => {
    setForm((prev) => ({
      ...prev,
      needs: prev.needs.includes(need) ? prev.needs.filter((n) => n !== need) : [...prev.needs, need],
    }));
    setErrors((prev) => {
      if (!prev.needs) return prev;
      const next = { ...prev };
      delete next.needs;
      return next;
    });
  };

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    if (!form.fullName.trim()) errs.fullName = 'Please enter your full name.';
    if (!form.email.trim()) errs.email = 'Please enter your email.';
    else if (!emailOk) errs.email = 'Please enter a valid email address.';
    if (!form.businessName.trim()) errs.businessName = 'Please enter your business name.';
    if (!form.whatDoesBusinessDo.trim()) errs.whatDoesBusinessDo = 'Tell us what your business does.';
    if (!form.whoDoYouServe.trim()) errs.whoDoYouServe = 'Tell us who you serve.';
    if (!form.stage) errs.stage = 'Choose the stage that fits best.';
    if (form.needs.length === 0) errs.needs = 'Select at least one area you need help with.';
    if (!form.notWorking.trim()) errs.notWorking = 'Tell us what is not working right now.';
    if (!form.triedBefore.trim()) errs.triedBefore = 'Tell us what you have tried before.';
    if (!form.vision.trim()) errs.vision = 'Tell us where you want your brand to be.';
    if (!form.budget) errs.budget = 'Choose a budget range — or "I am not sure yet".';
    if (!form.ready) errs.ready = 'Please choose one.';
    if (!form.timeline) errs.timeline = 'Choose a timeline.';
    return errs;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (form.honeypot.trim()) {
      setSubmitted(true);
      return;
    }
    const errs = validate();
    setErrors(errs);
    const keys = Object.keys(errs) as (keyof FormState)[];
    if (keys.length > 0) {
      const el = document.getElementById(String(keys[0]));
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el?.focus({ preventScroll: true });
      return;
    }
    // Backend wiring deferred (F7) — submission lands in success state for now.
    setSubmitted(true);
  };

  const labelCls = 'font-mono text-xs text-black/40 uppercase tracking-widest mb-2 block';
  const star = <span className="text-[#3a863f]">*</span>;
  const inputCls = (hasError?: string) =>
    `w-full bg-white/50 border rounded-xl px-6 py-4 text-black font-sans focus:outline-none transition-colors ${
      hasError ? 'border-red-400 focus:border-red-500' : 'border-black/10 focus:border-[#3a863f]'
    }`;

  const textField = (key: keyof FormState, label: string, placeholder: string, type = 'text') => (
    <div>
      <label htmlFor={key} className={labelCls}>
        {label} {star}
      </label>
      <input
        id={key}
        type={type}
        value={String(form[key])}
        onChange={(e) => set(key, e.target.value)}
        placeholder={placeholder}
        aria-invalid={errors[key] ? true : undefined}
        aria-describedby={errors[key] ? `${key}-error` : undefined}
        className={inputCls(errors[key])}
      />
      {errors[key] && <p id={`${key}-error`} className="text-red-600 text-xs mt-1.5 font-sans">{errors[key]}</p>}
    </div>
  );

  const textArea = (key: keyof FormState, label: string, placeholder: string) => (
    <div>
      <label htmlFor={key} className={labelCls}>
        {label} {star}
      </label>
      <textarea
        id={key}
        rows={3}
        value={String(form[key])}
        onChange={(e) => set(key, e.target.value)}
        placeholder={placeholder}
        aria-invalid={errors[key] ? true : undefined}
        aria-describedby={errors[key] ? `${key}-error` : undefined}
        className={`${inputCls(errors[key])} resize-none`}
      />
      {errors[key] && <p id={`${key}-error`} className="text-red-600 text-xs mt-1.5 font-sans">{errors[key]}</p>}
    </div>
  );

  const radioGroup = (key: keyof FormState, legend: string, options: string[]) => (
    <fieldset>
      <legend className={labelCls}>
        {legend} {star}
      </legend>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <label
            key={option}
            className={`cursor-pointer rounded-full border px-5 py-2.5 text-sm font-sans transition-colors focus-within:ring-2 focus-within:ring-[#3a863f]/40 ${
              form[key] === option
                ? 'border-[#3a863f] bg-[#3a863f]/10 text-[#2f6d33] font-semibold'
                : 'border-black/10 bg-white/50 text-gray-700 hover:border-[#3a863f]/40'
            }`}
          >
            <input
              type="radio"
              name={key}
              value={option}
              checked={form[key] === option}
              onChange={() => set(key, option)}
              className="sr-only"
            />
            {option}
          </label>
        ))}
      </div>
      {errors[key] && <p id={`${key}-error`} className="text-red-600 text-xs mt-1.5 font-sans">{errors[key]}</p>}
    </fieldset>
  );

  const sectionLabel = (letter: string, title: string) => (
    <div className="flex items-center gap-3 mb-6 pt-8 border-t border-black/10 first:border-t-0 first:pt-0">
      <span className="font-mono text-xs font-bold text-white bg-[#3a863f] w-7 h-7 rounded-full flex items-center justify-center">
        {letter}
      </span>
      <h3 className="font-mono text-xs text-black/60 uppercase tracking-widest font-bold">{title}</h3>
    </div>
  );

  return (
    <div ref={containerRef} className="w-full pt-32 pb-24 px-6 sm:px-12 md:px-16 min-h-screen">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-16 border-b border-black/10 pb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-[#3a863f] hover:text-[#2f6d33] transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Return Home</span>
        </button>
        <span className="font-mono text-xs text-black/40 uppercase tracking-widest">
          Contact
        </span>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Page intro (E1) */}
        <h1 className="contact-reveal font-display italic text-5xl sm:text-7xl md:text-8xl text-black leading-[0.9] mb-8">
          So, What's the Big Idea?
        </h1>
        <p className="contact-reveal font-sans text-lg sm:text-xl text-gray-600 max-w-2xl mb-16 leading-relaxed">
          Bring the question. Bring the ambition. Bring the unfinished idea. Let's see what it could become.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-12 lg:gap-16 items-start">
          {/* Contact details rail (E5 — no WhatsApp) */}
          <div className="contact-reveal flex flex-col gap-6 md:sticky md:top-8">
            <div className="bg-white/50 rounded-2xl p-6 border border-black/5">
              <span className="font-mono text-xs text-[#3a863f] font-bold uppercase tracking-widest mb-2 block">Email</span>
              <a href="mailto:hello.qolab@gmail.com" className="font-sans text-lg text-black hover:text-[#3a863f] transition-colors break-all">
                hello.qolab@gmail.com
              </a>
            </div>
            <div className="bg-white/50 rounded-2xl p-6 border border-black/5">
              <span className="font-mono text-xs text-[#3a863f] font-bold uppercase tracking-widest mb-2 block">Location</span>
              <p className="font-sans text-lg text-black">Nigeria &amp; UK</p>
              <p className="font-sans text-sm text-gray-500 mt-1">Working globally</p>
            </div>
            <div className="bg-white/50 rounded-2xl p-6 border border-black/5">
              <span className="font-mono text-xs text-[#3a863f] font-bold uppercase tracking-widest mb-2 block">Follow Us</span>
              <div className="flex gap-4 mt-2">
                <a href="#" className="font-sans text-black hover:text-[#3a863f] transition-colors">Instagram</a>
                <a href="#" className="font-sans text-black hover:text-[#3a863f] transition-colors">LinkedIn</a>
                <a href="#" className="font-sans text-black hover:text-[#3a863f] transition-colors">Twitter</a>
              </div>
            </div>
            <div className="bg-[#f5f5f5] rounded-2xl p-6 border border-black/5">
              <span className="font-mono text-xs text-[#3a863f] font-bold uppercase tracking-widest mb-2 block">What happens next</span>
              <p className="font-sans text-sm text-gray-600 leading-relaxed">
                Every application is reviewed by our lead strategist. If there is a strong fit,
                you will receive a personalised invitation to a Strategy Session.
              </p>
            </div>
          </div>

          {/* Application form (E2) */}
          <div className="contact-reveal">
            {!submitted ? (
              <>
                <h2 className="font-display italic text-3xl sm:text-4xl text-black mb-2">
                  Tell us what you're imagining.
                </h2>
                <p className="font-sans text-sm text-gray-500 mb-10">
                  Fields marked <span className="text-[#3a863f]">*</span> are required.
                </p>

                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-0">
                  {/* A — About you */}
                  {sectionLabel('A', 'About you')}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {textField('fullName', 'Full name', 'Your full name')}
                    {textField('email', 'Email', 'name@email.com', 'email')}
                    {textField('businessName', 'Business name', 'Your business or brand')}
                    <div>
                      <label htmlFor="website" className={labelCls}>Website / social (optional)</label>
                      <input
                        id="website"
                        type="text"
                        value={form.website}
                        onChange={(e) => set('website', e.target.value)}
                        placeholder="yoursite.com or @yourhandle"
                        className={inputCls()}
                      />
                    </div>
                  </div>

                  {/* B — Your business */}
                  {sectionLabel('B', 'Your business')}
                  <div className="flex flex-col gap-6">
                    {textArea('whatDoesBusinessDo', 'What does your business do?', 'A few sentences about what you sell or do.')}
                    {textArea('whoDoYouServe', 'Who do you serve?', 'Your customers, clients, or audience.')}
                    {radioGroup('stage', 'Stage of business', ['Idea', 'Early', 'Growing', 'Established'])}
                  </div>

                  {/* C — What you need */}
                  {sectionLabel('C', 'What you need')}
                  <fieldset>
                    <legend className={labelCls}>
                      What do you need help with? {star}
                    </legend>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {NEEDS.map((need) => {
                        const checked = form.needs.includes(need);
                        return (
                          <label
                            key={need}
                            className={`cursor-pointer rounded-xl border px-5 py-4 text-sm font-sans transition-colors flex items-start gap-3 focus-within:ring-2 focus-within:ring-[#3a863f]/40 ${
                              checked
                                ? 'border-[#3a863f] bg-[#3a863f]/10 text-[#2f6d33] font-semibold'
                                : 'border-black/10 bg-white/50 text-gray-700 hover:border-[#3a863f]/40'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleNeed(need)}
                              className="sr-only"
                            />
                            <span
                              className={`w-4 h-4 mt-0.5 rounded border flex-shrink-0 flex items-center justify-center ${
                                checked ? 'bg-[#3a863f] border-[#3a863f]' : 'border-black/30 bg-white'
                              }`}
                            >
                              {checked && <Check size={12} className="text-white" strokeWidth={3} />}
                            </span>
                            {need}
                          </label>
                        );
                      })}
                    </div>
                    {errors.needs && <p id="needs-error" className="text-red-600 text-xs mt-1.5 font-sans">{errors.needs}</p>}
                  </fieldset>

                  {/* D — The current state */}
                  {sectionLabel('D', 'The current state')}
                  <div className="flex flex-col gap-6">
                    {textArea('notWorking', 'What is currently not working with your brand or marketing?', 'Be honest — this is where we start.')}
                    {textArea('triedBefore', 'What have you tried before, and why did it not work?', 'Agencies, in-house attempts, half-finished projects — all useful.')}
                  </div>

                  {/* E — Where you're heading */}
                  {sectionLabel('E', "Where you're heading")}
                  {textArea('vision', 'Where do you want your brand to be in 6 to 12 months?', 'The outcome you are working towards.')}

                  {/* F — Budget */}
                  {sectionLabel('F', 'Budget')}
                  {radioGroup('budget', 'Budget range', BUDGETS)}

                  {/* G — Fit & timing */}
                  {sectionLabel('G', 'Fit & timing')}
                  <div className="flex flex-col gap-6">
                    {radioGroup('ready', 'Ready to invest properly?', ['Yes', 'Not yet'])}
                    {radioGroup('timeline', 'Timeline', ['Immediately', 'Within 1 month', 'Within 3 months', 'Just exploring'])}
                  </div>

                  {/* Honeypot (E3) */}
                  <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
                    <label htmlFor="honeypot">Leave this field empty</label>
                    <input
                      id="honeypot"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.honeypot}
                      onChange={(e) => set('honeypot', e.target.value)}
                    />
                  </div>

                  {/* Privacy notice + submit (E3) */}
                  <p className="font-sans text-xs text-gray-500 leading-relaxed mt-10 pt-8 border-t border-black/10">
                    We'll only use your details to review your application and reply to you.
                    Your information stays private — never shared, never added to mailing lists.
                  </p>
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-3 bg-[#3a863f] hover:bg-[#2f6d33] text-white font-semibold py-4 px-8 rounded-full transition-transform hover:scale-105 active:scale-95 shadow-md mt-6 font-display"
                  >
                    <span>Let's Make It Exist.</span>
                    <ArrowUpRight size={18} />
                  </button>
                </form>
              </>
            ) : (
              /* Success state (E4) */
              <div className="bg-white/50 rounded-[2rem] p-10 sm:p-14 border border-black/5 text-center">
                <div className="w-16 h-16 rounded-full bg-[#3a863f] flex items-center justify-center mx-auto mb-6">
                  <Check size={28} className="text-white" />
                </div>
                <h2 className="font-display italic text-3xl sm:text-4xl text-black mb-4">
                  Something's in motion. We'll be in touch.
                </h2>
                <p className="font-sans text-gray-600 leading-relaxed max-w-xl mx-auto mb-8">
                  Your application has been received and will be reviewed by our lead strategist.
                  If we believe there is a strong fit, you will receive a personalised invitation
                  to a Strategy Session within 24 to 48 hours.
                </p>
                <button
                  onClick={onBack}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#3a863f] hover:text-[#2f6d33] transition-colors font-sans"
                >
                  <ArrowLeft size={16} />
                  <span>Back to home</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
