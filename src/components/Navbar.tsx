import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X, Moon, Sun } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { useCartStore } from '../store/cartStore';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const totalItems = useCartStore(state => state.getTotalItems());

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = (event: React.MouseEvent) => {
    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    );

    const isDarkNow = document.documentElement.classList.contains('dark');

    if (!document.startViewTransition) {
      document.documentElement.classList.toggle('dark');
      setIsDark(!isDarkNow);
      return;
    }

    if (isDarkNow) {
      document.documentElement.classList.add('shrinking-dark');
    }

    const transition = document.startViewTransition(() => {
      document.documentElement.classList.toggle('dark');
      setIsDark(!isDarkNow);
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        {
          clipPath: isDarkNow ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 500,
          easing: 'ease-in-out',
          pseudoElement: isDarkNow
            ? '::view-transition-old(root)'
            : '::view-transition-new(root)',
        }
      );
    });

    transition.finished.then(() => {
      document.documentElement.classList.remove('shrinking-dark');
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav className={cn(
      "sticky top-0 z-50 bg-base border-b border-primary/5 transition-transform duration-300 ease-in-out",
      isVisible ? "translate-y-0" : "-translate-y-full"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 text-primary hover:bg-primary/5 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img src={isDark ? "/assets/logo/STRYD-white.png" : "/assets/logo/STRYD.png"} alt="STRYD" className="h-6 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link to="/shop" className="text-sm font-medium uppercase tracking-widest hover:text-accent transition-colors">Shop</Link>
            <Link to="/contact" className="text-sm font-medium uppercase tracking-widest hover:text-accent transition-colors">Contact Us</Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              className="p-2 text-primary hover:bg-primary/5 transition-colors rounded-full"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link to="/cart" className="p-2 text-primary hover:bg-primary/5 transition-colors relative rounded-full">
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-accent text-base text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-base border-b border-primary/5">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/shop" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-4 text-[16px] text-primary font-bold uppercase tracking-widest border-b border-primary/5"
            >
              Shop
            </Link>
            <Link 
              to="/contact" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-4 text-[16px] text-primary font-bold uppercase tracking-widest"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
