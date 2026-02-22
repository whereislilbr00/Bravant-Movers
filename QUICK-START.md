# Quick Start Guide - Bravant Movers Website

Get your stunning new website running in 5 minutes!

## 🚀 Quick Setup

### Step 1: Install Dependencies

```bash
cd Client
npm install
```

### Step 2: Configure Environment

Copy `.env.local.example` → `.env.local`:

```bash
NEXT_PUBLIC_APP_NAME=Bravant Movers & Cleaners
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 What You Get

✅ **8 Full-featured components:**

- Hero section with animations
- Feature showcase
- Project gallery with filters & lightbox
- Testimonials carousel
- 3-tier pricing
- FAQ with collapsible items
- Contact form
- Footer with links

✅ **SEO & Marketing Ready:**

- Complete metadata
- Open Graph tags
- Twitter cards
- Google Analytics ready
- Sitemap & robots.txt
- Structured data (Schema.org)

✅ **Modern Stack:**

- Next.js 14 (React framework)
- Framer Motion (smooth animations)
- CSS Modules (scoped styling)
- Luxury color scheme

## 🎯 Key Features

1. **Fully Responsive** - Works on all devices
2. **Animated** - Smooth Framer Motion animations
3. **Fast** - Optimized for performance
4. **Accessible** - Semantic HTML & ARIA labels
5. **SEO Optimized** - Best practices built-in
6. **Contact Form** - API endpoint ready
7. **Mobile Menu** - Hamburger navigation
8. **Dark Theme** - Luxury gold & navy colors

## 📁 Project Structure

```
Client/src/
├── app/
│   ├── layout.js          # Root layout
│   ├── page.js            # Home page
│   ├── api/contact/       # Contact form API
│   ├── privacy-policy/    # Legal page
│   └── terms-of-service/  # Legal page
├── components/
│   ├── Navbar.js
│   ├── Hero.js
│   ├── Features.js
│   ├── Gallery.js
│   ├── Testimonials.js
│   ├── Pricing.js
│   ├── FAQ.js
│   ├── Contact.js
│   ├── Footer.js
│   ├── CookieConsent.js
│   ├── StructuredData.js
│   └── GoogleAnalytics.js
└── styles/
    └── globals.css        # Global styles & animations
```

## 🛠 Common Tasks

### Edit Company Info

Edit these files:

- `layout.js` - Metadata
- `Footer.js` - Footer links & social
- `Contact.js` - Contact details
- `StructuredData.js` - Business info

### Change Colors

Edit `globals.css` CSS variables:

```css
--primary-gold: #d4af37;
--primary-dark: #1a1a2e;
--secondary-teal: #0f3460;
--accent-red: #e94560;
```

### Add Google Analytics

1. Create GA4 property at analytics.google.com
2. Copy Measurement ID (G-XXXXX)
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXX
   ```

### Test Contact Form

1. Fill out the contact form on `/contact` section
2. Form data logs to console in development
3. In production, implement email service

## 📱 Responsive Breakpoints

- **Mobile**: < 480px
- **Tablet**: 480px - 768px
- **Desktop**: > 768px

## 🚢 Deployment

### Deploy to Vercel (Easiest)

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Drag .next folder to netlify.com
```

### Self-host on Linux

```bash
npm run build
npm run start
# Use PM2 for process management
```

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed instructions.

## 🐛 Troubleshooting

**Port 3000 in use?**

```bash
npm run dev -- -p 3001
```

**Styles not loading?**

- Check CSS files end with `.module.css`
- Verify imports use: `import styles from './File.module.css'`

**Images not showing?**

- Check image URLs are correct
- Images must be from whitelisted domains in `next.config.js`

## 📞 Support

- **Docs**: See README.md
- **Deploy**: See DEPLOYMENT.md
- **Email**: bravantmovers.m@gmail.com
- **Phone**: +254 710 166873

## 🎨 Customization Tips

### Add New Section

1. Create `src/components/NewSection.js`
2. Create `src/components/NewSection.module.css`
3. Import in `src/app/page.js`

### Update Logo

- Edit Navbar.js image URL
- Update favicon in `public/favicon.ico`

### Change Testimonials

- Edit testimonials array in `Testimonials.js`
- Add new testimonials object

### Modify Pricing

- Edit plans array in `Pricing.js`
- Update features list

## ✅ Pre-Launch Checklist

- [ ] Test on mobile devices
- [ ] Test all form submissions
- [ ] Check all links work
- [ ] Verify social media links
- [ ] Update contact information
- [ ] Add Google Analytics ID
- [ ] Test contact form
- [ ] Run production build locally
- [ ] Deploy to hosting

## 🚀 Next Steps

1. ✅ Install and run locally
2. 📝 Update company information
3. 🎨 Customize colors if needed
4. 📧 Setup email service for contact form
5. 🚀 Deploy to production

---

**Questions?** Contact: bravantmovers.m@gmail.com
