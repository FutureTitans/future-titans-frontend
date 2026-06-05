'use client';

import { useState } from 'react';
import Image from 'next/image';
import PublicNavbar from '@/components/shared/PublicNavbar';
import PublicFooter from '@/components/shared/PublicFooter';
import { Phone, Mail, Calendar } from 'lucide-react';

export default function Contact() {
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus('');
    const form = e.target;
    const data = {
      name: form.name.value,
      email: form.email.value,
      subject: form.subject.value,
      message: form.message.value,
    };

    try {
      const emailjs = (await import('emailjs-com')).default;
      await emailjs.send('service_c7slref', 'template_vf1quro', {
        to_email: 'yes@youngpreneurs.ai',
        from_name: data.name,
        from_email: data.email,
        subject: data.subject,
        message: data.message,
      }, 'E8lk4udkqNof2HatE');
      setStatus('Message sent successfully!');
      form.reset();
    } catch {
      setStatus('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      <section className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
        <Image src="/images/yp/contactHeaderBg.jpg" alt="Contact" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B2A4A]/60 via-transparent to-white" />
        <div className="absolute bottom-16 left-0 right-0 text-center z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white">Contact Us</h1>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {[
            { icon: <Phone className="w-6 h-6" />, title: 'Call Us', lines: ['+91 9038428532'], href: 'tel:+919038428532' },
            { icon: <Mail className="w-6 h-6" />, title: 'Email Us', lines: ['yes@youngpreneurs.ai'], href: 'mailto:yes@youngpreneurs.ai' },
            { icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>, title: 'WhatsApp', lines: ['Chat on WhatsApp'], href: 'https://wa.me/919038428532' },
            { icon: <Calendar className="w-6 h-6" />, title: 'Book a Call', lines: ['Schedule Now'], href: '#' },
          ].map((card, i) => (
            <a key={i} href={card.href} target={card.href.startsWith('http') ? '_blank' : undefined} rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="bg-white border border-gray-100 rounded-2xl p-6 text-center hover:border-[#C8960C]/30 hover:shadow-md transition-all group no-underline block">
              <div className="text-[#C8960C] mb-3 flex justify-center group-hover:scale-110 transition-transform">{card.icon}</div>
              <h3 className="text-sm font-bold text-[#1B2A4A] mb-2">{card.title}</h3>
              {card.lines.map((l, j) => <p key={j} className="text-gray-500 text-sm">{l}</p>)}
            </a>
          ))}
        </div>

        <div className="max-w-xl mx-auto">
          <div className="bg-[#FAFAFA] border border-gray-100 rounded-2xl p-8 lg:p-10">
            <h2 className="text-2xl font-bold text-[#1B2A4A] text-center mb-8">Send Us a <span className="text-[#C8960C]">Message</span></h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { name: 'name', type: 'text', placeholder: 'Your Name' },
                { name: 'email', type: 'email', placeholder: 'Your Email' },
                { name: 'subject', type: 'text', placeholder: 'Subject' },
              ].map((f, i) => (
                <input key={i} type={f.type} name={f.name} placeholder={f.placeholder} required className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#1B2A4A] placeholder-gray-400 focus:border-[#C8960C] focus:outline-none focus:ring-2 focus:ring-[#C8960C]/20 transition-all" />
              ))}
              <textarea name="message" rows={5} placeholder="Your Message" required className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#1B2A4A] placeholder-gray-400 focus:border-[#C8960C] focus:outline-none focus:ring-2 focus:ring-[#C8960C]/20 transition-all resize-none" />
              <button type="submit" disabled={sending} className="w-full bg-[#C8960C] text-white py-3.5 rounded-full font-bold text-sm tracking-wider hover:bg-[#b5870b] disabled:opacity-50 transition-all shadow-lg shadow-[#C8960C]/20">
                {sending ? 'Sending...' : 'Send Message'}
              </button>
              {status && <p className={`text-center text-sm mt-2 ${status.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{status}</p>}
            </form>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
