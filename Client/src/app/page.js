'use client';

import Hero from '../components/Hero';
import Features from '../components/Features';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <Gallery />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Contact />
    </main>
  );
}
