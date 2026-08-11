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
  Star
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
      <header className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 px-6 lg:px-12 max-w-[1400px] mx-auto overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-1.5 mb-6 border border-gray-200 shadow-sm">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-gray-600 tracking-wider">FOR TEENS WHO DREAM BIG & BUILD BIGGER</span>
            </div>

            <h1 className="text-5xl lg:text-[4rem] font-extrabold leading-[1.1] tracking-tight mb-6 text-gray-900">
              Build the Future.<br />
              Lead with Confidence.<br />
              <span className="text-[#087F5B]">Create Real Impact.</span>
            </h1>

            <p className="text-gray-600 text-lg mb-8 max-w-xl leading-relaxed">
              India&apos;s most loved innovation & entrepreneurship program for teens. Build real projects, master future skills, and get recognized across India.
            </p>

            <ul className="space-y-3 mb-10">
              {[
                'Learn AI, Innovation & Entrepreneurship',
                'Build real projects that solve real problems',
                'Compete, Win, Get recognized across India.'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#087F5B] shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <button onClick={handleStartJourney} className="bg-[#087F5B] text-white px-8 py-3.5 rounded-full font-bold shadow-xl shadow-[#087F5B]/30 hover:bg-[#065f46] transition-all flex items-center gap-2">
                Start My Journey <ArrowRight className="w-4 h-4" />
              </button>
              {/* <button className="bg-white text-gray-800 border border-gray-200 px-6 py-3.5 rounded-full font-semibold shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2">
                <Play className="w-4 h-4 text-[#087F5B]" /> Watch 90-sec overview
              </button> */}
            </div>

            {/* <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {['devika.jpg', 'fred.jpeg', 'partha.jpg', 'suman.jpg'].map((img) => (
                  <div key={img} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden relative">
                    <Image src={`/images/yp/${img}`} alt="Student" fill className="object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex text-amber-400 mb-0.5">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-xs font-semibold text-gray-600">Loved by 10,000+ students across 40+ cities</p>
              </div>
            </div> */}
          </div>

          {/* Right Image area */}
          <div className="relative z-0 h-[400px] lg:h-[600px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl">
            <Image src="/students_signup.png" alt="Students" fill className="object-cover" priority />

            {/* <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-100">
              <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Next Cohort Starts In</p>
              <div className="flex gap-3 text-center">
                <div><div className="text-2xl font-black text-[#087F5B]">{String(timeLeft.days).padStart(2, '0')}</div><div className="text-[10px] text-gray-500">Days</div></div>
                <div className="text-2xl font-bold text-gray-300">:</div>
                <div><div className="text-2xl font-black text-[#087F5B]">{String(timeLeft.hrs).padStart(2, '0')}</div><div className="text-[10px] text-gray-500">Hrs</div></div>
                <div className="text-2xl font-bold text-gray-300">:</div>
                <div><div className="text-2xl font-black text-[#087F5B]">{String(timeLeft.mins).padStart(2, '0')}</div><div className="text-[10px] text-gray-500">Mins</div></div>
                <div className="text-2xl font-bold text-gray-300">:</div>
                <div><div className="text-2xl font-black text-[#087F5B]">{String(timeLeft.secs).padStart(2, '0')}</div><div className="text-[10px] text-gray-500">Secs</div></div>
              </div>
            </div> */}

            <div className="absolute bottom-10 right-6 bg-[#087F5B] text-white w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-2xl border-4 border-white transform rotate-12 font-bold text-center leading-tight">
              Future<br />Starts<br />Here!
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="max-w-[1200px] mx-auto px-6 relative -mt-16 lg:-mt-20 z-20 mb-16">
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

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[
              { num: '01', title: 'Build Something Real', desc: 'Design prototypes, solve real-world problems, and create projects that make a difference.', img: 'robot.png', color: 'bg-emerald-50 text-[#087F5B]', titleColor: 'text-[#087F5B]' },
              { num: '02', title: 'Learn AI Early', desc: 'Master future-ready skills like AI, No-Code, Data & Automation through hands-on learning.', img: 'books.png', color: 'bg-blue-50 text-blue-600', titleColor: 'text-blue-600' },
              { num: '03', title: 'Compete Nationally', desc: 'Participate in exciting challenges and showcase your ideas on national stages.', img: 'trophy.png', color: 'bg-amber-50 text-amber-600', titleColor: 'text-amber-600' },
              { num: '04', title: 'Stand Out Anywhere', desc: 'Build a strong portfolio and the confidence to lead well in college and beyond.', img: 'rocket.png', color: 'bg-purple-50 text-purple-600', titleColor: 'text-purple-600' },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col">
                <div className={`w-10 h-10 rounded-full ${card.color} flex items-center justify-center font-bold text-sm mb-6`}>
                  {card.num}
                </div>
                <div className="h-40 relative w-full mb-6 rounded-2xl overflow-hidden">
                  <Image src={`/images/innovation-club/${card.img}`} alt={card.title} fill className="object-cover" />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${card.titleColor}`}>{card.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">{card.desc}</p>
                {/* <button className={`text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all ${card.titleColor}`}>
                  Learn more <ArrowRight className="w-4 h-4" />
                </button> */}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parents Section */}
      <section className="py-16 max-w-[1200px] mx-auto px-6 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          <div className="lg:w-1/4">
            <h2 className="text-3xl font-extrabold text-[#087F5B] mb-2 leading-tight">Why Parents<br />Say Yes</h2>
            <p className="text-sm text-gray-500">We partner with parents to help teenagers grow into confident leaders.</p>
          </div>

          <div className="lg:w-3/4 grid grid-cols-2 sm:grid-cols-5 gap-6">
            {[
              { icon: ShieldCheck, label: 'Builds Confidence' },
              { icon: Users, label: 'Develops Leadership' },
              { icon: MessageCircle, label: 'Improves Communication' },
              { icon: Lightbulb, label: 'Solves Real-World Problems' },
              { icon: Zap, label: 'Future-Ready with AI' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mb-3">
                  <item.icon className="w-6 h-6 text-[#087F5B]" strokeWidth={1.5} />
                </div>
                <p className="text-xs font-bold text-gray-800 leading-tight">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 bg-green-50 rounded-2xl p-4 flex items-center justify-center gap-2 border border-green-100">
          <ShieldCheck className="w-5 h-5 text-[#087F5B]" />
          <p className="text-sm font-bold text-gray-900">
            Safe. Structured. Impactful. <span className="text-gray-500 font-normal">Trusted by schools & parents across India.</span>
          </p>
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
