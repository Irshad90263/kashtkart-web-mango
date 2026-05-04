import React from 'react';
import Footer from '../../components/layout/Footer';

const TermsOfService = () => {
    return (
        <div>
            <div className="bg-[var(--color-primary)] text-[var(--color-text)] font-[var(--font-main)] min-h-screen -mt-4">
                <section className="py-20 px-8 md:px-24 bg-[var(--color-secondary)] text-[var(--color-primary)] text-center rounded-b-[50px]">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Terms of Service</h1>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto italic">
                        Defining our commitment and your engagement with SKS Sandila Laddu.
                    </p>
                </section>

                <section className="py-24 px-8 md:px-24 max-w-4xl mx-auto">
                    <div className="bg-[var(--color-muted)] p-12 rounded-[40px] shadow-2xl border border-white/5">
                        <h2 className="text-2xl font-bold text-[var(--color-secondary)] mb-6 font-serif">1. Use of Website</h2>
                        <p className="mb-8 leading-relaxed text-zinc-500">
                            By accessing this website, you agree to use it only for lawful purposes. You are prohibited from using the site in a way that damages its functionality or interferes with other users.
                        </p>

                        <h2 className="text-2xl font-bold text-[var(--color-secondary)] mb-6 font-serif">2. Product Accuracy</h2>
                        <p className="mb-8 leading-relaxed text-zinc-500">
                            We strive for precision in our product photos and descriptions. However, as our laddus are artisanal and handmade, slight variations in appearance and texture are natural and a mark of authenticity.
                        </p>

                        <h2 className="text-2xl font-bold text-[var(--color-secondary)] mb-6 font-serif">3. Pricing and Payment</h2>
                        <p className="mb-8 leading-relaxed text-zinc-500">
                            All prices are in INR. We reserve the right to change prices without prior notice. Payments must be made in full before an order is processed for shipping. <span className="text-red-400 font-bold">Online payment orders cannot be cancelled once placed.</span>
                        </p>

                        <h2 className="text-2xl font-bold text-[var(--color-secondary)] mb-6 font-serif">4. Intellectual Property</h2>
                        <p className="mb-8 leading-relaxed text-zinc-500">
                            The SKS Sandila Laddu brand name, logo, images, and content are the exclusive property of SKS Sandila Laddu. Unauthorized use of these materials is strictly prohibited.
                        </p>

                        <h2 className="text-2xl font-bold text-[var(--color-secondary)] mb-6 font-serif">5. Changes to Terms</h2>
                        <p className="mb-8 leading-relaxed text-zinc-500">
                            We reserve the right to modify these terms at any time. Your continued use of the site following any changes constitutes acceptance of the new terms.
                        </p>

                        <div className="mt-12 text-sm text-gray-400 text-center">
                            Last updated: January 2026
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
};

export default TermsOfService;
