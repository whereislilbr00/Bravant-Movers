# Bravant Movers & Cleaners - Website

A stunning, animated website for Bravant Movers & Cleaners, a premium moving and cleaning services company in Kenya. Built with Next.js, React, Framer Motion, and modern web technologies.

## 🎨 Design Features

- **Luxury Color Scheme**: Gold (#d4af37), Navy (#1a1a2e), Teal (#0f3460), Accent Red (#e94560)
- **Smooth Animations**: Powered by Framer Motion with staggered effects and scroll-triggered animations
- **Responsive Design**: Mobile-first approach with breakpoints at 768px and 480px
- **Modern Components**: Feature cards, image gallery with filtering, testimonial carousel, pricing tiers, and FAQ
- **SEO Optimized**: Complete metadata, Open Graph tags, Twitter cards, and Schema.org structured data
- **PWA Support**: Web manifest, offline support, and installable app experience

## 📂 Project Structure

```
Client/
├── src/
│   ├── app/
│   │   ├── layout.js              # Root layout with global metadata
│   │   ├── page.js                # Home page with all sections
│   │   ├── api/
│   │   │   └── contact/
│   │   │       └── route.js        # Contact form API endpoint
│   │   ├── privacy-policy/
│   │   │   └── page.js             # Privacy policy page
│   │   └── terms-of-service/
│   │       └── page.js             # Terms of service page
│   ├── components/
│   │   ├── Navbar.js              # Navigation bar
│   │   ├── Navbar.module.css
│   │   ├── Hero.js                # Hero section
│   │   ├── Hero.module.css
│   │   ├── Features.js            # Features showcase
│   │   ├── Features.module.css
│   │   ├── Gallery.js             # Project gallery with filters
│   │   ├── Gallery.module.css
│   │   ├── Testimonials.js        # Client testimonials carousel
│   │   ├── Testimonials.module.css
│   │   ├── Pricing.js             # Pricing tiers
│   │   ├── Pricing.module.css
│   │   ├── FAQ.js                 # Frequently asked questions
│   │   ├── FAQ.module.css
│   │   ├── Contact.js             # Contact form
│   │   ├── Contact.module.css
│   │   ├── Footer.js              # Footer with links
│   │   ├── Footer.module.css
│   │   ├── CookieConsent.js       # Cookie consent banner
│   │   ├── StructuredData.js      # Schema.org JSON-LD
│   │   └── GoogleAnalytics.js     # Google Analytics wrapper
│   └── styles/
│       └── globals.css             # Global styles and CSS variables
├── public/
│   ├── robots.txt                  # SEO robots configuration
│   ├── sitemap.xml                 # XML sitemap
│   ├── site.webmanifest            # PWA manifest
│   ├── favicon.ico                 # Browser tab icon
│   ├── apple-touch-icon.png        # Apple touch icon
│   └── [other assets...]
├── package.json
├── next.config.js
└── .env.local                      # Environment variables

server/
├── package.json
├── server.js                       # Express server (for backend API)
├── routes/
├── controllers/
├── models/
└── middleware/
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm or yarn
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Bravant-Movers
   ```

2. **Install Client Dependencies**

   ```bash
   cd Client
   npm install
   ```

3. **Install Server Dependencies** (if using backend)
   ```bash
   cd ../server
   npm install
   cd ..
   ```

### Configuration

1. **Set up Environment Variables**

   Create/update `Client/.env.local`:

   ```bash
   NEXT_PUBLIC_APP_NAME=Bravant Movers & Cleaners
   NEXT_PUBLIC_APP_URL=https://bravantmovers.com
   NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX  # Add your GA ID
   ```

2. **Google Analytics Setup** (Optional)
   - Create a Google Analytics 4 property
   - Copy the Measurement ID (G-XXXXX)
   - Add it to `.env.local` as `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`

### Development

1. **Start the Development Server**

   ```bash
   cd Client
   npm run dev
   ```

2. **Open in Browser**
   - Visit http://localhost:3000
   - The site will auto-reload as you make changes

### Building for Production

1. **Build the Client**

   ```bash
   cd Client
   npm run build
   npm run start
   ```

2. **Test Production Build Locally**
   ```bash
   npm run start
   ```

## 🛠 Key Technologies

- **Next.js 14**: React framework with SSR/SSG capabilities
- **React 18**: UI library with hooks
- **Framer Motion**: Animation library for smooth transitions
- **CSS Modules**: Component-scoped styling
- **Next.js Image**: Optimized image loading
- **Vercel Analytics**: Performance monitoring (optional)

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+ (full layout)
- **Tablet**: 768px - 1199px (optimized grid)
- **Mobile**: Below 768px (single column, hamburger menu)
- **Small Mobile**: Below 480px (extra small optimizations)

## 🎯 Key Features

### Home Page Components

1. **Hero Section** - Headline, CTA buttons, stats
2. **Features** - 6 service highlights with icons
3. **Gallery** - Project showcase with filtering and lightbox
4. **Testimonials** - Client reviews in carousel format
5. **Pricing** - 3-tier service packages
6. **FAQ** - Collapsible questions and answers
7. **Contact** - Contact form and information

### Additional Pages

- **Privacy Policy** - Legal compliance
- **Terms of Service** - Service terms and conditions

## 📋 SEO Configuration

- ✅ Meta tags (title, description, keywords)
- ✅ Open Graph tags for social sharing
- ✅ Twitter card configuration
- ✅ Schema.org structured data (LocalBusiness)
- ✅ Sitemap.xml for crawlers
- ✅ Robots.txt configuration
- ✅ Canonical URLs
- ✅ Mobile-first responsive design

## 🔒 Security Features

- ✅ HTTPS ready (deploy on HTTPS)
- ✅ Environment variables for sensitive data
- ✅ XSS protection built into React
- ✅ CSRF protection in forms
- ✅ Secure headers recommendations

## 📞 Contact Information

- **Phone**: +254 710 166873
- **Email**: bravantmovers.m@gmail.com
- **Location**: Nairobi, Kenya
- **Social Media**: Facebook, Instagram, LinkedIn, Twitter/X

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in project settings
4. Deploy automatically on git push

### Other Platforms

- **Netlify**: `npm run build` → Deploy `out/` directory
- **AWS**: Use AWS Amplify for easy deployment
- **DigitalOcean**: Use App Platform with Node.js runtime

## 🔧 Development Tips

### Adding New Components

1. Create component file: `src/components/NewComponent.js`
2. Create styles: `src/components/NewComponent.module.css`
3. Use CSS Modules: `import styles from './NewComponent.module.css'`
4. Import in page.js and add to layout

### Styling Guidelines

- Use CSS variables from globals.css for colors
- Maintain consistent spacing (20px units)
- Use Framer Motion for animations
- Test on mobile devices

### Common Tasks

**Add a new page:**

```bash
# Create file: Client/src/app/new-page/page.js
export default function NewPage() {
  return <div>Page content</div>;
}
```

**Update colors:**
Edit `Client/src/styles/globals.css` CSS variables at the top of the file.

**Add animations:**
Use Framer Motion components:

```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

## 📊 Performance

- Lazy-loaded images
- Code splitting via Next.js
- Optimized CSS with modules
- Production-ready compression
- Core Web Vitals optimized

## 🐛 Troubleshooting

**Port 3000 already in use:**

```bash
# Kill the process or use different port
npm run dev -- -p 3001
```

**Module not found errors:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**CSS not loading:**

- Ensure CSS Module filenames end with `.module.css`
- Check import statement: `import styles from './Component.module.css'`

## 📝 License

This project is the property of Bravant Movers & Cleaners. All rights reserved.

## 🤝 Support

For issues or questions:

- Email: bravantmovers.m@gmail.com
- Phone: +254 710 166873

---

**Last Updated**: January 2024
**Next.js Version**: 14.0.4
**React Version**: 18.2.0
