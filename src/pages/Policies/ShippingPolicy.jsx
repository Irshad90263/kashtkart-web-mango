import React from 'react';
import Footer from '../../components/layout/Footer';

const ShippingPolicy = () => {
    return (
        <div>
            <div className="bg-[var(--color-primary)] text-[var(--color-text)] font-[var(--font-main)] min-h-screen -mt-4">
                <section className="py-20 px-8 md:px-24 bg-[var(--color-secondary)] text-[var(--color-primary)] text-center rounded-b-[50px]">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Shipping Policy</h1>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto italic">
                        Delivering the taste of Sandila to your doorstep safely and swiftly.
                    </p>
                </section>

                <section className="py-24 px-8 md:px-24 max-w-4xl mx-auto">
                    <div className="bg-[var(--color-muted)] p-12 rounded-[40px] shadow-2xl border border-white/5">
                        <h2 className="text-2xl font-bold text-[var(--color-secondary)] mb-6 font-serif underline decoration-[var(--color-secondary)]">Delivery Timeline</h2>
                        <p className="mb-6 leading-relaxed text-zinc-500">
                            We understand you're eager to taste our laddus! Our standard shipping times are as follows:
                        </p>
                        <ul className="list-disc pl-6 mb-8 text-zinc-500 space-y-3">
                            <li><strong>Processing Time:</strong> 1-2 business days (We make your laddus fresh!)</li>
                            <li><strong>Within Uttar Pradesh:</strong> 2-4 business days.</li>
                            <li><strong>Rest of India:</strong> 4-7 business days.</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-[var(--color-secondary)] mb-6 font-serif underline decoration-[var(--color-secondary)]">Shipping Charges</h2>
                        <p className="mb-6 leading-relaxed text-zinc-500">
                            Shipping costs are calculated based on the weight of your order and your location. The exact shipping fee will be shown at checkout.
                        </p>

                        <h2 className="text-2xl font-bold text-[var(--color-secondary)] mb-6 font-serif underline decoration-[var(--color-secondary)]">Packaging</h2>
                        <p className="mb-6 leading-relaxed text-zinc-500">
                            Our laddus are packed in high-quality, food-grade airtight containers. We add extra protective layers to ensure they don't break during transit and reach you in perfect condition.
                        </p>

                        <h2 className="text-2xl font-bold text-[var(--color-secondary)] mb-6 font-serif underline decoration-[var(--color-secondary)]">Tracking</h2>
                        <p className="mb-6 leading-relaxed text-zinc-500">
                            Once your order is shipped, you will receive a tracking ID via email/SMS to monitor your sweet parcel's journey.
                        </p>

                        <h2 className="text-2xl font-bold text-[var(--color-secondary)] mb-6 font-serif underline decoration-[var(--color-secondary)]">Cancellation Policy</h2>
                        <p className="mb-6 leading-relaxed text-gray-300 text-red-400 font-bold">
                            Please note: Online payment orders cannot be cancelled once placed.
                        </p>

                        <div className="mt-12 p-6 bg-[var(--color-accent)]/10 rounded-2xl italic text-gray-400 border-l-4 border-[var(--color-secondary)]">
                            <strong>Note:</strong> During festivals or extreme weather conditions, deliveries might experience slight delays. We appreciate your patience!
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
};

export default ShippingPolicy;
