import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 space-y-12">
      <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/40 mb-8 flex-wrap">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight size={14} />
        <span className="text-primary">Terms & Conditions</span>
      </nav>

      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter uppercase">Terms & Conditions</h1>
        <p className="text-primary/60">Last updated: April 2026</p>
      </div>

      <div className="prose prose-sm md:prose-base prose-neutral dark:prose-invert max-w-none space-y-12">
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black tracking-tighter uppercase border-b border-primary/10 pb-4">1. Delivery Information</h2>
          <div className="space-y-4 text-primary/80 leading-relaxed">
            <p>At STRYD GH, we strive to get your pieces to you as quickly and securely as possible.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Flat Rate Delivery:</strong> We charge a flat delivery fee of <strong>₵50</strong> for all orders across Ghana, regardless of the order size or weight.</li>
              <li><strong>Store Pickup:</strong> You can opt to pick up your order from our physical location at no additional cost.</li>
              <li><strong>Processing Time:</strong> Orders are typically processed and dispatched within 1-2 business days.</li>
              <li><strong>Delivery Timeframes:</strong> Standard delivery within Accra takes 1-2 business days. Deliveries outside Accra may take 3-5 business days depending on the exact location.</li>
              <li><strong>Tracking:</strong> Once your order is dispatched, you will receive a WhatsApp message or email with your delivery details and tracking information.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black tracking-tighter uppercase border-b border-primary/10 pb-4">2. Return & Exchange Policy</h2>
          <div className="space-y-4 text-primary/80 leading-relaxed">
            <p>We want you to be completely satisfied with your purchase. If for any reason you are not, we offer a straightforward return and exchange policy.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Eligibility:</strong> Items must be returned within <strong>7 days</strong> of the delivery date. They must be unworn, unwashed, and in their original condition with all tags and packaging intact.</li>
              <li><strong>Exchanges:</strong> We offer free exchanges for size or color variations, subject to stock availability.</li>
              <li><strong>Refunds:</strong> Refunds are processed to the original payment method within 3-5 business days after we receive and inspect the returned item. Please note that the original delivery fee is non-refundable.</li>
              <li><strong>How to Return:</strong> To initiate a return or exchange, please contact our support team via WhatsApp or email with your order number and reason for return.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black tracking-tighter uppercase border-b border-primary/10 pb-4">3. Payment Security & Reassurance</h2>
          <div className="space-y-4 text-primary/80 leading-relaxed">
            <p>Your security is our top priority. We have partnered with industry-leading payment processors to ensure your data is safe.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Secure Processing:</strong> All payments are securely processed through <strong>Paystack</strong>, a PCI-DSS certified payment gateway.</li>
              <li><strong>Data Protection:</strong> We do not store your credit card details or mobile money PINs on our servers. All sensitive payment information is encrypted and handled directly by Paystack.</li>
              <li><strong>Accepted Methods:</strong> We accept all major credit/debit cards, Mobile Money (MTN, Vodafone, AirtelTigo), and Apple Pay.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black tracking-tighter uppercase border-b border-primary/10 pb-4">4. General Terms</h2>
          <div className="space-y-4 text-primary/80 leading-relaxed">
            <p>By accessing and placing an order with STRYD GH, you confirm that you are in agreement with and bound by the terms of service contained herein.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Product Availability:</strong> All orders are subject to availability. If an item is out of stock after you place an order, we will notify you immediately and offer a full refund or an alternative item.</li>
              <li><strong>Pricing:</strong> All prices are listed in Ghanaian Cedi (GHS). We reserve the right to modify prices without prior notice, but changes will not affect orders already placed.</li>
              <li><strong>Intellectual Property:</strong> All content on this website, including images, text, and logos, is the property of STRYD GH and may not be used without explicit permission.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
