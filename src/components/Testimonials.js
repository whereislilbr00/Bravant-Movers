'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Testimonials.module.css';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'John Kipchoge',
      role: 'CEO, Tech Startup',
      text: 'Bravant made our corporate relocation seamless. Professional, efficient, and trustworthy. Highly recommended!',
      rating: 5,
      avatar: '👨‍💼',
    },
    {
      name: 'Sarah Mwangi',
      role: 'Property Manager',
      text: 'The cleaning services after the move were exceptional. They paid attention to every detail. Outstanding work!',
      rating: 5,
      avatar: '👩‍💼',
    },
    {
      name: 'David Ochieng',
      role: 'Home Owner',
      text: 'Best moving experience ever. The team was careful with my belongings and completed the job on time.',
      rating: 5,
      avatar: '👨‍🏫',
    },
    {
      name: 'Grace Njeri',
      role: 'Business Owner',
      text: 'Affordable, reliable, and professional. They made moving my office stress-free. Thank you Bravant!',
      rating: 5,
      avatar: '👩‍🎓',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className={styles.testimonials}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2>Client Testimonials</h2>
          <p>Hear from our satisfied customers</p>
        </motion.div>

        <motion.div className={styles.carousel}>
          <div className={styles.carouselTrack} style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {testimonials.map((testimonial, idx) => (
              <motion.div key={idx} className={styles.card}>
                <div className={styles.stars}>
                  {[...Array(testimonial.rating)].map((_, i) => (<span key={i}>⭐</span>))}
                </div>
                <p className={styles.text}>"{testimonial.text}"</p>
                <div className={styles.author}>
                  <div className={styles.avatar}>{testimonial.avatar}</div>
                  <div>
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className={styles.controls}>
            <button className={styles.prev} onClick={prev}>←</button>
            <button className={styles.next} onClick={next}>→</button>
          </div>

          <div className={styles.dots}>
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                className={`${styles.dot} ${idx === currentIndex ? styles.active : ''}`}
                onClick={() => setCurrentIndex(idx)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
