import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/woocommerce';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [topSellers, setTopSellers] = useState<Product[]>([]);
  const [showSecondary, setShowSecondary] = useState([false, false, false]);

  useEffect(() => {
    getProducts().then(products => {
      setLatestProducts(products.slice(0, 4));
      const featured = products.filter(p => p.featured).sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime());
      setTopSellers(featured.slice(0, 3));
    });

    let currentTick = 0;
    const interval = setInterval(() => {
      const catIndex = currentTick % 3;
      setShowSecondary(prev => {
        const next = [...prev];
        next[catIndex] = !next[catIndex];
        return next;
      });
      currentTick++;
    }, 4000); // 4 seconds between transitions, 12 seconds total per category

    return () => clearInterval(interval);
  }, []);

  const renderTransition = (cat: any, index: number) => {
    const isSecondary = showSecondary[index];
    return (
      <div className="absolute inset-0 overflow-hidden bg-[#0A0A0A]">
        <AnimatePresence initial={false}>
          <motion.div
            key={isSecondary ? 'sec' : 'pri'}
            initial={{ x: '20%', filter: 'blur(20px)', opacity: 0 }}
            animate={{ x: 0, filter: 'blur(0px)', opacity: 1 }}
            exit={{ x: '-20%', filter: 'blur(20px)', opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={isSecondary ? cat.secondaryImg : cat.primaryImg}
              alt={cat.name}
              className="w-full h-full object-cover opacity-70 scale-150 min-[922px]:scale-100 group-hover:opacity-50 group-hover:scale-[1.6] min-[922px]:group-hover:scale-110 transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
        <div className="absolute inset-0 opacity-60">
          <img 
            src="/hero-image.webp" 
            alt="STRYD Slides" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 text-center space-y-8 px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <img src="/assets/logo/STRYD-white.png" alt="STRYD" className="h-16 md:h-24 lg:h-32 w-auto" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl md:text-2xl font-medium text-[#F5F5F5] uppercase tracking-[0.2em]"
          >
            Wear. Move. Own it.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Link 
              to="/shop" 
              className="bg-[#F5F5F5] text-[#0A0A0A] px-10 py-4 font-bold uppercase tracking-widest hover:bg-accent hover:text-[#F5F5F5] transition-all"
            >
              Shop Now
            </Link>
            <Link 
              to="/shop?category=signature" 
              className="border border-[#F5F5F5] text-[#F5F5F5] px-10 py-4 font-bold uppercase tracking-widest hover:bg-[#F5F5F5] hover:text-[#0A0A0A] transition-all"
            >
              View Collection
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Latest Drops */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h2 className="text-4xl font-display font-black tracking-tighter">Latest Drops</h2>
            <p className="text-sm text-primary/60 uppercase tracking-widest">Fresh out the box.</p>
          </div>
          <Link to="/shop" className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-accent transition-colors">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {latestProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* The Heavy Rotation */}
      {topSellers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <h2 className="text-4xl font-display font-black tracking-tighter">The Heavy Rotation</h2>
              <p className="text-sm text-primary/60 uppercase tracking-widest">Customer favorites. Proven on the streets.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            {/* Large item */}
            {topSellers[0] && (
              <div className="lg:col-span-8 group cursor-pointer relative">
                <Link to={`/product/${topSellers[0].slug}`} className="block h-full">
                  <div className="h-full min-h-[400px] lg:min-h-[600px] overflow-hidden bg-[#0A0A0A]/5 dark:bg-[#F5F5F5] relative rounded-[5px] flex items-center justify-center p-12">
                    <img 
                      src={topSellers[0].images[0]?.src} 
                      alt={topSellers[0].name}
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                      <div className="space-y-2">
                        <span className="bg-[#0A0A0A] text-[#F5F5F5] text-[10px] font-bold uppercase px-3 py-1 tracking-widest">
                          #1 Most Wanted
                        </span>
                        <h3 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tighter text-[#0A0A0A]">
                          {topSellers[0].name}
                        </h3>
                      </div>
                      <p className="text-xl font-bold text-[#0A0A0A]">
                        ₵{parseFloat(topSellers[0].price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            )}
            
            {/* Smaller items */}
            <div className="lg:col-span-4 flex flex-col gap-6 md:gap-8">
              {topSellers.slice(1, 3).map((product, idx) => (
                <div key={product.id} className="flex-1 group cursor-pointer relative">
                  <Link to={`/product/${product.slug}`} className="block h-full">
                    <div className="h-full min-h-[250px] overflow-hidden bg-[#0A0A0A]/5 dark:bg-[#F5F5F5] relative rounded-[5px] flex items-center justify-center p-8">
                      <img 
                        src={product.images[0]?.src} 
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="text-lg font-bold uppercase tracking-tight text-[#0A0A0A] group-hover:text-accent transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm font-medium text-[#0A0A0A]/60">
                          ₵{parseFloat(product.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brand Statement */}
      <section className="bg-primary/5 py-24 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-display font-black tracking-tighter leading-tight">
            Daily streetwear footwear. Clean. Affordable. No overthinking.
          </h2>
          <p className="text-sm md:text-[16px] text-[#0a0a0a] dark:text-[#F5F5F5] uppercase tracking-[0.2em]">
            Built for the streets, priced for the people.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="w-full grid grid-cols-1 min-[922px]:grid-cols-3 gap-4 min-[922px]:gap-0 px-4 sm:px-6 min-[922px]:px-0 min-[922px]:h-[90vh]">
        {[
          { name: 'Street Core', slug: 'street-core', primaryImg: '/assets/street-core.jpg', secondaryImg: '/assets/streer-core-fuse.webp' },
          { name: 'Daily Comfort', slug: 'daily-comfort', primaryImg: '/assets/daily-comfort.webp', secondaryImg: '/assets/daily-comfort-crocs.webp' },
          { name: 'The Statement', slug: 'the-statement', primaryImg: '/assets/signature.webp', secondaryImg: '/assets/signature-timberland.webp' }
        ].map((cat, index) => (
          <Link 
            key={cat.slug} 
            to={`/shop?category=${cat.slug}`}
            className="relative h-[400px] min-[922px]:h-full group overflow-hidden bg-[#0A0A0A] rounded-[5px] min-[922px]:rounded-none"
          >
            {renderTransition(cat, index)}
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <h3 className="text-3xl font-display font-black text-[#F5F5F5] tracking-tighter uppercase drop-shadow-md">
                {cat.name}
              </h3>
            </div>
          </Link>
        ))}
      </section>

      {/* Final CTA */}
      <section className="py-24 text-center space-y-8">
        <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase">Ready to move?</h2>
        <Link 
          to="/shop" 
          className="inline-block bg-primary text-base px-16 py-6 font-bold uppercase tracking-[0.3em] hover:bg-accent transition-all"
        >
          Shop STRYD
        </Link>
      </section>
    </div>
  );
}
