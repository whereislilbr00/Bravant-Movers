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
              src="https://scontent.fmba3-1.fna.fbcdn.net/v/t39.30808-6/470664040_18129130294390881_5455943754812026861_n.jpg?stp=c76.0.787.787a_dst-jpg_s206x206_tt6&_nc_cat=109&ccb=1-7&_nc_sid=714c7a&_nc_ohc=dgbltTayNwoQ7kNvwFiSZ-H&_nc_oc=AdkCwALrJANcPwa-6Vzbp3PICXApa8gEFnF_WV4UWrvjo0Dh1eu4lGMY4b28t2rka4M&_nc_zt=23&_nc_ht=scontent.fmba3-1.fna&_nc_gid=iv9sMnkUFpeusHiHWnjoOg&oh=00_AfsDuX1CMadkjFPy7U8765h4Pbwhlrr8r5eNUs51PFjWxw&oe=6999CCA9"
              alt="Professional Moving Service"
              className={styles.image}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
