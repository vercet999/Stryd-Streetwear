import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Trash2, Plus, Minus, ChevronLeft, ArrowRight } from 'lucide-react';
import { usePaystackPayment } from 'react-paystack';
import { useCartStore } from '../store/cartStore';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 300 ? 0 : 20; // ₵20 flat rate if under ₵300
  const total = subtotal + deliveryFee;

  const config = {
    reference: (new Date()).getTime().toString(),
    email: "customer@example.com", // In a real app, get this from user input/auth
    amount: total * 100, // Paystack amount is in pesewas (kobo)
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '', // Replace with real public key
    currency: 'GHS',
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference: any) => {
    console.log(reference);
    alert('Payment successful! Reference: ' + reference.reference);
    clearCart();
  };

  const onClose = () => {
    console.log('Payment closed');
  };

  const handleCheckout = () => {
    if (!config.publicKey) {
      alert("Please configure your Paystack Public Key in the environment variables (VITE_PAYSTACK_PUBLIC_KEY).");
      return;
    }
    initializePayment({ onSuccess, onClose });
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-6">
        <h1 className="text-4xl font-display font-black tracking-tighter">Your Cart is Empty</h1>
        <p className="text-primary/60">Looks like you haven't added any items to your cart yet.</p>
        <Link to="/shop" className="inline-block bg-primary text-base px-8 py-3 font-bold uppercase tracking-widest hover:bg-accent transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-8 hover:text-accent transition-colors">
        <ChevronLeft size={16} /> Continue Shopping
      </Link>

      <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter mb-12">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-8 space-y-6">
          {items.map((item, index) => (
            <motion.div 
              key={`${item.product.id}-${item.size}-${item.color}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 md:gap-6 p-4 border border-primary/10 rounded-[5px]"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 bg-[#0A0A0A]/5 dark:bg-[#F5F5F5] rounded-[5px] overflow-hidden shrink-0">
                <img 
                  src={item.product.images[0]?.src || '/assets/stryd-model-01.webp'} 
                  alt={item.product.name}
                  className="w-full h-full object-contain mix-blend-multiply"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-bold uppercase tracking-tight">{item.product.name}</h3>
                    <div className="text-xs text-primary/60 mt-1 space-y-1">
                      {item.size && <p>Size: {item.size}</p>}
                      {item.color && <p>Color: {item.color}</p>}
                    </div>
                  </div>
                  <p className="font-bold">₵{parseFloat(item.product.price).toFixed(2)}</p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center border border-primary/20 rounded-[5px]">
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.size, item.color)}
                      className="p-2 hover:bg-primary/5 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.size, item.color)}
                      className="p-2 hover:bg-primary/5 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.product.id, item.size, item.color)}
                    className="text-primary/40 hover:text-red-500 transition-colors p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-primary/5 p-6 rounded-[5px] space-y-6 sticky top-24">
            <h2 className="text-xl font-bold uppercase tracking-widest border-b border-primary/10 pb-4">Order Summary</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-primary/70">Subtotal</span>
                <span className="font-bold">₵{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary/70">Delivery</span>
                <span className="font-bold">
                  {deliveryFee === 0 ? 'Free' : `₵${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              {deliveryFee > 0 && (
                <p className="text-[10px] text-primary/50 text-right">
                  Add ₵{(300 - subtotal).toFixed(2)} more for free delivery
                </p>
              )}
            </div>

            <div className="border-t border-primary/10 pt-4 flex justify-between items-center">
              <span className="font-bold uppercase tracking-widest">Total</span>
              <span className="text-2xl font-black">₵{total.toFixed(2)}</span>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full bg-primary text-base py-4 font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-accent transition-colors"
            >
              Checkout <ArrowRight size={18} />
            </button>
            
            <div className="flex items-center justify-center gap-2 pt-4 opacity-50">
              {/* Placeholder for payment method icons */}
              <span className="text-[10px] font-bold uppercase tracking-widest">Secured by Paystack</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
