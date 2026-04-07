import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Menu, X, Moon, Sun, Search } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useCartStore } from '../store/cartStore';
import { searchAllProducts } from '../services/woocommerce';
import { Product } from '../types';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const totalItems = useCartStore(state => state.getTotalItems());
  
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length > 1) {
        const results = await searchAllProducts(searchQuery.trim());
        setSuggestions(results.slice(0, 5));
      } else {
        setSuggestions([]);
      }
    };
    
    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(true);
    if (location.pathname === '/shop') {
      const newParams = new URLSearchParams(searchParams);
      if (value.trim()) {
        newParams.set('search', value.trim());
      } else {
        newParams.delete('search');
      }
      navigate(`/shop?${newParams.toString()}`, { replace: true });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
    } else if (location.pathname === '/shop') {
      navigate('/shop');
      setIsOpen(false);
    }
  };

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
    const newTheme = isDarkNow ? 'light' : 'dark';

    if (!document.startViewTransition) {
      document.documentElement.classList.toggle('dark');
      setIsDark(!isDarkNow);
      localStorage.setItem('theme', newTheme);
      return;
    }

    if (isDarkNow) {
      document.documentElement.classList.add('shrinking-dark');
    }

    const transition = document.startViewTransition(() => {
      document.documentElement.classList.toggle('dark');
      setIsDark(!isDarkNow);
      localStorage.setItem('theme', newTheme);
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
            <div ref={searchContainerRef} className="hidden md:flex items-center relative mr-2">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSuggestions(true)}
                  className="pl-9 pr-4 py-2 text-sm bg-primary/5 border border-transparent focus:border-primary/20 rounded-full outline-none transition-all w-48 focus:w-64 text-primary placeholder:text-primary/40"
                />
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" />
              </form>
              
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-72 bg-base border border-primary/10 rounded-[5px] shadow-xl overflow-hidden z-50"
                  >
                    <ul>
                      {suggestions.map((product) => (
                        <li key={product.id}>
                          <Link
                            to={`/product/${product.slug}`}
                            onClick={() => {
                              setShowSuggestions(false);
                              setSearchQuery('');
                            }}
                            className="flex items-center gap-3 p-3 hover:bg-primary/5 transition-colors border-b border-primary/5 last:border-0"
                          >
                            <img 
                              src={product.images[0]?.src || 'https://stryd.visoirejewels.com/wp-content/uploads/2026/04/stryd-model-01.webp'} 
                              alt={product.name}
                              className="w-10 h-10 object-contain bg-primary/5 rounded"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold uppercase tracking-tight truncate">{product.name}</p>
                              <p className="text-xs text-primary/60">₵{parseFloat(product.price).toFixed(2)}</p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="p-2 bg-primary/5 border-t border-primary/10">
                      <button
                        onClick={handleSearchSubmit}
                        className="w-full text-center text-xs font-bold uppercase tracking-widest text-primary/60 hover:text-primary transition-colors"
                      >
                        View all results
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
            <div className="px-4 pt-4 pb-6 space-y-1">
              <div className="pb-4 border-b border-primary/5 relative" ref={searchContainerRef}>
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-primary/5 border border-transparent focus:border-primary/20 rounded-full outline-none transition-all text-primary placeholder:text-primary/40"
                  />
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50" />
                </form>
                
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-base border border-primary/10 rounded-[5px] shadow-xl overflow-hidden z-50"
                    >
                      <ul>
                        {suggestions.map((product) => (
                          <li key={product.id}>
                            <Link
                              to={`/product/${product.slug}`}
                              onClick={() => {
                                setShowSuggestions(false);
                                setSearchQuery('');
                                setIsOpen(false);
                              }}
                              className="flex items-center gap-3 p-3 hover:bg-primary/5 transition-colors border-b border-primary/5 last:border-0"
                            >
                              <img 
                                src={product.images[0]?.src || 'https://stryd.visoirejewels.com/wp-content/uploads/2026/04/stryd-model-01.webp'} 
                                alt={product.name}
                                className="w-10 h-10 object-contain bg-primary/5 rounded"
                                referrerPolicy="no-referrer"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold uppercase tracking-tight truncate">{product.name}</p>
                                <p className="text-xs text-primary/60">₵{parseFloat(product.price).toFixed(2)}</p>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <div className="p-2 bg-primary/5 border-t border-primary/10">
                        <button
                          onClick={handleSearchSubmit}
                          className="w-full text-center text-xs font-bold uppercase tracking-widest text-primary/60 hover:text-primary transition-colors"
                        >
                          View all results
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
