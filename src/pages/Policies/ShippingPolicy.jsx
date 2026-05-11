import React from "react";
import Footer from "../../components/layout/Footer";

const ShippingPolicy = () => {
  const sections = [
    {
      id: 1,
      title: "Order Processing",
      content: "All orders are processed within 1-2 business days after order confirmation. Orders placed on weekends or public holidays will be processed on the next working day."
    },
    {
      id: 2,
      title: "Shipping Locations",
      content: "We currently ship across India. Delivery to remote or rural locations may take additional time depending on courier service availability."
    },
    {
      id: 3,
      title: "Estimated Delivery Time",
      content: "Estimated delivery time is typically 3-7 business days from the date of dispatch. Delivery timelines may vary due to factors beyond our control, including weather conditions, courier delays, or regional restrictions."
    },
    {
      id: 4,
      title: "Shipping Charges",
      content: "Shipping charges, if applicable, will be calculated and displayed at checkout. Any promotional free-shipping offers are subject to terms and conditions."
    },
    {
      id: 5,
      title: "Order Tracking",
      content: "Once your order is shipped, you will receive a tracking number via email or SMS to monitor the delivery status of your package."
    },
    {
      id: 6,
      title: "Delays & Exceptions",
      content: "While we strive to deliver orders on time, unforeseen delays may occur due to courier issues, natural events, or operational constraints. We are not responsible for delays caused by external service providers."
    },
    {
      id: 7,
      title: "Damaged or Missing Items",
      content: "If your order arrives damaged or with missing items, please contact our support team within 48 hours of delivery with relevant order details and photographs, where applicable."
    },
    {
      id: 8,
      title: "Incorrect Address",
      content: "Customers are responsible for providing accurate shipping information. We are not liable for delivery failures caused by incorrect or incomplete addresses provided at the time of checkout."
    },
    {
      id: 9,
      title: "Contact Information",
      content: "For any questions regarding shipping or delivery, please reach out to our customer support team using the contact details available on our website."
    }
  ];

  return (
    <div className="bg-[var(--color-primary)] min-h-screen">
      {/* Header */}
      <section className="relative py-16 px-8 text-center bg-gradient-to-b from-yellow-50 to-transparent">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-secondary)] mb-4 font-[var(--font-heading)]">
          Shipping Policy
        </h1>
        <p className="text-gray-500 max-w-3xl mx-auto text-lg leading-relaxed">
          This Shipping Policy outlines our order processing, delivery timelines, and shipping procedures for orders placed on the platform.
        </p>
      </section>

      {/* Content Section */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12">
          <div className="mb-10">
            <p className="text-sm font-bold text-gray-700 italic">Effective Date: 01-Jan-2026</p>
          </div>

          <div className="space-y-10">
            {sections.map((section) => (
              <div key={section.id} className="group">
                <h2 className="text-xl font-bold text-yellow-500 mb-3 flex items-start gap-2">
                  <span className="shrink-0">{section.id}.</span>
                  <span>{section.title}</span>
                </h2>
                <div className="text-gray-600 leading-relaxed pl-7 text-[15px]">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ShippingPolicy;
