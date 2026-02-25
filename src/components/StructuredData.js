'use client';

export default function StructuredData() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Bravant Movers & Cleaners',
    'image': 'https://media.licdn.com/dms/image/v2/C5603AQEoFpXFLqoWxg/',
    'description': 'Premium moving and cleaning services for corporate and residential clients throughout Kenya',
    'telephone': '+254 710 166873',
    'email': 'bravantmovers.m@gmail.com',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Nairobi',
      'addressRegion': 'Nairobi',
      'addressCountry': 'KE'
    },
    'sameAs': [
      'https://www.facebook.com/BravantMovers',
      'https://www.instagram.com/bravantmovers.cleaners/',
      'https://www.linkedin.com/in/bravant-movers-075499218/',
      'https://x.com/bravant4'
    ],
    'areaServed': 'Kenya',
    'priceRange': '$$',
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '5',
      'ratingCount': '500',
      'bestRating': '5',
      'worstRating': '1'
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
