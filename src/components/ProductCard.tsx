import { Link } from 'react-router-dom';
import { Product } from '../types';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Eye } from 'lucide-react';

export default function ProductCard({ product, onQuickView }: { product: Product; key?: any; onQuickView?: (product: Product) => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="block space-y-4 relative">
        <Link to={`/piece/${product.slug}`} className="block aspect-square overflow-hidden bg-[#0A0A0A]/5 dark:bg-[#F5F5F5] relative rounded-[5px]">
          <img
            src={product.images[0]?.src || 'https://stryd.visoirejewels.com/wp-content/uploads/2026/04/stryd-model-01.webp'}
            alt={product.images[0]?.alt || product.name}
            className={cn(
              "absolute inset-0 w-full h-full object-contain mix-blend-multiply transition-opacity duration-500 ease-in-out",
              product.images.length > 1 ? "group-hover:opacity-0" : "group-hover:opacity-80"
            )}
            referrerPolicy="no-referrer"
          />
          {product.images.length > 1 && (
            <img
              src={product.images[1]?.src}
              alt={product.images[1]?.alt || product.name}
              className="absolute inset-0 w-full h-full object-contain mix-blend-multiply transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100"
              referrerPolicy="no-referrer"
            />
          )}
          {product.on_sale && (
            <span className="absolute top-4 left-4 bg-accent text-base text-[10px] font-bold uppercase px-2 py-1 tracking-widest z-10">
              Sale
            </span>
          )}
          {product.stock_status === 'outofstock' && (
            <span className="absolute top-4 right-4 bg-base/90 backdrop-blur-sm text-primary/70 text-[10px] font-bold uppercase px-3 py-1 tracking-widest z-10">
              Sold Out
            </span>
          )}
        </Link>
        
        {onQuickView && (
          <div className="absolute inset-x-0 bottom-[51px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex justify-center pointer-events-none">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="group/qv flex items-center bg-base/90 backdrop-blur-md text-primary p-3 rounded-full hover:bg-primary hover:text-base transition-all duration-300 shadow-lg pointer-events-auto"
              title="Quick View"
            >
              <Eye size={18} className="shrink-0" />
              <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover/qv:max-w-[120px] group-hover/qv:ml-2 transition-all duration-300 text-[10px] font-bold uppercase tracking-widest">
                Quick View
              </span>
            </button>
          </div>
        )}
        
        <Link to={`/piece/${product.slug}`} className="block space-y-1">
          <h3 className="text-sm font-bold uppercase tracking-tight group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          <p className="text-sm font-medium text-primary/60">
            ₵{parseFloat(product.price).toFixed(2)}
          </p>
        </Link>
      </div>
    </motion.div>
  );
}
