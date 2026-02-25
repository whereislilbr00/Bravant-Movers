'use client';

import { motion } from 'framer-motion';
import styles from './Pricing.module.css';

export default function Pricing() {
  const plans = [
    {
      name: 'Basic Move',
      price: '15,000',
      features: [
        'Up to 1 room moving',
        'Professional team of 2',
        'Basic packing materials',
        'Local delivery',
        'Insurance coverage',
        'Phone support',
      ],
      popular: false,
    },
    {
      name: 'Premium Move',
      price: '35,000',
      features: [
        'Up to 3 room moving',
        'Professional team of 4',
        'Premium packing materials',
        'Local & long distance',
        'Full insurance coverage',
        '24/7 support',
        'Cleaning service included',
      ],
      popular: true,
    },
    {
      name: 'Enterprise Solution',
      price: '65,000',
      features: [
        'Corporate relocation',
        'Dedicated project manager',
        'Specialized packing',
        'Multi-location moves',
        'Premium insurance',
        'Priority 24/7 support',
        'Post-move cleaning',
        'Custom solutions',
      ],
      popular: false,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const handleGetStarted = (planName, planPrice) => {
    // Redirect to checkout page with plan details
    const queryParams = new URLSearchParams({
      plan: planName,
      price: planPrice,
    });
    window.location.href = `/checkout?${queryParams.toString()}`;
  };

  return (
    <section id="pricing" className={styles.pricing}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2>Transparent Pricing</h2>
          <p>Choose the plan that fits your moving needs</p>
        </motion.div>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              className={`${styles.card} ${plan.popular ? styles.popular : ''}`}
              variants={itemVariants}
              whileHover={{ y: -20, transition: { duration: 0.3 } }}
            >
              {plan.popular && <div className={styles.badge}>MOST POPULAR</div>}
              <h3>{plan.name}</h3>
              <div className={styles.price}>
                <span className={styles.amount}>KES {plan.price}</span>
                <span className={styles.period}>/move</span>
              </div>
              <motion.button
                className={plan.popular ? 'btn btn-primary' : 'btn btn-secondary'}
                onClick={() => handleGetStarted(plan.name, plan.price)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
              <div className={styles.features}>
                {plan.features.map((feature, fidx) => (
                  <div key={fidx} className={styles.feature}>
                    <span className={styles.checkmark}>✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className={styles.footer}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p>All plans include professional team, insurance coverage, and customer support.</p>
          <p>Contact us for corporate and bulk moving rates.</p>
        </motion.div>
      </div>
    </section>
  );
}
