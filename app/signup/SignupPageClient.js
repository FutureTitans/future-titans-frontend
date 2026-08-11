'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { setAuthToken, setRefreshToken, setUser } from '@/lib/auth';
import {
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Play,
  Users,
  MapPin,
  Building,
  ThumbsUp,
  ShieldCheck,
  MessageCircle,
  Lightbulb,
  Zap,
  Star,
  ChevronRight
} from 'lucide-react';

function InputField({ label, name, type = 'text', placeholder, isPassword = false, value, onChange, error, disabled, showPw, onTogglePw }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">{label}</label>
      <div className="relative">
        <input
          type={isPassword ? (showPw ? 'text' : 'password') : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`glass-input w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#087F5B] outline-none transition-all ${error ? 'border-red-500 bg-red-50' : 'bg-gray-50'}`}
          disabled={disabled}
        />
        {isPassword && (
          <button
            type="button"
            onClick={onTogglePw}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition rounded-lg"
            aria-label={showPw ? 'Hide password' : 'Show password'}
          >
            {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1.5 ml-1">{error}</p>}
    </div>
  );
}

export default function SignupPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSlug = searchParams.get('slug') || '';
  const { setUser: storeSetUser, setTokens } = useAuthStore();

  const [showForm, setShowForm] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 21, hrs: 18, mins: 23, secs: 47 });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    school: '',
    class: '',
    section: '',
    rollNumber: '',
    city: '',
    country: '',
    password: '',
    confirmPassword: '',
    schoolSlug: initialSlug,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hrs, mins, secs } = prev;
        if (secs > 0) secs--;
        else {
          secs = 59;
          if (mins > 0) mins--;
          else {
            mins = 59;
            if (hrs > 0) hrs--;
            else {
              hrs = 23;
              if (days > 0) days--;
            }
          }
        }
        return { days, hrs, mins, secs };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.phone) {
      newErrors.phone = 'Phone is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid 10-digit Indian phone number';
    }
    if (!formData.school) newErrors.school = 'School is required';
    if (!formData.class) newErrors.class = 'Class is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setIsLoading(true);
    try {
      const response = await auth.signup(formData);
      setAuthToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      storeSetUser(response.user);
      setTokens(response.accessToken, response.refreshToken);
      setUser(response.user);
      router.push('/student/dashboard');
    } catch (err) {
      const errorMessage = err?.error || err?.response?.data?.error || err?.message || (typeof err === 'string' ? err : 'Signup failed. Please try again.');
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartJourney = () => {
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (showForm) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-6 sm:py-10 bg-[#FAF8F3]">
        <div className="w-full max-w-5xl relative z-10 grid md:grid-cols-5 gap-0 bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
          <div className="hidden md:flex md:col-span-2 relative overflow-hidden">
            <Image src="/students_signup.png" alt="Students" fill className="object-cover" />
          </div>

          <div className="md:col-span-3 p-6 sm:p-8 md:p-10">
            <div className="mb-5">
              <button onClick={() => setShowForm(false)} className="inline-flex items-center gap-2 text-gray-500 hover:text-[#087F5B] transition mb-4 group text-sm">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Program Details
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Create Account</h1>
              <p className="text-gray-500 text-sm">Join Future Titans and start your innovation journey</p>
              {initialSlug && (
                <div className="mt-3 inline-block bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full px-4 py-1 text-xs text-[#B8952E] font-medium">
                  Special Offer applied via <span className="font-mono font-bold">{initialSlug}</span>
                </div>
              )}
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm" role="alert">
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <InputField label="Full Name" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} error={errors.name} disabled={isLoading} />
                <InputField label="Email" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} error={errors.email} disabled={isLoading} />
                <InputField label="Phone" name="phone" type="tel" placeholder="98XXXXXXXX" value={formData.phone} onChange={handleChange} error={errors.phone} disabled={isLoading} />
                <InputField label="School/Institution or Slug Code" name="school" placeholder="Your School or Slug Code" value={formData.school} onChange={handleChange} error={errors.school} disabled={isLoading} />
                <div>
                  <label htmlFor="signup-class" className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Class/Grade</label>
                  <select
                    id="signup-class"
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#087F5B] outline-none transition-all ${errors.class ? 'border-red-500 bg-red-50' : 'bg-gray-50'}`}
                  >
                    <option value="">Select your class</option>
                    <option value="8">Class 8</option>
                    <option value="9">Class 9</option>
                    <option value="10">Class 10</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                  </select>
                  {errors.class && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.class}</p>}
                </div>
                <InputField label="Section" name="section" placeholder="e.g. A, B, C" value={formData.section} onChange={handleChange} error={errors.section} disabled={isLoading} />
                <InputField label="Roll Number" name="rollNumber" placeholder="e.g. 42" value={formData.rollNumber} onChange={handleChange} error={errors.rollNumber} disabled={isLoading} />
                <InputField label="City" name="city" placeholder="Mumbai" value={formData.city} onChange={handleChange} error={errors.city} disabled={isLoading} />
                <InputField label="Country" name="country" placeholder="India" value={formData.country} onChange={handleChange} error={errors.country} disabled={isLoading} />
                <InputField label="Password" name="password" placeholder="Min 6 characters" isPassword value={formData.password} onChange={handleChange} error={errors.password} disabled={isLoading} showPw={showPassword} onTogglePw={() => setShowPassword(!showPassword)} />
                <InputField label="Confirm Password" name="confirmPassword" placeholder="Re-enter password" isPassword value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} disabled={isLoading} showPw={showConfirmPassword} onTogglePw={() => setShowConfirmPassword(!showConfirmPassword)} />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 text-base bg-[#087F5B] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-[#065f46] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-4"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <p className="text-center text-gray-500 mt-5 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-[#087F5B] font-semibold hover:underline transition">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#087F5B] selection:text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 lg:px-12 py-4 border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Youngpreneurs" className="h-8 md:h-10 w-auto" />
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleStartJourney} className="bg-[#087F5B] text-white px-5 py-2 rounded-full text-sm font-bold shadow-md hover:bg-[#065f46] transition-colors flex items-center gap-1">
            Start My Journey <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      {/* Hero Section */}
      <header className="relative w-full max-w-[1440px] mx-auto overflow-hidden min-h-[450px] lg:min-h-[640px]">
        {/* Full Background Image */}
        <div className="absolute inset-0 z-0 bg-white">
          <Image
            src="/images/yp/Future-Titans-Hero-4K.png"
            alt="Future Titans Background"
            fill
            className="object-contain object-right-top"
            priority
          />
        </div>

        {/* Content Container */}
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-0 items-stretch h-full">
          <div className="px-6 lg:pl-16 pt-6 lg:pt-10 pb-16 lg:pr-12 flex flex-col justify-start h-full">
            <div className="inline-flex self-start items-center gap-2 bg-[#f4faf6] rounded-full px-3 py-1.5 mb-8 border border-[#d1e6db] shadow-sm">
              <span className="text-amber-500 text-xs">⚡</span>
              <span className="text-[9px] font-black text-[#173e2d] tracking-widest uppercase">India's National Innovation & Entrepreneurship Journey</span>
            </div>

            <h1 className="text-[2.2rem] lg:text-[2.8rem] font-extrabold leading-[1.08] tracking-tight mb-8 text-[#14241c]">
              Think Like an Innovator.<br />
              Build Like a Titan.<br />
              <span className="text-[#3a7553] font-medium">Create Real Impact.</span>
            </h1>

            <p className="text-gray-600 text-[17px] mb-8 max-w-[580px] leading-relaxed font-medium">
              Future Titans is a year-long innovation and entrepreneurship journey for
              Classes 8–12. Through hands-on workshops, structured frameworks and
              expert mentorship, students learn to spot real problems, build solutions and
              pitch their ideas with confidence.
            </p>

            <ul className="space-y-3.5 mb-10 max-w-[600px]">
              {[
                'Build problem-solving, entrepreneurial thinking and future-ready AI skills',
                'Turn real-world challenges into prototypes and compelling pitches',
                'Learn from practitioners, compete nationally and earn recognition'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="bg-[#3a7553] rounded-full mt-1 shrink-0 p-[3px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white stroke-[3]" />
                  </div>
                  <span className="text-[#14241c] font-bold text-[14.5px] leading-snug">{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-6">
              <button onClick={handleStartJourney} className="bg-gradient-to-br from-[#4a7c59] to-[#2c523a] text-white px-7 py-3.5 rounded-[14px] font-bold shadow-lg shadow-green-900/20 hover:scale-[1.02] transition-all flex items-center gap-2 text-sm">
                Start My Journey <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            {/* Top Left Floating Card */}
            <div className="absolute top-6 left-6 lg:top-10 lg:left-10 z-20 bg-white/95 backdrop-blur-xl px-5 py-3.5 rounded-3xl shadow-[0_18px_50px_rgba(4,25,17,0.2)] border border-white/40">
              <p className="text-[8.5px] font-black text-[#c9a84c] mb-0.5 uppercase tracking-[0.14em]">Future Titans 2026</p>
              <p className="text-[20px] font-bold text-[#3a7553] mb-1 leading-tight">Enrolments Open</p>
              <p className="text-[10px] text-[#667269] font-medium">All schools • All cities</p>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="max-w-[1200px] mx-auto px-6 relative z-20 my-10">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 lg:p-8 flex flex-wrap lg:flex-nowrap justify-between items-center gap-6">
          {[
            { icon: Users, num: '10,000+', label: 'Students', color: 'text-blue-500', bg: 'bg-blue-50' },
            { icon: MapPin, num: '40+', label: 'Cities', color: 'text-purple-500', bg: 'bg-purple-50' },
            { icon: Building, num: '150+', label: 'Top Schools', color: 'text-[#087F5B]', bg: 'bg-green-50' },
            { icon: ThumbsUp, num: '95%', label: 'Would Recommend', color: 'text-amber-500', bg: 'bg-amber-50' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center flex-1 min-w-[120px]">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-2xl font-black text-gray-900">{stat.num}</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trusted By */}
      <section className="py-16 text-center max-w-[1200px] mx-auto px-6">
        <p className="text-sm font-extrabold text-gray-400 uppercase tracking-widest mb-10">Backed by institutions Indian parents trust</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-left">
          {[
            { img: 'iit-kharagpur.svg', name: 'IIT Kharagpur', desc: "Curriculum co-developed with India's top engineering institution" },
            { img: 'startUpIndiaLogo.png', name: 'Startup India', desc: "Officially backed by the Government of India's flagship startup initiative" },
            { img: 'AIPlogo.png', name: 'AIP', desc: "Endorsed by India's national body of school principals" },
            { img: 'AIClogo.png', name: 'AIC BIMTEC', desc: "Atal Incubation Centre — supporting next-generation innovators" }
          ].map((inst, i) => (
            <div key={i} className="flex flex-col gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100/50 hover:bg-gray-100 transition-colors">
              <div className="h-10 relative w-auto self-start">
                <Image src={`/images/yp/${inst.img}`} alt={inst.name} width={120} height={40} className="object-contain h-10 w-auto mix-blend-multiply" />
              </div>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">{inst.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Students Love */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-center text-gray-900 mb-12">
            Why <span className="text-[#087F5B]">Students</span> Love Future Titans
          </h2>

          <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-6 max-w-[1000px] mx-auto">
            {[
              { title: 'Build Something Real', desc: 'Design prototypes, solve real-world problems, and create projects that make a difference.', img: 'robot.png' },
              { title: 'Learn AI Early', desc: 'Master future-ready skills like AI, No-Code, Data & Automation through hands-on learning.', img: 'books.png' },
              { title: 'Compete Nationally', desc: 'Participate in exciting challenges and showcase your ideas on national stages.', img: 'trophy.png' },
              { title: 'Stand Out Anywhere', desc: 'Build a strong portfolio and the confidence to lead well in college and beyond.', img: 'rocket.png' },
            ].map((program, i) => (
              <div
                key={i}
                className="relative border border-[#1A3A28] rounded-3xl p-6 sm:p-8 hover:border-[#D4AF37]/40 hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between min-h-[260px]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#0A1C12] to-[#040C07]" />

                <div className="relative z-10 w-[65%]">
                  <h3 className="text-white font-bold text-lg sm:text-xl leading-snug mb-3">{program.title}</h3>
                  <p className="text-[#8c9f95] text-sm leading-relaxed">{program.desc}</p>
                </div>

                <div className="relative z-10 mt-8">
                  <button className="inline-flex items-center gap-2 border border-[#D4AF37] text-[#D4AF37] font-semibold px-5 py-2 rounded-full text-sm hover:bg-[#D4AF37]/10 transition-colors">
                    Explore
                    <div className="w-5 h-5 rounded-full bg-[#D4AF37] flex items-center justify-center">
                      <ChevronRight className="w-3 h-3 text-[#07160E]" />
                    </div>
                  </button>
                </div>

                <div className="absolute right-0 bottom-[-10%] top-[-10%] w-[65%] flex items-center justify-end pointer-events-none opacity-80 mix-blend-lighten">
                  <div className="relative w-full h-[125%]">
                    <Image
                      src={`/images/innovation-club/${program.img}`}
                      alt={program.title}
                      fill
                      className="object-contain object-right scale-110 origin-right"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parents Section */}
      <section className="bg-gradient-to-br from-[#123d2a] to-[#0a2d1f] text-white rounded-[30px] grid lg:grid-cols-[0.82fr_1.58fr] gap-10 lg:gap-16 max-w-[1400px] mx-auto px-8 lg:px-16 py-12 lg:py-16 my-16 relative overflow-hidden shadow-2xl shadow-[#08281c]/20">
        <div className="absolute -top-32 -right-24 w-72 h-72 rounded-full border border-[#f5d76e]/20 shadow-[0_0_0_45px_rgba(245,215,110,0.04),0_0_0_90px_rgba(245,215,110,0.02)] pointer-events-none"></div>
        <div className="relative z-10 self-center">
          <p className="text-[#f5d76e] tracking-[0.18em] text-[10px] font-black mb-3">WHY PARENTS SAY YES</p>
          {/* <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-4 leading-tight text-white">Because the future needs more than good marks.</h2> */}
          <p className="text-[#cbd8d0] text-[15px] leading-relaxed mb-6">Future Titans gives teenagers a safe, structured and purposeful environment to grow into confident thinkers, builders and leaders.</p>
          <a href="/for-parents" className="text-[#f5d76e] text-[13px] font-extrabold hover:underline inline-flex items-center gap-1">See what your child will gain <span className="font-bold">→</span></a>
        </div>

        <div className="relative z-10 grid sm:grid-cols-2 gap-4">
          {[
            { icon: '✦', title: 'Clearer Thinking', desc: 'Learns to frame problems before rushing to answers.' },
            { icon: '↗', title: 'Visible Confidence', desc: 'Expresses ideas with clarity, structure and conviction.' },
            { icon: '◎', title: 'Leadership Through Action', desc: 'Takes ownership, collaborates and learns by doing.' },
            { icon: '◌', title: 'Better Communication', desc: 'Builds the ability to explain, present and persuade.' },
            { icon: '◇', title: 'Real-World Problem Solving', desc: 'Connects classroom learning to meaningful challenges.' },
            { icon: '△', title: 'Healthy Use of AI', desc: 'Uses technology as a thinking partner—not a shortcut.' }
          ].map((benefit, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#f5d76e]/15 text-[#f5d76e] flex items-center justify-center text-xl shrink-0">
                {benefit.icon}
              </div>
              <div>
                <h3 className="font-bold text-[15px] mb-1 text-white">{benefit.title}</h3>
                <p className="text-[#bfcfc5] text-xs leading-relaxed m-0">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Transformation Journey */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-center text-gray-900 mb-16">
            Your <span className="text-[#087F5B]">Transformation</span> Journey
          </h2>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-10 left-10 right-10 h-1.5 bg-gradient-to-r from-gray-200 via-[#087F5B]/30 to-[#087F5B] rounded-full z-0"></div>

            <div className="grid md:grid-cols-5 gap-6 relative z-10">
              {[
                { step: '01', title: 'Curious Start', role: 'LEVEL 1 EXPLORER', color: 'bg-emerald-500' },
                { step: '02', title: 'Discover Ideas', role: 'LEVEL 2 IDEA SEEKER', color: 'bg-blue-500' },
                { step: '03', title: 'Build & Test', role: 'LEVEL 3 BUILDER', color: 'bg-purple-500' },
                { step: '04', title: 'Pitch & Compete', role: 'LEVEL 4 GAME CHANGER', color: 'bg-amber-500' },
                { step: '05', title: 'Become a Titan', role: 'LEVEL 5 FUTURE TITAN', color: 'bg-[#087F5B]' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center md:items-start relative group">
                  <div className={`w-20 h-20 rounded-full ${item.color} text-white flex items-center justify-center font-black text-2xl shadow-lg border-4 border-white mb-6 transform group-hover:scale-110 transition-transform`}>
                    {item.step}
                  </div>
                  <h3 className={`text-lg font-bold mb-1 ${i === 4 ? 'text-[#087F5B]' : 'text-gray-900'}`}>{item.title}</h3>
                  <div className={`mt-3 px-3 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border border-gray-200 ${i === 4 ? 'bg-[#087F5B] text-white border-[#087F5B]' : 'bg-gray-50 text-gray-500'}`}>
                    {item.role}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Voices */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">Voices That Inspire</h2>

          <div className="grid md:grid-cols-2 max-w-4xl mx-auto gap-8">
            {[
              { type: 'STUDENT', name: 'Ronobir', role: 'Grade 12, Pathways', quote: '"Future Titans helped me turn my idea into a working prototype. Now, I believe I can build anything!"', color: 'bg-green-100 text-green-700' },
              { type: 'PARENT', name: 'Mrs. Tanuja', role: 'Parent', quote: '"It\'s exciting to watch confidence in my child. She now tackles big ideas projects so truly world class."', color: 'bg-purple-100 text-purple-700' },
              // { type: 'SCHOOL', name: 'Mr. Rajeev Sinha', role: 'Principal, GD Goenka', quote: '"The program brings innovation and purpose to our students. Highly recommended!"', color: 'bg-blue-100 text-blue-700' },
            ].map((test, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 relative">
                <div className={`absolute top-0 right-8 -translate-y-1/2 px-3 py-1 rounded-full text-[10px] font-bold ${test.color}`}>
                  {test.type}
                </div>
                <p className="text-gray-700 text-sm italic leading-relaxed mb-6">
                  {test.quote}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">{test.name}</p>
                    <p className="text-[10px] text-gray-500 font-medium">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Sticky-like CTA Section */}
      <section className="bg-[#0A1A12] text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/innovation-club/hero-bg.jpeg')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-[1200px] mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 w-full lg:w-1/3 text-center">
            <div className="inline-block bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Limited Seats Per Cohort!
            </div>
            <p className="text-white/80 font-semibold mb-1">Everything Included</p>
            <h2 className="text-5xl font-black text-[#D4AF37] mb-2">
              ₹ 1,500 <span className="text-xl font-bold text-white/80 align-middle">+ 18% GST</span>
            </h2>
            <p className="text-sm text-white/60">Year long program</p>
          </div>

          <div className="w-full lg:w-2/3 grid sm:grid-cols-2 gap-x-8 gap-y-4">
            {[
              'Live Interactive Sessions', 'Founder Framework™',
              'AI & Tech Workshops', 'Portfolio & Certification',
              'Real Project Mentorship', 'Community & Networking',
              'National Competitions', 'Lifetime Alumni Access'
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#087F5B] shrink-0" />
                <span className="text-sm font-semibold">{feature}</span>
              </div>
            ))}
          </div>

        </div>

        <div className="max-w-[1200px] mx-auto mt-12 text-center relative z-10">
          <p className="text-lg font-medium mb-6">Ready to become a Future Titan?</p>
          <button onClick={handleStartJourney} className="bg-[#087F5B] text-white px-10 py-5 rounded-full text-xl font-bold shadow-2xl shadow-[#087F5B]/40 hover:bg-[#065f46] hover:scale-105 transition-all flex items-center gap-3 mx-auto">
            Yes, I'm Ready! <ArrowRight className="w-6 h-6" />
          </button>

          <div className="flex items-center justify-center gap-4 mt-6 opacity-60">
            <span className="text-xs font-semibold">🔒 Secure Checkout</span>
            <span className="text-xs font-semibold">💯 100% Refund Guarantee</span>
          </div>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="bg-[#060d09] text-white/50 py-6 text-center text-xs font-medium">
        <p>The Future is yours to build. Start your journey today!</p>
        <p className="mt-1">Join thousands of teens across India building tomorrow.</p>
      </footer>

    </div>
  );
}
