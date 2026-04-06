import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-[#F5F5F5] py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-4">
          <img src="/assets/stryd-white.svg" alt="STRYD" className="h-8 w-auto" />
          <p className="text-sm text-[#F5F5F5]/60 max-w-xs">
            Affordable streetwear footwear for the modern urban explorer. Clean. Minimal. Confident.
          </p>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#F5F5F5]/40">Shop</h3>
          <ul className="space-y-2">
            <li><Link to="/shop?category=daily-comfort" className="text-sm hover:text-accent transition-colors">Daily Comfort</Link></li>
            <li><Link to="/shop?category=signature" className="text-sm hover:text-accent transition-colors">Signature Series</Link></li>
            <li><Link to="/shop?category=street-core" className="text-sm hover:text-accent transition-colors">Street Core</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#F5F5F5]/40">Connect</h3>
          <ul className="space-y-2">
            <li><a href="https://www.instagram.com/strydgh/" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-accent transition-colors">Instagram</a></li>
            <li><a href="https://tiktok.com/@stryd.gh" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-accent transition-colors">TikTok</a></li>
            <li><a href="https://wa.me/message/FMPYWT5AA4IAO1" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-accent transition-colors">WhatsApp Support</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[#F5F5F5]/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] uppercase tracking-widest text-[#F5F5F5]/40">
          © {new Date().getFullYear()} STRYD Footwear.
        </p>
        <p className="text-[10px] uppercase tracking-widest text-[#F5F5F5]/40">
          Wear. Move. Own it.
        </p>
      </div>
    </footer>
  );
}
