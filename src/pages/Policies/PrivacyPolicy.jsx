import React from "react";
import Footer from "../../components/layout/Footer";

const PrivacyPolicy = () => {
  const sections = [
    {
      id: 1,
      title: "Information We Collect",
      content: "We collect personal information that you voluntarily provide when registering, placing an order, subscribing to newsletters, or contacting support. This may include your name, email address, phone number, shipping address, and payment details."
    },
    {
      id: 2,
      title: "How We Use Your Information",
      content: "Your information is used to process transactions, deliver products, provide customer support, send order updates, and improve our services. Marketing communications may be sent with your consent, and you may opt out anytime."
    },
    {
      id: 3,
      title: "Cookies & Tracking Technologies",
      content: "We use cookies to enhance browsing experience, analyze traffic, and understand customer preferences. Disabling cookies may limit certain website functionalities."
    },
    {
      id: 4,
      title: "Sharing of Information",
      content: "We do not sell or rent personal data. Information may be shared with trusted partners such as payment gateways and logistics providers solely for business operations and order fulfillment."
    },
    {
      id: 5,
      title: "Data Security",
      content: "We implement appropriate technical and organizational security measures to protect your information. However, no online transmission method is completely secure."
    },
    {
      id: 6,
      title: "Third-Party Links",
      content: "Our website may contain links to external websites. We are not responsible for their privacy practices and recommend reviewing their respective policies."
    },
    {
      id: 7,
      title: "Your Rights",
      content: "You may request access, correction, or deletion of your personal data. You may also withdraw consent for marketing communications at any time."
    },
    {
      id: 8,
      title: "Policy Updates",
      content: "This Privacy Policy may be updated periodically. Continued use of the website indicates acceptance of any changes made."
    },
    {
      id: 9,
      title: "Contact Us",
      content: (
        <>
          For questions or concerns regarding this policy, please contact our support team through the contact details provided on our website.
          <div className="mt-3 font-bold text-gray-800">
            KaashtKart Marketplace Pvt. Ltd.<br />
            Email : <span className="text-gray-500 font-normal">KaashtKart@gmail.com</span>
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
          Privacy Policy
        </h1>

        <p className="text-gray-500 max-w-3xl mx-auto text-lg leading-relaxed">
          Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information.
        </p>
      </section>

      {/* Content Section */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-8">
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

          {/* Last Updated Box */}
          <div className="mt-16 bg-yellow-50/50 border-l-4 border-[var(--color-secondary)] p-6 rounded-r-lg">
            <p className="text-gray-500 font-medium">
              Last Updated: February 2026
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
