'use client';

import { motion } from 'framer-motion';
import styles from './Hero.module.css';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.background}>
        <div className={styles.gradientOrb1}></div>
        <div className={styles.gradientOrb2}></div>
      </div>

      <div className={styles.container}>
        <motion.div
          className={styles.content}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={itemVariants} className={styles.title}>
            Premium Moving & Cleaning Services
          </motion.h1>

          <motion.p variants={itemVariants} className={styles.subtitle}>
            Transform your relocation with our expert corporate and domestic moving services combined with pristine cleaning solutions
          </motion.p>

          <motion.div
            variants={itemVariants}
            className={styles.buttonGroup}
          >
            <button className="btn btn-primary">
              <a href="#contact">Book Now</a>
            </button>
            <button className="btn btn-secondary">
              <a href="#features">Explore Services</a>
            </button>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className={styles.stats}
          >
            <div className={styles.stat}>
              <h3>500+</h3>
              <p>Happy Clients</p>
            </div>
            <div className={styles.stat}>
              <h3>1000+</h3>
              <p>Projects Completed</p>
            </div>
            <div className={styles.stat}>
              <h3>15+</h3>
              <p>Years Experience</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.heroImage}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <img 
              src="/images/gallery-1.jpg"
              alt="Professional Moving Service"
              className={styles.image}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
