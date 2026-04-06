import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface LocationState {
  orderId: number;
  orderNumber: string;
  paystackRef: string;
}

export default function OrderSuccess() {
  const location = useLocation();
  const state = location.state as LocationState;

  if (!state || !state.orderId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-base border border-primary/10 p-8 rounded-[5px] shadow-2xl text-center space-y-6"
      >
        <div className="flex justify-center">
          <CheckCircle2 size={64} className="text-[#2D6A4F]" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-display font-black tracking-tighter">Order Confirmed</h1>
          <p className="text-primary/60 text-sm">Thank you for your purchase.</p>
        </div>

        <div className="bg-primary/5 p-4 rounded-[5px] space-y-3 text-left">
          <div className="flex justify-between items-center border-b border-primary/10 pb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-primary/40">Order Number</span>
            <span className="font-mono font-bold">#{state.orderNumber}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary/40">Payment Ref</span>
            <span className="font-mono text-xs">{state.paystackRef}</span>
          </div>
        </div>

        <div className="text-sm text-primary/70 leading-relaxed">
          <p>We've received your order and payment.</p>
          <p className="mt-2 font-medium">You will receive a WhatsApp message shortly to confirm your delivery details.</p>
        </div>

        <div className="pt-4">
          <Link 
            to="/shop"
            className="w-full bg-primary text-base py-4 font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-accent transition-colors"
          >
            Continue Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
