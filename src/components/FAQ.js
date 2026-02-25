'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FAQ.module.css';

export default function FAQ() {
  const faqs = [
    {
      q: 'How far in advance should I book my move?',
      a: 'We recommend booking at least 2-4 weeks in advance for residential moves and 4-6 weeks for corporate relocations. However, we can accommodate last-minute moves depending on availability.',
    },
    {
      q: 'What areas do you service?',
      a: 'We provide moving and cleaning services throughout Kenya and neighboring regions. For specific locations, please contact us directly.',
    },
    {
      q: 'Do you provide packing materials?',
      a: 'Yes! We provide professional-grade packing materials including boxes, bubble wrap, tape, and protective covers. Premium plans include high-quality materials.',
    },
    {
      q: 'Is my belongings insured?',
      a: 'Absolutely. All moves include comprehensive insurance coverage. Our team ensures your items are properly protected throughout the moving process.',
    },
    {
      q: 'Can you handle corporate relocations?',
      a: 'Yes, we specialize in corporate relocations. Our Enterprise Solution includes dedicated project management and minimal downtime planning.',
    },
    {
      q: 'Do you offer cleaning services?',
      a: 'Yes! We provide deep cleaning services for residential and commercial spaces. Perfect before moving in or after moving out.',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (idx) => {
    setActiveIndex(activeIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className={styles.faq}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2>Frequently Asked Questions</h2>
          <p>Get answers to common questions about our services</p>
        </motion.div>

        <motion.div
          className={styles.faqList}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              className={styles.faqItem}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              viewport={{ once: true }}
            >
              <button className={styles.question} onClick={() => toggleFAQ(idx)}>
                <span>{faq.q}</span>
                <span className={`${styles.icon} ${activeIndex === idx ? styles.open : ''}`}>▼</span>
              </button>
              <AnimatePresence>
                {activeIndex === idx && (
                  <motion.div
                    className={styles.answer}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p>{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
