'use client';

import { useState } from 'react';
import Image from 'next/image';  // ✅ ADDED - Next.js Image component
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Gallery.module.css';

export default function Gallery() {
  const galleryImages = [
    {
      url: 'https://scontent.fmba3-1.fna.fbcdn.net/v/t39.30808-6/470664040_18129130294390881_5455943754812026861_n.jpg?stp=c76.0.787.787a_dst-jpg_s206x206_tt6&_nc_cat=109&ccb=1-7&_nc_sid=714c7a&_nc_ohc=dgbltTayNwoQ7kNvwFiSZ-H&_nc_oc=AdkCwALrJANcPwa-6Vzbp3PICXApa8gEFnF_WV4UWrvjo0Dh1eu4lGMY4b28t2rka4M&_nc_zt=23&_nc_ht=scontent.fmba3-1.fna&_nc_gid=iv9sMnkUFpeusHiHWnjoOg&oh=00_AfsDuX1CMadkjFPy7U8765h4Pbwhlrr8r5eNUs51PFjWxw&oe=6999CCA9',
      title: 'Professional Moving Team',
      category: 'moving',
    },
    {
      url: 'https://scontent.fmba3-1.fna.fbcdn.net/v/t39.30808-6/487481919_1127053172766022_4170249364083592066_n.jpg?stp=c240.0.960.960a_dst-jpg_s206x206_tt6&_nc_cat=101&ccb=1-7&_nc_sid=714c7a&_nc_ohc=6vTdIERWZDAQ7kNvwHw6OhT&_nc_oc=AdngXDmddxkpRuNPBEH5ZZQBFMDDFKgposkYlvGaxOv88Nb2Qsc5hFKRPWty2FZ5dRY&_nc_zt=23&_nc_ht=scontent.fmba3-1.fna&_nc_gid=Z8ePqJAtNYgvS49uj4z7ag&oh=00_Aftn_1dSP-ozUOiQiA7pyxd39vd2iDmm51HjHoLD1mFCkA&oe=6999CD7F',
      title: 'Careful Packing Services',
      category: 'packing',
    },
    {
      url: 'https://scontent.fmba3-1.fna.fbcdn.net/v/t39.30808-6/480906011_1097533559051317_1951858392463615903_n.jpg?stp=c342.0.1365.1365a_dst-jpg_s206x206_tt6&_nc_cat=100&ccb=1-7&_nc_sid=52bb43&_nc_ohc=_GRLXlCLoTAQ7kNvwExwPP0&_nc_oc=AdmQu4vHm8IT87oQseupP0BBHtbxHeQ6HoUVqnDO0ONRk-I11ljVCZZ-TuLbSEYNO-4&_nc_zt=23&_nc_ht=scontent.fmba3-1.fna&_nc_gid=eRiWzOB2O88yjUJouldq3g&oh=00_AfvYH6Agn_lAOaLjHcv4t402M-ZyjZ5rgXysf5_hHX3l-Q&oe=6999CC95',
      title: 'Corporate Relocation',
      category: 'corporate',
    },
    {
      url: 'https://scontent.fmba3-1.fna.fbcdn.net/v/t39.30808-6/486311562_1123462206458452_5472801469927427804_n.jpg?stp=c240.0.960.960a_dst-jpg_s206x206_tt6&_nc_cat=109&ccb=1-7&_nc_sid=714c7a&_nc_ohc=YaX6IuWMycIQ7kNvwHvpOS0&_nc_oc=AdlskDW0KXxci2xnYkeL8_rUyzKCxafe6dPwNicKHq_RiKQzjicMkD7bdKbHleb_qJI&_nc_zt=23&_nc_ht=scontent.fmba3-1.fna&_nc_gid=NcX91jRsk0wep_1quSwrmA&oh=00_Afup5PJpk7M4R2Rv3gvp-ZG9-JJf4Rkn86asG63FyaSNgg&oe=6999EF5C',
      title: 'Quality Cleaning',
      category: 'cleaning',
    },
    {
      url: 'https://scontent.fmba3-1.fna.fbcdn.net/v/t51.75761-15/501060403_18144404494390881_2251072525794776399_n.jpg?stp=c240.0.960.960a_dst-jpg_s206x206_tt6&_nc_cat=104&ccb=1-7&_nc_sid=714c7a&_nc_ohc=SugDcwZmhVgQ7kNvwFmITrI&_nc_oc=AdmVmr1bSIIUAMpZVnWNONJwGho_xjPVukVDWNjmM8rpwUUSaRxmgWHp0ecCFwXe_y8&_nc_zt=23&_nc_ht=scontent.fmba3-1.fna&_nc_gid=iv9sMnkUFpeusHiHWnjoOg&oh=00_AftXrOYuXB2CmORHemA-ubZEIDqdEBlLu_N3fl0QupviLA&oe=6999D528',
      title: 'Professional Team at Work',
      category: 'moving',
    },
    {
      url: 'https://scontent.fmba3-1.fna.fbcdn.net/v/t39.30808-6/487825967_9839723606049043_67256671482970690_n.jpg?stp=c315.0.810.810a_dst-jpg_s206x206_tt6&_nc_cat=111&ccb=1-7&_nc_sid=8b96af&_nc_ohc=FL8JEB5p8IgQ7kNvwG0_Zmk&_nc_oc=AdnHFVNWmCNar2dtyD1CaAxnHpjwDZcuNCH3I_uCfrOgxEqNKx8-v-hG1NxchaITUNs&_nc_zt=23&_nc_ht=scontent.fmba3-1.fna&_nc_gid=brIacg3wsrnWxZil7fBUBA&oh=00_Afvw2vQjx0ijByBnwmJ4rSArf8lozEXEYj0QvOMbyXntHQ&oe=6999D7C6',
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
