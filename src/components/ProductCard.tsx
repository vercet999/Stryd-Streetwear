import { Link } from 'react-router-dom';
import { Product } from '../types';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function ProductCard({ product }: { product: Product; key?: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link to={`/product/${product.slug}`} className="block space-y-4">
        <div className="aspect-square overflow-hidden bg-[#0A0A0A]/5 dark:bg-[#F5F5F5] relative rounded-[5px]">
          <img
            src={product.images[0]?.src || '/assets/stryd-model-01.webp'}
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
        </div>
        
        <div className="space-y-1">
          <h3 className="text-sm font-bold uppercase tracking-tight group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          <p className="text-sm font-medium text-primary/60">
            ₵{parseFloat(product.price).toFixed(2)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
