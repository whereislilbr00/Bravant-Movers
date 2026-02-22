import '../styles/globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';
import StructuredData from '../components/StructuredData';
import GoogleAnalytics from '../components/GoogleAnalytics';

export const metadata = {
  metadataBase: new URL('https://www.bravantmovers.com'),
  title: 'Bravant Movers & Cleaners | Professional Moving & Cleaning Services Kenya',
  description: 'Transform your relocation with expert moving, packing & cleaning services. 500+ happy clients. Corporate & domestic relocations. Get free quote!',
  keywords: [
    'moving services',
    'house moving',
    'office relocation',
    'cleaning services',
    'professional movers',
    'packing services',
    'corporate relocation',
    'Kenya movers',
    'Nairobi moving company',
  ],
  authors: [{ name: 'Bravant Movers & Cleaners' }],
  creator: 'Bravant Movers & Cleaners',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.bravantmovers.com',
    siteName: 'Bravant Movers & Cleaners',
    title: 'Bravant Movers & Cleaners | Professional Moving & Cleaning Services',
    description: 'Transform your relocation with expert moving, packing & cleaning services. 500+ happy clients. Get your free quote now!',
    images: [
      {
        url: 'https://media.licdn.com/dms/image/v2/C5603AQEoFpXFLqoWxg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1627078843674?e=1772668800&v=beta&t=z4C76cvBUMZBFE1R8_xbVgjC23_dNv_RI1m452-MYSs',
        width: 1200,
        height: 630,
        alt: 'Bravant Movers & Cleaners',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bravant Movers & Cleaners | Professional Moving Services',
    description: 'Expert moving, packing & cleaning services. 500+ happy clients. Get free quote!',
    creator: '@bravant4',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#d4af37" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <StructuredData />
      </head>
      <body>
        <div className="app-container">
          <Navbar />
          {children}
          <Footer />
          <CookieConsent />
        </div>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
