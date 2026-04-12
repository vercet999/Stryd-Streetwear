import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, ShoppingCart } from 'lucide-react';
import { Product, ProductVariation } from '../types';
import { useCartStore } from '../store/cartStore';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import LazyImage from './LazyImage';
import { getProductVariations } from '../services/woocommerce';

export default function QuickViewModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    if (product.type === 'variable') {
      getProductVariations(product.id).then(setVariations);
    }
  }, [product]);

  let sizes = product.attributes.find(a => a.name.toLowerCase() === 'size')?.options || [];
  const colors = product.attributes.find(a => ['color', 'colour'].includes(a.name.toLowerCase()))?.options || [];

  if (product.type === 'variable' && variations.length > 0 && selectedColor) {
    const availableSizes = new Set<string>();
    variations.forEach(variation => {
      const colorAttr = variation.attributes.find(a => ['color', 'colour'].includes(a.name.toLowerCase()));
      if (colorAttr && colorAttr.option === selectedColor) {
        const sizeAttr = variation.attributes.find(a => a.name.toLowerCase() === 'size');
        if (sizeAttr && variation.stock_status !== 'outofstock') {
          availableSizes.add(sizeAttr.option);
        }
      }
    });
    if (availableSizes.size > 0) {
      sizes = Array.from(availableSizes);
    } else {
      sizes = [];
    }
  }

  useEffect(() => {
    if (selectedSize && sizes.length > 0 && !sizes.includes(selectedSize)) {
      setSelectedSize('');
    }
  }, [sizes, selectedSize]);

  let currentStockStatus = product.stock_status;
  if (product.type === 'variable' && variations.length > 0 && selectedColor) {
    if (selectedSize) {
      const selectedVariation = variations.find(variation => {
        const colorAttr = variation.attributes.find(a => ['color', 'colour'].includes(a.name.toLowerCase()));
        const sizeAttr = variation.attributes.find(a => a.name.toLowerCase() === 'size');
        return colorAttr?.option === selectedColor && sizeAttr?.option === selectedSize;
      });
      if (selectedVariation) {
        currentStockStatus = selectedVariation.stock_status;
      }
    } else {
      const hasInStockVariation = variations.some(variation => {
        const colorAttr = variation.attributes.find(a => ['color', 'colour'].includes(a.name.toLowerCase()));
        return colorAttr?.option === selectedColor && variation.stock_status !== 'outofstock';
      });
      if (!hasInStockVariation) {
        currentStockStatus = 'outofstock';
      }
    }
  }

  let displayName = product.name;
  if (selectedColor) {
    displayName = `${product.name} — ${selectedColor.toUpperCase()}`;
  }

  let displayImage = product.images[0]?.src || 'https://stryd.visoirejewels.com/wp-content/uploads/2026/04/stryd-model-01.webp';
  if (selectedColor && variations.length > 0) {
    const variationWithColor = variations.find(v => v.attributes.some(a => ['color', 'colour'].includes(a.name.toLowerCase()) && a.option === selectedColor));
    if (variationWithColor && variationWithColor.image && variationWithColor.image.src) {
      displayImage = variationWithColor.image.src;
    }
  }

  const handleAddToCart = () => {
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
    
    toast.success(`${displayName} added to cart!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-base rounded-[5px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-base/80 backdrop-blur-sm rounded-full text-primary/60 hover:text-primary transition-colors"
        >
          <X size={20} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 bg-[#0A0A0A]/5 dark:bg-[#F5F5F5] aspect-square md:aspect-auto relative">
          <LazyImage 
            src={displayImage} 
            alt={displayName}
            className="w-full h-full object-contain mix-blend-multiply p-8"
            containerClassName="absolute inset-0 w-full h-full bg-transparent"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
          <div className="space-y-2 mb-6">
            <h2 className="text-2xl md:text-3xl font-display font-black tracking-tighter uppercase">
              {displayName}
            </h2>
            <p className="text-xl font-bold">₵{parseFloat(product.price).toFixed(2)}</p>
          </div>

          <div className="space-y-6 flex-1">
            {colors.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest">Choose Colour</h3>
                <div className="flex flex-wrap gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "px-4 py-2 border text-sm font-bold transition-all",
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

            {sizes.length > 0 && (colors.length === 0 || selectedColor) && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3 overflow-hidden"
              >
                <h3 className="text-xs font-bold uppercase tracking-widest pt-2">Select Size</h3>
                <div className="flex flex-wrap gap-2 pb-2">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "w-12 h-12 flex items-center justify-center border text-sm font-bold transition-all",
                        selectedSize === size 
                          ? "bg-primary text-base border-primary" 
                          : "border-primary/10 hover:border-primary text-primary/60 hover:text-primary"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {product.short_description && (
              <div 
                className="text-sm text-primary/70 leading-relaxed prose prose-sm line-clamp-3"
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            )}
          </div>

          <div className="pt-8 mt-auto space-y-4">
            <button 
              onClick={handleAddToCart}
              disabled={currentStockStatus === 'outofstock'}
              className="w-full bg-primary text-base py-4 font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-accent transition-all shadow-xl shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={18} />
              {currentStockStatus === 'outofstock' ? 'SOLD OUT' : 'ADD TO CART'}
            </button>
            <Link 
              to={`/piece/${product.slug}`}
              onClick={onClose}
              className="block text-center text-xs font-bold uppercase tracking-widest text-primary/60 hover:text-primary transition-colors underline underline-offset-4"
            >
              View Full Details
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
