'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <motion.nav
      className={styles.navbar}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <img
            src="https://media.licdn.com/dms/image/v2/C5603AQEoFpXFLqoWxg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1627078843674?e=1772668800&v=beta&t=z4C76cvBUMZBFE1R8_xbVgjC23_dNv_RI1m452-MYSs"
            alt="Bravant Movers"
            className={styles.logoImg}
          />
          <span>Bravant Movers</span>
        </Link>

        <div className={styles.navItems}>
          {navItems.map((item, idx) => (
            <motion.a
              key={idx}
              href={item.href}
              className={styles.navLink}
              whileHover={{ color: '#d4af37' }}
              transition={{ duration: 0.2 }}
            >
              {item.label}
            </motion.a>
          ))}
          <motion.a
            href="#contact"
            className={`${styles.ctaButton} btn btn-primary`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Book Now
          </motion.a>
        </div>

        <button
          className={`${styles.mobileToggle} ${mobileMenuOpen ? styles.open : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {mobileMenuOpen && (
        <motion.div
          className={styles.mobileMenu}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={styles.mobileLink}
            >
              {item.label}
            </a>
          ))}
          <a href="#contact" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>
            Book Now
          </a>
        </motion.div>
      )}
    </motion.nav>
  );
}
