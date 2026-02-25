'use client';

import { motion } from 'framer-motion';
import styles from './Features.module.css';

export default function Features() {
  const features = [
    {
      icon: '🚚',
      title: 'Corporate Relocations',
      description: 'Professional corporate moving services with minimal downtime for your business operations.',
    },
    {
      icon: '🏠',
      title: 'Domestic Moves',
      description: 'Reliable and careful moving services for your household belongings and treasured items.',
    },
    {
      icon: '📦',
      title: 'Expert Packing',
      description: 'Professional packing services to ensure your items arrive safely and securely.',
    },
    {
      icon: '✨',
      title: 'Cleaning Services',
      description: 'Deep cleaning for corporate and domestic spaces before, during, and after relocation.',
    },
    {
      icon: '🛡️',
      title: 'Fully Insured',
      description: 'Complete insurance coverage for all your belongings during the moving process.',
    },
    {
      icon: '👥',
      title: '24/7 Support',
      description: 'Dedicated customer support team available at all times for your convenience.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="features" className={styles.features}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2>Why Choose Bravant?</h2>
          <p>Exceptional service quality with attention to every detail</p>
        </motion.div>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className={styles.card}
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className={styles.iconWrapper}>
                <span className={styles.icon}>{feature.icon}</span>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <div className={styles.cardBorder}></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
