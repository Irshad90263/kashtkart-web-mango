import React from "react";
import Footer from "../../components/layout/Footer";

const TermsOfService = () => {
  const sections = [
    {
      id: 1,
      title: "Eligibility",
      content: "You must be at least 18 years of age and legally competent under Indian law to use the Platform and place orders."
    },
    {
      id: 2,
      title: "Nature of Platform",
      content: "KaashtKart acts solely as a digital marketplace facilitating transactions between customers and independent sellers."
    },
    {
      id: 3,
      title: "Customer Account",
      content: "You agree to provide accurate information, maintain confidentiality of credentials, and accept responsibility for all activities conducted under your account."
    },
    {
      id: 4,
      title: "Product Information",
      content: "Product details are provided by sellers. Minor variations may occur due to agricultural and seasonal factors."
    },
    {
      id: 5,
      title: "Orders & Acceptance",
      content: "Orders are confirmed only after successful payment and seller acceptance. KaashtKart reserves the right to cancel orders when necessary."
    },
    {
      id: 6,
      title: "Payments",
      content: "Payments are processed through secure third-party gateways. KaashtKart does not store sensitive banking information."
    },
    {
      id: 7,
      title: "Delivery",
      content: "Delivery timelines are indicative and may vary due to logistics or force majeure events."
    },
    {
      id: 8,
      title: "Return, Refund & Cancellation",
      content: "Policies vary depending on product type and seller. Perishable goods may not be eligible for return."
    },
    {
      id: 9,
      title: "Customer Responsibilities",
      content: "You agree not to misuse the Platform or engage in unlawful activities."
    },
    {
      id: 10,
      title: "Intellectual Property",
      content: "All platform content is owned by KaashtKart and protected under applicable laws."
    },
    {
      id: 11,
      title: "Limitation of Liability",
      content: "KaashtKart shall not be liable for indirect or consequential damages to the extent permitted by law."
    },
    {
      id: 12,
      title: "Governing Law",
      content: "These Terms are governed by the laws of India. Courts at Lucknow shall have exclusive jurisdiction."
    },
    {
      id: 13,
      title: "Contact Information",
      content: (
        <>
          <div className="font-bold text-gray-800">
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
          Terms & Conditions
        </h1>

        <p className="text-gray-500 max-w-3xl mx-auto text-lg leading-relaxed">
          These Terms govern your access and use of the KaashtKart platform. Please read them carefully before using our services.
        </p>
      </section>

      {/* Content Section */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12">
          <div className="mb-10 space-y-6">
            <p className="text-sm font-bold text-gray-700">Effective Date: 01-Jan-2026</p>
            <p className="text-gray-600 leading-relaxed text-[15px]">
              These Customer Terms & Conditions ("Terms") govern your access to and use of the website and digital platforms operated by <span className="font-bold">KaashtKart Marketplace Pvt. Ltd.</span> ("KaashtKart", "We", "Our", "Us").
            </p>
            <p className="text-gray-600 leading-relaxed text-[15px]">
              KaashtKart is a farmer-focused digital marketplace enabling customers to purchase products directly from farmers and verified sellers. By using the Platform, you agree to these Terms.
            </p>
          </div>

          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section.id} className="group">
                <h2 className="text-lg font-bold text-[var(--color-secondary)] mb-2 flex items-start gap-2">
                  <span className="shrink-0">{section.id}.</span>
                  <span>{section.title}</span>
                </h2>
                <div className="text-gray-600 leading-relaxed pl-8 text-[14px]">
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          {/* Last Updated Box */}
          <div className="mt-16 bg-yellow-50/50 border-l-4 border-[var(--color-secondary)] p-6 rounded-r-lg">
            <p className="text-gray-500 font-medium text-sm">
              Last Updated: January 2026
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsOfService;
