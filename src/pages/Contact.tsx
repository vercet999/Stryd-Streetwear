import { MessageCircle, Mail } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-8">
      <h1 className="text-5xl font-display font-black tracking-tighter uppercase">Contact Us</h1>
      <p className="text-primary/60 max-w-2xl mx-auto leading-relaxed">
        Need help with sizing, tracking an order, or just want to talk sneakers? 
        Hit us up on WhatsApp for the fastest response, or drop us an email.
      </p>
      <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <a 
          href="https://wa.me/message/FMPYWT5AA4IAO1" 
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#25D366] text-[#F5F5F5] px-10 py-4 font-bold uppercase tracking-widest hover:bg-[#128C7E] transition-all"
        >
          <MessageCircle size={20} />
          Chat on WhatsApp
        </a>
        <a 
          href="mailto:hello@stryd.com" 
          className="w-full sm:w-auto flex items-center justify-center gap-3 border-2 border-[#0A0A0A] text-[#000000] dark:border-[#F5F5F5] dark:text-[#F5F5F5] px-10 py-4 font-bold uppercase tracking-widest hover:bg-[#0A0A0A] hover:text-[#F5F5F5] dark:hover:bg-[#F5F5F5] dark:hover:text-[#0A0A0A] transition-all"
        >
          <Mail size={20} />
          Email Support
        </a>
      </div>
    </div>
  );
}
