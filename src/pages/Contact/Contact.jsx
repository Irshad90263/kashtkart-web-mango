import { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import Footer from '../../components/layout/Footer';
import { createEnquiryApi } from '../../api/enquiry';
import { toast } from 'react-toastify';

const Contact = () => {
    const sectionRefs = useRef([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1 }
        );

        sectionRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    const addToRefs = (el) => {
        if (el && !sectionRefs.current.includes(el)) {
            sectionRefs.current.push(el);
        }
    };

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }
        
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        
        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Message must be at least 10 characters long';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'phone') {
            // Only allow numbers and limit to 10 digits
            const numbersOnly = value.replace(/[^0-9]/g, '').slice(0, 10);
            setFormData({ ...formData, [name]: numbersOnly });
        } else if (name === 'name') {
            // Only allow letters and spaces in name field
            const lettersOnly = value.replace(/[^a-zA-Z\s]/g, '');
            setFormData({ ...formData, [name]: lettersOnly });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the errors below");
            return;
        }

        setLoading(true);
        try {
            await createEnquiryApi(formData);
            toast.success("Thank you! Your message has been sent.");
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
            setErrors({});
        } catch (error) {
            console.error("Enquiry submission failed:", error);
            toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[var(--color-primary)] text-[var(--color-text)] font-[var(--font-body)] min-h-screen">
            {/* Contact Hero with Bubbles */}
            <section className="py-20 px-8 md:px-24 bg-[linear-gradient(0deg,rgba(255,212,0,0.1)_0%,transparent_70%)] text-center relative overflow-hidden mb-12">
                {/* Animated Background Bubbles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="contact-bubble contact-bubble-1"></div>
                    <div className="contact-bubble contact-bubble-2"></div>
                    <div className="contact-bubble contact-bubble-3"></div>
                    <div className="contact-bubble contact-bubble-4"></div>
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                        .contact-bubble {
                            position: absolute;
                            background: rgba(255, 212, 0, 0.15);
                            border-radius: 50%;
                            animation: float-contact-bubble 21s infinite ease-in-out;
                        }
                        .contact-bubble-1 {
                            width: 115px;
                            height: 115px;
                            left: 12%;
                            top: 22%;
                            animation-delay: 0s;
                        }
                        .contact-bubble-2 {
                            width: 145px;
                            height: 145px;
                            right: 18%;
                            top: 28%;
                            animation-delay: 3.5s;
                        }
                        .contact-bubble-3 {
                            width: 98px;
                            height: 98px;
                            left: 65%;
                            bottom: 22%;
                            animation-delay: 5s;
                        }
                        .contact-bubble-4 {
                            width: 125px;
                            height: 125px;
                            right: 55%;
                            bottom: 28%;
                            animation-delay: 1.5s;
                        }
                        @keyframes float-contact-bubble {
                            0%, 100% {
                                transform: translate(0, 0) scale(1);
                                opacity: 0.4;
                            }
                            50% {
                                transform: translate(28px, -38px) scale(1.09);
                                opacity: 0.6;
                            }
                        }
                    `
                }} />

                <h1 className="text-4xl md:text-6xl font-bold mb-6 relative z-10 text-[var(--color-secondary)]">Let's Talk</h1>
                <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto italic relative z-10 text-[var(--color-text-muted)]">
                    Have questions about our Mango or want to place a bulk order? We're here to help!
                </p>
            </section>

            <section className="py-24 px-8 md:px-24 -mt-16 z-20 relative">
                <div className="flex flex-col md:flex-row gap-12 max-w-6xl mx-auto">
                    {/* Contact Info */}
                    <div ref={addToRefs} className="scroll-section flex-1 bg-orange-50/30 p-6 md:p-8 rounded-md shadow-sm border border-orange-200/50 transition-all duration-300">
                        <h2 className="text-xl md:text-2xl font-bold text-orange-700 mb-6 md:mb-8 flex items-center gap-3">
                            <span className="w-6 h-1 bg-orange-500 rounded-full"></span>
                            Get In Touch
                        </h2>

                        <div className="space-y-6 md:space-y-8">
                            <div className="flex items-start gap-3 md:gap-6">
                                <div className="p-2 md:p-3 bg-orange-100 rounded-md text-orange-600 flex-shrink-0 border border-orange-200">
                                    <Mail size={16} className="md:w-5 md:h-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-bold text-orange-800 text-sm md:text-base">Email Us</h4>
                                    <a href="mailto:KaashtKart@gmail.com" className="text-orange-900/70 hover:text-orange-600 transition-colors text-xs md:text-sm break-all">KaashtKart@gmail.com</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 md:gap-6">
                                <div className="p-2 md:p-3 bg-orange-100 rounded-md text-orange-600 flex-shrink-0 border border-orange-200">
                                    <Phone size={16} className="md:w-5 md:h-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-bold text-orange-800 text-sm md:text-base">Call Us</h4>
                                    <div className="text-xs md:text-sm">
                                        <a href="tel:+916307736698" className="text-orange-900/70 hover:text-orange-600 transition-colors inline-block">+91 83188 99526</a>
                                        <span className="text-orange-900/30 mx-1">,</span>
                                        <a href="tel:+917860114786" className="text-orange-900/70 hover:text-orange-600 transition-colors inline-block">+91 78601 14786</a>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 md:gap-6">
                                <div className="p-2 md:p-3 bg-orange-100 rounded-md text-orange-600 flex-shrink-0 border border-orange-200">
                                    <MapPin size={16} className="md:w-5 md:h-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-bold text-orange-800 text-sm md:text-base">Visit Us</h4>
                                    <a
                                        href="https://www.google.com/maps/place/Sector+9+Indira+Nagar+Lucknow"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-orange-900/70 hover:text-orange-600 transition-colors underline decoration-dotted underline-offset-4 text-xs md:text-sm break-words"
                                    >
                                        45A Dayal Enclave, Sec-9, Indira Nagar, Lucknow 226026
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 md:mt-12 pt-8 md:pt-12 border-t border-[var(--color-secondary)]/10 italic text-[var(--color-text-muted)] text-xs md:text-sm">
                            "Bringing the warmth of KaashtKart to your home."
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div ref={addToRefs} className="scroll-section flex-[1.5] bg-orange-50/30 p-6 md:p-8 rounded-md shadow-sm border border-orange-200/50">
                        <h2 className="text-2xl md:text-3xl font-bold text-orange-700 mb-8 flex items-center gap-3">
                            <span className="w-6 h-1 bg-orange-500 rounded-full"></span>
                            Send a Message
                        </h2>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Your Name"
                                        className={`w-full px-4 py-3 bg-white text-orange-950 rounded-md outline-none border transition-all duration-300 shadow-sm ${
                                            errors.name ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-orange-100 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/5'
                                        }`}
                                        required
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Your Email"
                                        className={`w-full px-4 py-3 bg-white text-orange-950 rounded-md outline-none border transition-all duration-300 shadow-sm ${
                                            errors.email ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-orange-100 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/5'
                                        }`}
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Your Phone Number"
                                        className={`w-full px-4 py-3 bg-white text-orange-950 rounded-md outline-none border transition-all duration-300 shadow-sm ${
                                            errors.phone ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-orange-100 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/5'
                                        }`}
                                        required
                                    />
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="Bulk Inquiry / Ordering"
                                        className="w-full px-4 py-3 bg-white text-orange-950 rounded-md outline-none border border-orange-100 transition-all duration-300 shadow-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Your Message *</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell us what you're looking for..."
                                    rows="5"
                                    className={`w-full px-6 py-4 bg-[var(--color-surface)] text-[var(--color-text)] rounded-xl outline-none border transition-all resize-none placeholder-gray-400 ${
                                        errors.message ? 'border-red-500 focus:border-red-500' : 'border-[var(--color-secondary)]/20 focus:border-[var(--color-secondary)]'
                                    }`}
                                    required
                                ></textarea>
                                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-[var(--color-secondary)] text-[var(--color-primary)] rounded-xl font-bold text-lg shadow-[0_4px_15px_rgba(255,212,0,0.3)] hover:bg-[#e6c200] transition-all transform hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(255,212,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Sending...
                                    </>
                                ) : "Send Message"}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contact;
