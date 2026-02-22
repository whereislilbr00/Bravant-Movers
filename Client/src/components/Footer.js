'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Services',
      links: [
        { label: 'Corporate Relocations', href: '#services' },
        { label: 'Domestic Moves', href: '#services' },
        { label: 'Packing Services', href: '#services' },
        { label: 'Cleaning Services', href: '#services' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '#hero' },
        { label: 'Our Testimonials', href: '#testimonials' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Contact', href: '#contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms of Service', href: '/terms-of-service' },
        { label: 'Cookie Policy', href: '#' },
      ],
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <motion.div
            className={styles.section}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className={styles.branding}>
              <h3>Bravant Movers & Cleaners</h3>
              <p>Premium moving and cleaning services for corporate and residential clients throughout Kenya.</p>
              <div className={styles.socials}>
                <a href="https://www.facebook.com/BravantMovers" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>f</a>
                <a href="https://www.instagram.com/bravantmovers.cleaners/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>📷</a>
                <a href="https://www.linkedin.com/in/bravant-movers-075499218/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>in</a>
                <a href="https://x.com/bravant4" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>𝕏</a>
              </div>
            </div>
          </motion.div>

          {footerLinks.map((section, idx) => (
            <motion.div
              key={idx}
              className={styles.section}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <h4>{section.title}</h4>
              <ul>
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          <motion.div
            className={styles.section}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4>Contact</h4>
            <p className={styles.contact}>
              <strong>Phone:</strong><br />
              +254 710 166873
            </p>
            <p className={styles.contact}>
              <strong>Email:</strong><br />
              bravantmovers.m@gmail.com
            </p>
            <p className={styles.contact}>
              <strong>Location:</strong><br />
              Nairobi, Kenya
            </p>
          </motion.div>
        </div>

        <div className={styles.divider}></div>

        <motion.div
          className={styles.bottom}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p>&copy; {currentYear} Bravant Movers & Cleaners. All rights reserved.</p>
          <p>Made with ❤️ for seamless relocations</p>
        </motion.div>
      </div>
    </footer>
  );
}
