import React, { useState } from 'react';

const FAQS = [
  { q: 'Are your mangoes naturally ripened?', a: 'Yes, all our mangoes are naturally ripened on the tree or in natural conditions. We never use calcium carbide or any artificial ripening agents.' },
  { q: 'How fresh are the mangoes when delivered?', a: 'Our mangoes are handpicked and dispatched within 24–48 hours of harvest, ensuring you receive the freshest possible fruit at your doorstep.' },
  { q: 'Which mango varieties do you offer?', a: 'We currently offer Alphonso (Hapus), Kesar, and Dasheri varieties — all sourced directly from certified organic farms across Ratnagiri, Valsad, and Lucknow.' },
  { q: 'Do you deliver all over India?', a: 'Yes! We deliver to 100+ cities across India including all major metros and tier-2 cities. Enter your pincode at checkout to confirm availability in your area.' },
  { q: 'What if I receive damaged or bad mangoes?', a: 'We have a hassle-free replacement policy. If you receive damaged or unripe mangoes, simply contact us within 24 hours of delivery with a photo and we will resolve it immediately.' },
  { q: 'Are your mangoes organic and chemical-free?', a: 'Absolutely. Our farmer partners follow organic farming practices — no chemical pesticides, no synthetic fertilizers. Every batch is quality-checked before dispatch.' },
];

const FAQ = ({ addToRefs }) => {
  const [open, setOpen] = useState(0);

  return (
    <section
      ref={addToRefs || null}
      className={`${addToRefs ? 'scroll-section' : ''} bg-[var(--color-surface)] py-16 px-8 md:px-24 2xl:px-32 3xl:px-48`}
      id="faq"
    >
      <div className="max-w-[1600px] 3xl:max-w-[1900px] mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-8 bg-[var(--color-secondary)] opacity-60"></div>
            <span className="text-[var(--color-secondary)] font-bold uppercase tracking-[0.4em] text-xs">Got Questions?</span>
            <div className="h-[1px] w-8 bg-[var(--color-secondary)] opacity-60"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[var(--color-text)] font-[var(--font-heading)]">
            Frequently Asked <span className="text-[var(--color-secondary)]">Questions</span>
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border border-[var(--color-secondary)]/20 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left bg-[var(--color-primary)] hover:bg-[var(--color-secondary)]/5 transition-colors"
              >
                <span className="text-[var(--color-secondary)] font-semibold text-sm md:text-base">{faq.q}</span>
                <span className="text-[var(--color-secondary)] text-xl flex-shrink-0 ml-4">{open === i ? '−' : '+'}</span>
              </button>
              {open === i && (
                <div className="px-6 py-4 bg-[var(--color-surface)] text-[var(--color-text-muted)] text-sm leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
