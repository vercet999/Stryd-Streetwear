import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductBySlug } from '../services/woocommerce';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ShoppingCart, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useCartStore } from '../store/cartStore';

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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex justify-center">
        <div className="w-12 h-12 border-4 border-primary/10 border-t-accent rounded-full animate-spin" />
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

  const handleAddToCart = () => {
    if (!product) return;
    
    // If there are sizes/colors available, ensure they are selected
    if (sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }
    if (colors.length > 0 && !selectedColor) {
      alert('Please select a color');
      return;
    }

    addItem({
      product,
      quantity: 1,
      size: selectedSize || undefined,
      color: selectedColor || undefined
    });
    
    // Optional: show a success message or open cart drawer
    alert('Added to cart!');
  };

  const sizes = product.attributes.find(a => a.name.toLowerCase() === 'size')?.options || [];
  const colors = product.attributes.find(a => a.name.toLowerCase() === 'color')?.options || [];
  const brandAttr = product.attributes.find(a => a.name.toLowerCase() === 'brand')?.options?.[0];
  const brandName = product.brands?.[0]?.name || brandAttr || 'STRYD';
  const otherAttributes = product.attributes.filter(a => !['size', 'color', 'brand'].includes(a.name.toLowerCase()) && a.visible);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-8 hover:text-accent transition-colors">
        <ChevronLeft size={16} /> Back to Collection
      </Link>

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
          <motion.div 
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="aspect-square bg-[#0A0A0A]/5 dark:bg-[#F5F5F5] flex-1 min-w-0 rounded-[5px] overflow-hidden flex items-center justify-center order-1 md:order-2 relative cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img 
              src={product.images[selectedImage]?.src || product.images[0]?.src || '/assets/stryd-model-01.webp'} 
              alt={product.name} 
              className="w-full h-full object-contain mix-blend-multiply transition-transform duration-200 ease-out"
              style={zoomStyle}
              referrerPolicy="no-referrer"
            />
          </motion.div>
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
                onClick={handleAddToCart}
                disabled={product.stock_status === 'outofstock'}
                className="w-full bg-primary text-base py-5 font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-accent transition-all shadow-xl shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                SECURE PAIR
              </button>
            </div>
            <p className="text-[10px] text-center uppercase tracking-widest text-primary/40">
              Free delivery on all orders over ₵300.
            </p>
          </div>

          <div className="space-y-6 pt-8 border-t border-primary/10">
            {otherAttributes.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest">Details</h3>
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
                <h3 className="text-xs font-bold uppercase tracking-widest">More Info</h3>
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
