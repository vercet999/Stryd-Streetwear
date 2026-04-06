import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X, Moon, Sun } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
        <div className="flex justify-between items-center h-16 relative">
          
          {/* Left Section: Mobile Menu Button & Desktop Logo */}
          <div className="flex-1 flex items-center justify-start">
            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 -ml-2 text-primary hover:bg-primary/5 transition-colors"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
            <div className="hidden md:flex flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img src={isDark ? "/assets/stryd-white.svg" : "/assets/stryd-black.svg"} alt="STRYD" className="h-6 w-auto" />
              </Link>
            </div>
          </div>

          {/* Center Section: Mobile Logo & Desktop Nav */}
          <div className="flex-shrink-0 absolute left-1/2 transform -translate-x-1/2 flex items-center">
            <div className="flex md:hidden">
              <Link to="/" className="flex items-center">
                <img src={isDark ? "/assets/stryd-white.svg" : "/assets/stryd-black.svg"} alt="STRYD" className="h-6 w-auto" />
              </Link>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link to="/shop" className="text-sm font-medium uppercase tracking-widest hover:text-accent transition-colors">Shop</Link>
              <Link to="/contact" className="text-sm font-medium uppercase tracking-widest hover:text-accent transition-colors">Contact Us</Link>
            </div>
          </div>

          {/* Right Section: Actions */}
          <div className="flex-1 flex items-center justify-end gap-2">
            <button 
              onClick={toggleTheme}
              className="hidden md:flex p-2 text-primary hover:bg-primary/5 transition-colors rounded-full"
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
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-base border-b border-primary/5 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              <Link 
                to="/shop" 
                onClick={() => setIsOpen(false)}
                className="block py-4 text-[16px] text-primary font-bold uppercase tracking-widest border-b border-primary/5"
              >
                Shop
              </Link>
              <Link 
                to="/contact" 
                onClick={() => setIsOpen(false)}
                className="block py-4 text-[16px] text-primary font-bold uppercase tracking-widest border-b border-primary/5"
              >
                Contact Us
              </Link>
              <div className="py-4 flex items-center justify-between">
                <span className="text-[16px] text-primary font-bold uppercase tracking-widest">Theme</span>
                <button 
                  onClick={toggleTheme}
                  className="p-2 bg-primary/5 text-primary hover:bg-primary/10 transition-colors rounded-full"
                  aria-label="Toggle dark mode"
                >
                  {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
