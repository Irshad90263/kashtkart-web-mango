import React from "react";
import Footer from "../../components/layout/Footer";

const CancellationPolicy = () => {
  const sections = [
    {
      id: 1,
      title: "Order Cancellation",
      content: "Customers can cancel their orders anytime before they are processed or shipped. Once an order has been dispatched, it cannot be cancelled. To cancel an order, please visit the 'My Orders' section or contact our support team immediately."
    },
    {
      id: 2,
      title: "Fresh Produce (Mangoes) Return Policy",
      content: "Due to the perishable nature of fresh mangoes, returns are generally not accepted. However, if you receive a box with significant damage or spoiled fruit, please report it within 12 hours of delivery with clear photographs. We will provide a partial or full refund/replacement after quality verification."
    },
    {
      id: 3,
      title: "Packaged Goods Return Policy",
      content: "Non-perishable items like Mango or other processed products can be returned within 7 days of delivery if the packaging is unopened and the seal is intact. Items with broken seals or signs of use are not eligible for return."
    },
    {
      id: 4,
      title: "Refund Process",
      content: "Approved refunds are processed within 5-7 working days. The amount will be credited back to the original payment method (Bank Account, UPI, or Wallet) used during the transaction."
    },
    {
      id: 5,
      title: "Conditions for Return",
      content: "Items must be in their original packaging with all tags and invoices included. Returns will only be accepted for manufacturing defects, transit damage, or if the wrong product was delivered."
    },
    {
      id: 6,
      title: "Shipping Charges for Returns",
      content: "In cases of damaged or wrong products, KaashtKart will bear the return shipping costs. For other eligible returns, the customer may be responsible for the return shipping fees."
    },
    {
      id: 7,
      title: "Contact for Returns/Cancellations",
      content: (
        <>
          For any assistance regarding your order status, please reach out to us:
          <div className="mt-3 font-bold text-gray-800">
            Support Email : <span className="text-gray-500 font-normal">support@kaashtkart.com</span><br />
            Helpline : <span className="text-gray-500 font-normal">+91 83188 99526</span>
          </div>
        </>
      )
    }
  ];

  return (
    <div className="bg-[var(--color-primary)] min-h-screen">
      {/* Header */}
      <section className="relative py-16 px-8 text-center bg-gradient-to-b from-yellow-50 to-transparent">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-secondary)] mb-4 font-[var(--font-heading)]">
          Cancellation & Returns
        </h1>
        <p className="text-gray-500 max-w-3xl mx-auto text-lg leading-relaxed">
          We want you to have the best experience with our fresh farm produce. Here is how we handle order changes and returns.
        </p>
      </section>

      {/* Content Section */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12">
          <div className="space-y-10">
            {sections.map((section) => (
              <div key={section.id} className="group">
                <h2 className="text-xl font-bold text-[var(--color-secondary)] mb-3 flex items-start gap-2">
                  <span className="shrink-0">{section.id}.</span>
                  <span>{section.title}</span>
                </h2>
                <div className="text-gray-600 leading-relaxed pl-7 text-[15px]">
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          {/* Note Box */}
          <div className="mt-16 bg-yellow-50/50 border-l-4 border-[var(--color-secondary)] p-6 rounded-r-lg">
            <p className="text-gray-600 text-sm italic">
              Note: Freshness is our priority. Since mangoes are seasonal and natural, slight variations in size or color are normal and not considered defects.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CancellationPolicy;
