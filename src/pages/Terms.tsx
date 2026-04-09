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
            <p>We are committed to getting your pieces to you safely and efficiently. Please note our current delivery parameters:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Delivery Area:</strong> We currently only deliver within Accra. Nationwide delivery is not available at this time.</li>
              <li><strong>Third-Party Services:</strong> We do not operate an in-house delivery fleet. All deliveries are fulfilled via trusted third-party ride-hailing services such as Bolt, Uber, or Yango.</li>
              <li><strong>Delivery Costs:</strong> Delivery costs are not fixed. Once your order is placed, our team will contact you directly to confirm your exact location and provide a delivery quote based on the distance. The delivery fee is to be paid directly to the rider upon arrival.</li>
              <li><strong>Store Pickup:</strong> You may choose to pick up your order from our physical location at no additional cost.</li>
              <li><strong>Delays:</strong> While we ensure your order is dispatched promptly, STRYD GH is not responsible for any delays, traffic issues, or unforeseen circumstances caused by third-party delivery services.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black tracking-tighter uppercase border-b border-primary/10 pb-4">2. Return & Exchange Policy</h2>
          <div className="space-y-4 text-primary/80 leading-relaxed">
            <p>We want you to be confident in your purchase. If a piece does not meet your expectations, our return policy is designed to be fair and straightforward.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>48-Hour Window:</strong> Returns and exchanges are strictly accepted only within 2 days (48 hours) of the delivery time. No returns or exchanges will be processed after this period has passed.</li>
              <li><strong>Condition of Items:</strong> To be eligible for a return, items must be entirely unworn, unwashed, and in their original condition with all tags and packaging intact.</li>
              <li><strong>Protection Against Misuse:</strong> We reserve the right to reject any return request if the item shows signs of wear, alteration, or damage caused by the customer.</li>
              <li><strong>Delivery Fees:</strong> Please note that all delivery fees are strictly non-refundable. If you request an exchange, you will be responsible for the delivery costs associated with the new item.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black tracking-tighter uppercase border-b border-primary/10 pb-4">3. Failed Deliveries</h2>
          <div className="space-y-4 text-primary/80 leading-relaxed">
            <p>Smooth delivery requires coordination. If a delivery attempt fails due to customer unavailability or an incorrect location provided, the following applies:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Extra Charges:</strong> If the rider arrives at the destination and you are unreachable, any additional waiting fees or return trip costs charged by the rider will be your responsibility.</li>
              <li><strong>Rescheduling:</strong> A new delivery can be arranged, but you will be required to cover the full cost of the second delivery attempt.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black tracking-tighter uppercase border-b border-primary/10 pb-4">4. Order Accuracy</h2>
          <div className="space-y-4 text-primary/80 leading-relaxed">
            <p>Accuracy ensures a seamless experience.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Customer Responsibility:</strong> It is your responsibility to provide the correct delivery address, landmarks, and an active phone number during checkout.</li>
              <li><strong>Corrections:</strong> If you notice an error in your details after placing an order, please contact us immediately. Once a rider has been dispatched, we cannot alter the destination without incurring additional charges.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black tracking-tighter uppercase border-b border-primary/10 pb-4">5. Payment Security</h2>
          <div className="space-y-4 text-primary/80 leading-relaxed">
            <p>We take your financial security seriously.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Secure Processing:</strong> All online payments are securely processed through Paystack, a globally recognised and PCI-DSS certified payment gateway.</li>
              <li><strong>Data Protection:</strong> STRYD GH does not store your credit card details or mobile money PINs. All sensitive payment data is encrypted and managed entirely by our payment processor.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black tracking-tighter uppercase border-b border-primary/10 pb-4">6. General Terms</h2>
          <div className="space-y-4 text-primary/80 leading-relaxed">
            <p>By placing an order with STRYD GH, you agree to the following operational terms:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Product Availability:</strong> All orders are subject to stock availability. If an item becomes unavailable after your order is placed, we will notify you promptly to arrange a refund or an alternative.</li>
              <li><strong>Pricing:</strong> Prices are listed in Ghanaian Cedi (GHS). We reserve the right to adjust pricing at our discretion, though this will not affect orders that have already been confirmed.</li>
              <li><strong>Order Cancellations:</strong> We reserve the right to cancel any order if we suspect fraudulent activity, if there is a pricing error, or if the customer exhibits abusive behaviour towards our staff.</li>
              <li><strong>Suspicious Orders:</strong> We may refuse or request additional verification for orders that appear suspicious or violate our terms.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black tracking-tighter uppercase border-b border-primary/10 pb-4">7. Liability Disclaimer</h2>
          <div className="space-y-4 text-primary/80 leading-relaxed">
            <p>To the maximum extent permitted by law, STRYD GH limits its liability in connection with the use of our products and services.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Product Misuse:</strong> We are not liable for any damages, injuries, or losses resulting from the improper use or care of our products.</li>
              <li><strong>Service Interruptions:</strong> We do not guarantee that our website will be completely free of errors or interruptions.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black tracking-tighter uppercase border-b border-primary/10 pb-4">8. Changes to Terms</h2>
          <div className="space-y-4 text-primary/80 leading-relaxed">
            <p>We reserve the right to update, modify, or replace any part of these Terms & Conditions at any time. It is your responsibility to check this page periodically for changes. Your continued use of the website following the posting of any changes constitutes acceptance of those changes.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
