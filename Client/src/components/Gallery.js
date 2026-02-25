'use client';

import { useState } from 'react';
import Image from 'next/image';  // ✅ ADDED - Next.js Image component
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Gallery.module.css';

export default function Gallery() {
  const galleryImages = [
    {
      url: '/images/gallery-7.jpg',
      title: 'Professional Moving Team',
      category: 'moving',
    },
    {
      url: '/images/gallery-8.jpg',
      title: 'Careful Packing Services',
      category: 'packing',
    },
    {
      url: '/images/gallery-10.jpg',
      title: 'Corporate Relocation',
      category: 'corporate',
    },
    {
      url: `/images/gallery-4.jpg`,
      title: 'Quality Cleaning',
      category: 'cleaning',
    },
    {
      url: '/images/gallery-5.jpg',
      title: 'Professional Team at Work',
      category: 'moving',
    },
    {
      url: '/images/gallery-9.jpg',
      title: 'Safe Transport',
      category: 'transport',
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredImages = selectedCategory === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory);

  return (
    <section id="gallery" className={styles.gallery}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2>Our Work Gallery</h2>
          <p>Showcasing our professional moving and cleaning services</p>
        </motion.div>

        <motion.div
          className={styles.filters}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {['all', 'moving', 'packing', 'cleaning', 'corporate', 'transport'].map((cat) => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${selectedCategory === cat ? styles.active : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </motion.div>

        <motion.div
          className={styles.grid}
          layout
        >
          <AnimatePresence>
            {filteredImages.map((image, idx) => (
              <motion.div
                key={idx}
                className={styles.imageCard}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedImage(image)}
                whileHover={{ y: -10 }}
              >
                 <Image
          src={image.url}
          alt={image.title}
          width={400}
          height={300}
          priority={idx === 0}      // ✅ First image loads immediately
          unoptimized               // ✅ Keep original quality
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
                <div className={styles.overlay}>
                  <p>{image.title}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className={styles.lightboxContent}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.closeBtn}
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </button>
               <Image
          src={selectedImage.url}
          alt={selectedImage.title}
          width={800}
          height={600}
          unoptimized
          style={{ width: '100%', height: 'auto' }}
        />
              <p>{selectedImage.title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
