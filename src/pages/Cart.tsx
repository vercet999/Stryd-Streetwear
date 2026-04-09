import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Trash2, Plus, Minus, ChevronLeft, ArrowRight } from 'lucide-react';
import { usePaystackPayment } from 'react-paystack';
import { toast } from 'react-hot-toast';
import { useCartStore } from '../store/cartStore';
import { createWooCommerceOrder, BillingInfo } from '../services/orderService';
import LazyImage from '../components/LazyImage';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const subtotal = getTotalPrice();
  
  const [isDelivery, setIsDelivery] = useState(true);
  const deliveryFee = 0; // Calculated after order
  const total = subtotal + deliveryFee;

  const [billing, setBilling] = useState<BillingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '+233',
    address: '',
    city: 'Accra'
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBilling(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    const requiredFields = isDelivery 
      ? ['firstName', 'lastName', 'email', 'phone', 'address', 'city']
      : ['firstName', 'lastName', 'email', 'phone'];
      
    return requiredFields.every(field => {
      const val = billing[field as keyof BillingInfo];
      return typeof val === 'string' && val.trim() !== '';
    });
  };

  const config = {
    reference: (new Date()).getTime().toString(),
    email: billing.email || "customer@example.com",
    amount: total * 100, // Paystack amount is in pesewas (kobo)
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '',
    currency: 'GHS',
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = async (transaction: { reference: string }) => {
    setIsProcessing(true);
    const loadingToast = toast.loading('Confirming your order...');
    
    try {
      // Map cart items to WooCommerce line_items format
      const lineItems = items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        // If you have variations mapped, add variation_id here
      }));

      // Create the order in WooCommerce
      const order = await createWooCommerceOrder(
        {
          ...billing,
          address: isDelivery ? billing.address : 'Store Pickup',
          city: isDelivery ? billing.city : 'N/A'
        },
        lineItems,
        transaction.reference,
        total
      );

      toast.success('Order confirmed!', { id: loadingToast });
      
      // Clear the cart
      clearCart();

      // Navigate to a success page, passing the order details
      navigate('/order-success', {
        state: {
          orderId: order.orderId,
          orderNumber: order.orderNumber,
          paystackRef: order.paystackRef,
        }
      });

    } catch (error: any) {
      console.error('Order creation failed:', error);
      toast.error(
        `Payment successful but order recording failed: ${error.message}. Please contact support with reference ${transaction.reference}.`,
        { id: loadingToast, duration: 8000 }
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const onClose = () => {
    toast('Payment cancelled');
  };

  const handleCheckout = () => {
    if (!config.publicKey) {
      toast.error("Payment system is currently unavailable. Please try again later.");
      return;
    }
    if (!isFormValid()) {
      toast.error("Please fill in all required billing and delivery details.");
      return;
    }
    initializePayment({ onSuccess, onClose });
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-display font-black tracking-tighter uppercase">Your Cart is Empty</h1>
          <p className="text-primary/60">Looks like you haven't added any items to your cart yet.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/shop" className="w-full sm:w-auto bg-primary text-base px-8 py-4 font-bold uppercase tracking-widest hover:bg-accent transition-colors">
            Start Shopping
          </Link>
          <Link to="/shop?sort=best-selling" className="w-full sm:w-auto bg-primary/5 text-primary border border-primary/10 px-8 py-4 font-bold uppercase tracking-widest hover:bg-primary hover:text-base transition-colors">
            Shop Best Sellers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-8 hover:text-accent transition-colors">
        <ChevronLeft size={16} /> Continue Shopping
      </Link>

      <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter mb-12">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Cart Items */}
        <div className="lg:col-span-7 space-y-6 lg:sticky lg:top-24">
          {items.map((item, index) => (
            <motion.div 
              key={`${item.product.id}-${item.size}-${item.color}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 md:gap-6 p-4 border border-primary/10 rounded-[5px]"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 bg-[#0A0A0A]/5 dark:bg-[#F5F5F5] rounded-[5px] overflow-hidden shrink-0 relative">
                <LazyImage 
                  src={item.product.images[0]?.src || 'https://stryd.visoirejewels.com/wp-content/uploads/2026/04/stryd-model-01.webp'} 
                  alt={item.product.name}
                  className="w-full h-full object-contain mix-blend-multiply"
                  containerClassName="absolute inset-0 w-full h-full bg-transparent"
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
                      disabled={isProcessing}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.size, item.color)}
                      className="p-2 hover:bg-primary/5 transition-colors"
                      disabled={isProcessing}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.product.id, item.size, item.color)}
                    className="text-primary/40 hover:text-red-500 transition-colors p-2"
                    disabled={isProcessing}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Checkout Section */}
        <div className="lg:col-span-5 space-y-8">
          {/* Billing Form */}
          <div className="bg-primary/5 p-6 rounded-[5px] space-y-6">
            <div className="flex justify-between items-center border-b border-primary/10 pb-4">
              <h2 className="text-xl font-bold uppercase tracking-widest">
                {isDelivery ? 'Delivery Details' : 'Customer Details'}
              </h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isDelivery}
                  onChange={(e) => setIsDelivery(e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-xs font-bold uppercase tracking-widest text-primary/60">Need Delivery?</span>
              </label>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-primary/60">First Name</label>
                  <input 
                    type="text" 
                    name="firstName"
                    value={billing.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-base border border-primary/20 rounded-[5px] px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-primary/60">Last Name</label>
                  <input 
                    type="text" 
                    name="lastName"
                    value={billing.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-base border border-primary/20 rounded-[5px] px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-primary/60">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={billing.email}
                  onChange={handleInputChange}
                  className="w-full bg-base border border-primary/20 rounded-[5px] px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-primary/60">Phone</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={billing.phone}
                  onChange={handleInputChange}
                  className="w-full bg-base border border-primary/20 rounded-[5px] px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>

              {isDelivery && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-primary/60">Delivery Address</label>
                    <input 
                      type="text" 
                      name="address"
                      value={billing.address}
                      onChange={handleInputChange}
                      className="w-full bg-base border border-primary/20 rounded-[5px] px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                      required={isDelivery}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-primary/60">City</label>
                    <input 
                      type="text" 
                      name="city"
                      value={billing.city}
                      onChange={handleInputChange}
                      className="w-full bg-base border border-primary/20 rounded-[5px] px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                      required={isDelivery}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-primary/5 p-6 rounded-[5px] space-y-6">
            <h2 className="text-xl font-bold uppercase tracking-widest border-b border-primary/10 pb-4">Order Summary</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-primary/70">Subtotal</span>
                <span className="font-bold">₵{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-primary/70">Delivery</span>
                <span className="font-bold text-right">
                  {!isDelivery ? 'Store Pickup' : (
                    <span className="text-[10px] text-primary/60 uppercase tracking-widest">
                      Calculated after order<br/>(Paid to rider)
                    </span>
                  )}
                </span>
              </div>
            </div>

            <div className="border-t border-primary/10 pt-4 flex justify-between items-center">
              <span className="font-bold uppercase tracking-widest">Total</span>
              <span className="text-2xl font-black">₵{total.toFixed(2)}</span>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={!isFormValid() || isProcessing}
              className="w-full bg-primary text-base py-4 font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Checkout'} <ArrowRight size={18} />
            </button>
            
            <div className="flex items-center justify-center gap-2 pt-4 opacity-50">
              <span className="text-[10px] font-bold uppercase tracking-widest">Secured by Paystack</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
