import React, { useState } from "react";
import { 
  ShoppingCart, 
  RefreshCcw, 
  CreditCard, 
  User, 
  Truck, 
  Leaf, 
  HeartHandshake, 
  ShieldCheck,
  Plus,
  Minus,
  MessageCircle,
  Mail,
  Phone
} from "lucide-react";
import Footer from "../../components/layout/Footer";

const SupportCenter = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const helpTopics = [
    {
      title: "Orders & Shipping",
      desc: "Track orders, shipping policies, delivery issues",
      icon: <ShoppingCart className="text-[var(--color-secondary)]" size={32} />,
    },
    {
      title: "Returns & Refunds",
      desc: "Return policy, refund process, exchange items",
      icon: <RefreshCcw className="text-[var(--color-secondary)]" size={32} />,
    },
    {
      title: "Payments & Billing",
      desc: "Payment methods, invoices, billing issues",
      icon: <CreditCard className="text-[var(--color-secondary)]" size={32} />,
    },
    {
      title: "Account Settings",
      desc: "Login issues, profile updates, password reset",
      icon: <User className="text-[var(--color-secondary)]" size={32} />,
    },
    {
      title: "Delivery Partners",
      desc: "Delivery schedules, partner information",
      icon: <Truck className="text-[var(--color-secondary)]" size={32} />,
    },
    {
      title: "Product Questions",
      desc: "Product details, quality, certifications",
      icon: <Leaf className="text-[var(--color-secondary)]" size={32} />,
    },
    {
      title: "Farmer Support",
      desc: "For FPOs and farmers, selling on platform",
      icon: <HeartHandshake className="text-[var(--color-secondary)]" size={32} />,
    },
    {
      title: "Privacy & Security",
      desc: "Data protection, account security",
      icon: <ShieldCheck className="text-[var(--color-secondary)]" size={32} />,
    },
  ];

  const faqs = [
    {
      question: "How do I track my order?",
      answer: "You can track your order by clicking on the 'Track Order' link in the footer or from your account dashboard. You will also receive an SMS and email with tracking details once your order is shipped."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 7-day return policy for most products if they are received in damaged condition or are not as described. Perishable items like fresh mangoes are subject to specific quality checks."
    },
    {
      question: "How can I sell my products on KaashtKart?",
      answer: "Farmers and FPOs can register as vendors through our 'Sell with Us' program. Contact our farmer support team for onboarding assistance."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI (Google Pay, PhonePe, etc.), Net Banking, and select digital wallets. Cash on Delivery is available for specific locations."
    },
    {
      question: "How do I reset my password?",
      answer: "Click on the 'Forgot Password' link on the login page. Enter your registered email or phone number, and we will send you a reset link or OTP."
    },
    {
      question: "Do you deliver to my area?",
      answer: "We deliver across major cities in India. You can check delivery availability for your specific pincode on any product page."
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="bg-[var(--color-primary)] min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-8 text-center bg-gradient-to-b from-yellow-50 to-transparent">
        <h1 className="text-4xl md:text-6xl font-bold text-[var(--color-secondary)] mb-6 font-[var(--font-heading)]">
          How can we help you?
        </h1>
      </section>

      {/* Quick Help Topics */}
      <section className="max-w-[1440px] mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Quick Help Topics</h2>
          <div className="w-16 h-1 bg-[var(--color-secondary)] mx-auto rounded-full mb-4"></div>
          <p className="text-gray-500">Find answers to common questions and issues</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {helpTopics.map((topic, index) => (
            <div 
              key={index} 
              className="group bg-white p-8 rounded-md border border-gray-100 hover:border-yellow-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
            >
              <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {topic.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[var(--color-secondary)] transition-colors">
                {topic.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {topic.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
            <div className="w-16 h-1 bg-[var(--color-secondary)] mx-auto rounded-full mb-4"></div>
            <p className="text-gray-500">Most common questions from our customers</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`border rounded-md transition-all duration-500 overflow-hidden ${openFaq === index ? 'border-yellow-300 shadow-md' : 'border-gray-100 hover:border-yellow-200'}`}
              >
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full cursor-pointer flex items-center justify-between p-5 text-left transition-colors duration-300"
                >
                  <span className={`font-semibold text-lg transition-colors duration-300 ${openFaq === index ? 'text-yellow-700' : 'text-gray-800'}`}>
                    {faq.question}
                  </span>
                  <div className={`transition-transform duration-500 ${openFaq === index ? 'rotate-180' : ''}`}>
                    {openFaq === index ? <Minus className="text-[var(--color-secondary)]" /> : <Plus className="text-gray-400" />}
                  </div>
                </button>
                
                <div 
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${openFaq === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="px-5 pb-5">
                    <div className="pt-2 border-t border-gray-50 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="max-w-[1440px] mx-auto px-6 py-20">
        <div className="bg-[var(--color-secondary)] rounded-2xl p-10 md:p-16 text-white flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Still need help?</h2>
            <p className="text-white/80 text-lg">
              Our dedicated support team is here to assist you with any questions or concerns you may have. 
              We're available from 9 AM to 9 PM, 7 days a week.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">
            <a href="tel:+911234567890" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 p-4 rounded-xl transition-all border border-white/10">
              <Phone size={24} />
              <div>
                <div className="text-xs text-white/60">Call Us</div>
                <div className="font-bold">+91 1234567890</div>
              </div>
            </a>
            <a href="mailto:support@kaashtkart.com" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 p-4 rounded-xl transition-all border border-white/10">
              <Mail size={24} />
              <div>
                <div className="text-xs text-white/60">Email Us</div>
                <div className="font-bold">support@kaashtkart.com</div>
              </div>
            </a>
            <button className="flex items-center gap-3 bg-white text-[var(--color-secondary)] p-4 rounded-xl transition-all font-bold sm:col-span-2 justify-center hover:bg-yellow-50">
              <MessageCircle size={24} />
              Live Chat Support
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SupportCenter;
