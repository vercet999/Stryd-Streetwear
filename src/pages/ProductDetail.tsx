import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductBySlug } from '../services/woocommerce';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ShoppingCart, X, Facebook, Twitter, Link2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useCartStore } from '../store/cartStore';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const addItem = useCartStore(state => state.addItem);
  const navigate = useNavigate();
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({
    transformOrigin: 'center center',
    transform: 'scale(1)'
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2)'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: 'center center',
      transform: 'scale(1)'
    });
  };

  useEffect(() => {
    if (slug) {
      setLoading(true);
      getProductBySlug(slug).then(p => {
        setProduct(p || null);
        setSelectedImage(0);
        setLoading(false);
      });
    }
  }, [slug]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!product || product.images.length <= 1) return;
      
      if (e.key === 'ArrowLeft') {
        setSelectedImage(prev => (prev > 0 ? prev - 1 : product.images.length - 1));
      } else if (e.key === 'ArrowRight') {
        setSelectedImage(prev => (prev < product.images.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner className="w-14 h-14" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-6">
        <h1 className="text-4xl font-display font-black tracking-tighter">Product Not Found</h1>
        <Link to="/shop" className="inline-block bg-primary text-base px-8 py-3 font-bold uppercase tracking-widest">
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = (redirect = false) => {
    if (!product) return;
    
    // If there are sizes/colors available, ensure they are selected
    if (sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (colors.length > 0 && !selectedColor) {
      toast.error('Please select a color');
      return;
    }

    addItem({
      product,
      quantity: 1,
      size: selectedSize || undefined,
      color: selectedColor || undefined
    });
    
    toast.success(`${product.name} added to cart!`);
    if (redirect) {
      navigate('/cart');
    }
  };

  const handleShare = (platform: string) => {
    if (!product) return;
    const shareUrl = window.location.href;
    const shareText = `Check out ${product.name} on STRYD GH`;
    const shareImage = product.images[0]?.src || '';
    let url = '';

    switch (platform) {
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'pinterest':
        url = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(shareImage)}&description=${encodeURIComponent(shareText)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
        return;
    }
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  const sizes = product.attributes.find(a => a.name.toLowerCase() === 'size')?.options || [];
  const colors = product.attributes.find(a => a.name.toLowerCase() === 'color')?.options || [];
  const brandAttr = product.attributes.find(a => a.name.toLowerCase() === 'brand')?.options?.[0];
  const brandName = product.brands?.[0]?.name || brandAttr || 'STRYD';
  const otherAttributes = product.attributes.filter(a => !['size', 'color', 'brand'].includes(a.name.toLowerCase()) && a.visible);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/40 mb-8 flex-wrap">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
        <ChevronRight size={14} />
        {product.categories?.[0] && (
          <>
            <Link to={`/shop?category=${product.categories[0].slug}`} className="hover:text-primary transition-colors">{product.categories[0].name}</Link>
            <ChevronRight size={14} />
          </>
        )}
        <span className="text-primary">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Product Images - Tiffany Style */}
        <div className="lg:col-span-7 flex flex-col md:flex-row gap-6 min-w-0 items-start">
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex md:flex-col gap-4 order-2 md:order-1 overflow-x-auto md:w-20 shrink-0 hide-scrollbar">
              {product.images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "aspect-square w-20 md:w-full bg-[#0A0A0A]/5 dark:bg-[#F5F5F5] shrink-0 transition-all rounded-[5px] overflow-hidden",
                    selectedImage === i ? "border border-primary" : "border border-transparent hover:border-primary/20"
                  )}
                >
                  <img 
                    src={img.src} 
                    alt={img.name} 
                    className="w-full h-full object-contain mix-blend-multiply" 
                    referrerPolicy="no-referrer" 
                  />
                </button>
              ))}
            </div>
          )}
          
          {/* Main Image */}
          <div className="aspect-square bg-[#0A0A0A]/5 dark:bg-[#F5F5F5] flex-1 min-w-0 rounded-[5px] overflow-hidden flex items-center justify-center order-1 md:order-2 relative cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <AnimatePresence mode="wait">
              <motion.img 
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                src={product.images[selectedImage]?.src || product.images[0]?.src || 'https://stryd.visoirejewels.com/wp-content/uploads/2026/04/stryd-model-01.webp'} 
                alt={product.name} 
                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-200 ease-out"
                style={zoomStyle}
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:col-span-5 space-y-10 lg:py-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Link to={`/shop?brand=${brandName.toLowerCase()}`} className="text-xs font-bold uppercase tracking-[0.2em] text-primary/40 hover:text-accent transition-colors">
                {brandName}
              </Link>
              <Link to={`/shop?category=${product.categories[0]?.slug}`} className="text-xs font-bold uppercase tracking-[0.2em] text-primary/40 hover:text-accent transition-colors">
                {product.categories[0]?.name}
              </Link>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <p className="text-2xl font-medium text-primary/80">
                ₵{parseFloat(product.price).toFixed(2)}
              </p>
              {product.stock_status === 'outofstock' && (
                <span className="bg-primary/5 text-primary/60 border border-primary/10 text-[10px] font-bold uppercase px-3 py-1 tracking-widest">
                  Sold Out
                </span>
              )}
            </div>
          </div>

          {colors.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest">Select Color</h3>
              <div className="flex flex-wrap gap-3">
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "px-6 py-3 border text-sm font-bold transition-all uppercase tracking-widest",
                      selectedColor === color 
                        ? "bg-primary text-base border-primary" 
                        : "border-primary/10 hover:border-primary text-primary/60 hover:text-primary"
                    )}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-widest">Select Size</h3>
                <button 
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-[10px] uppercase tracking-widest text-primary/40 underline underline-offset-4 hover:text-primary transition-colors"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "w-14 h-14 flex items-center justify-center border text-sm font-bold transition-all",
                      selectedSize === size 
                        ? "bg-primary text-base border-primary" 
                        : "border-primary/10 hover:border-primary text-primary/60 hover:text-primary"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.short_description && (
            <div className="pt-2">
              <div 
                className="text-sm text-primary/70 leading-relaxed prose prose-sm"
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            </div>
          )}

          <div className="pt-6 space-y-4">
            <div className="flex gap-2">
              <button 
                onClick={() => handleAddToCart(true)}
                disabled={product.stock_status === 'outofstock'}
                className="flex-1 bg-primary text-base py-5 font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-accent transition-all shadow-xl shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                SECURE PAIR
              </button>
              <button 
                onClick={() => handleAddToCart(false)}
                disabled={product.stock_status === 'outofstock'}
                className="w-[15%] min-w-[60px] bg-primary/5 text-primary border border-primary/10 py-5 flex items-center justify-center hover:bg-primary hover:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Add to Cart"
              >
                <ShoppingCart size={20} />
              </button>
            </div>
            <p className="text-[10px] text-center uppercase tracking-widest text-primary/40">
              Delivery within Accra via third-party services. Cost calculated based on location.
            </p>
          </div>

          {/* Social Share */}
          <div className="pt-6 pb-2 space-y-4 border-t border-primary/10">
            <h3 className="text-xs font-bold uppercase tracking-widest">Share</h3>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => handleShare('whatsapp')} className="w-10 h-10 flex items-center justify-center border border-primary/10 hover:border-primary text-primary/60 hover:text-primary transition-all" title="Share on WhatsApp">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              </button>
              <button onClick={() => handleShare('instagram')} className="w-10 h-10 flex items-center justify-center border border-primary/10 hover:border-primary text-primary/60 hover:text-primary transition-all" title="Share on Instagram">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </button>
              <button onClick={() => handleShare('twitter')} className="w-10 h-10 flex items-center justify-center border border-primary/10 hover:border-primary text-primary/60 hover:text-primary transition-all" title="Share on Twitter">
                <Twitter size={18} />
              </button>
              <button onClick={() => handleShare('facebook')} className="w-10 h-10 flex items-center justify-center border border-primary/10 hover:border-primary text-primary/60 hover:text-primary transition-all" title="Share on Facebook">
                <Facebook size={18} />
              </button>
              <button onClick={() => handleShare('pinterest')} className="w-10 h-10 flex items-center justify-center border border-primary/10 hover:border-primary text-primary/60 hover:text-primary transition-all" title="Share on Pinterest">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12c0 4.3 2.7 8 6.5 9.5-.1-1-.2-2.5 0-3.6.2-.9 1.4-5.8 1.4-5.8s-.3-.7-.3-1.7c0-1.6.9-2.8 2.1-2.8 1 0 1.5.8 1.5 1.7 0 1-.6 2.6-.9 4-.3 1.2.6 2.2 1.8 2.2 2.2 0 3.8-2.3 3.8-5.6 0-2.9-2.1-4.9-5-4.9-3.4 0-5.4 2.5-5.4 5.2 0 1 .4 2.1.9 2.7.1.1.1.2.1.3-.1.4-.3 1.2-.3 1.3-.1.2-.2.3-.4.2-1.5-.7-2.4-2.9-2.4-4.6 0-3.8 2.7-7.2 7.9-7.2 4.2 0 7.4 3 7.4 7 0 4.1-2.6 7.5-6.2 7.5-1.2 0-2.4-.6-2.8-1.4 0 0-.6 2.3-.8 2.9-.2.8-.8 1.8-1.2 2.4 1.1.3 2.3.5 3.5.5 5.5 0 10-4.5 10-10S17.5 2 12 2z"></path></svg>
              </button>
              <button onClick={() => handleShare('copy')} className="w-10 h-10 flex items-center justify-center border border-primary/10 hover:border-primary text-primary/60 hover:text-primary transition-all" title="Copy Link">
                <Link2 size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-primary/10">
            {otherAttributes.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest">The Blueprint</h3>
                <ul className="space-y-3 text-sm text-primary/70">
                  {otherAttributes.map(attr => (
                    <li key={attr.id} className="flex gap-4">
                      <span className="font-bold text-primary min-w-[100px]">{attr.name}</span>
                      <span>{attr.options.join(', ')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.description && (
              <div className="space-y-4">
                <div>
                  <div 
                    className={cn(
                      "text-sm text-primary/70 leading-relaxed prose prose-sm overflow-hidden",
                      !isDescriptionExpanded && "line-clamp-3"
                    )}
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                  <button 
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="mt-3 text-[10px] font-bold uppercase tracking-widest text-primary/60 hover:text-primary transition-colors underline underline-offset-4"
                  >
                    {isDescriptionExpanded ? 'See Less' : 'See More'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Size Guide Slide Panel */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSizeGuideOpen(false)}
              className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-base shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-primary/10">
                <h2 className="text-xl font-display font-black tracking-tighter">Size Guide</h2>
                <button 
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="p-2 hover:bg-primary/5 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-6">
                  <p className="text-sm text-primary/70">
                    Our footwear fits true to size. If you are between sizes, we recommend sizing up for the best fit.
                  </p>
                  
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase tracking-widest text-primary/40 border-b border-primary/10">
                      <tr>
                        <th className="pb-3 font-bold">EU</th>
                        <th className="pb-3 font-bold">US (Men)</th>
                        <th className="pb-3 font-bold">UK</th>
                        <th className="pb-3 font-bold">CM</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/5">
                      {[
                        { eu: '39', us: '6.5', uk: '6', cm: '24.5' },
                        { eu: '40', us: '7', uk: '6.5', cm: '25' },
                        { eu: '41', us: '8', uk: '7.5', cm: '26' },
                        { eu: '42', us: '8.5', uk: '8', cm: '26.5' },
                        { eu: '43', us: '9.5', uk: '9', cm: '27.5' },
                        { eu: '44', us: '10', uk: '9.5', cm: '28' },
                      ].map((row) => (
                        <tr key={row.eu}>
                          <td className="py-3 font-bold">{row.eu}</td>
                          <td className="py-3 text-primary/70">{row.us}</td>
                          <td className="py-3 text-primary/70">{row.uk}</td>
                          <td className="py-3 text-primary/70">{row.cm}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
