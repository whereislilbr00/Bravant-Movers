# Developer FAQs - Bravant Movers Website

## General Questions

### Q: What version of Node.js do I need?

A: Node.js 18.0.0 or higher. Check with `node --version`.

### Q: Can I use TypeScript?

A: Yes! Create `.ts` files or rename existing `.js` files to `.ts`. Next.js will automatically detect and compile them. Install types with `npm install --save-dev @types/react @types/react-dom`.

### Q: Where do I change the website colors?

A: Edit `Client/src/styles/globals.css` at the top where CSS variables are defined:

```css
--primary-gold: #d4af37;
--primary-dark: #1a1a2e;
--secondary-teal: #0f3460;
--accent-red: #e94560;
```

### Q: How do I add a new page?

A: Create a new folder in `Client/src/app/` with a `page.js` file:

```bash
mkdir Client/src/app/my-new-page
touch Client/src/app/my-new-page/page.js
```

## Component Questions

### Q: How do I add a new section to the home page?

A: 1. Create `Client/src/components/NewSection.js` 2. Create `Client/src/components/NewSection.module.css` 3. Import in `Client/src/app/page.js` 4. Add to the main component

### Q: How do I update the testimonials?

A: Edit the testimonials array in `Client/src/components/Testimonials.js`:

```javascript
const testimonials = [
  {
    name: "Client Name",
    role: "Their Role",
    text: "Their quote about your service",
    rating: 5,
    avatar: "😊",
  },
  // Add more...
];
```

### Q: How do I add more pricing tiers?

A: Edit the plans array in `Client/src/components/Pricing.js` and add new plan object with name, price, features, and popular flag.

### Q: How do I change the gallery images?

A: Update the galleryImages array in `Client/src/components/Gallery.js`. Update image URLs and categories.

## Styling Questions

### Q: Why are my styles not applying?

A: Make sure:

1. CSS file is named `Component.module.css`
2. Import is: `import styles from './Component.module.css'`
3. Use with: `className={styles.className}`

### Q: How do I add hover effects?

A: In CSS modules:

```css
.element:hover {
  background-color: #d4af37;
  transform: scale(1.05);
  transition: all 0.3s ease;
}
```

### Q: How do I make something responsive?

A: Use media queries in CSS modules:

```css
@media (max-width: 768px) {
  .element {
    grid-template-columns: 1fr;
    padding: 20px;
  }
}
```

## Animation Questions

### Q: How do I add Framer Motion animations?

A: Import and use motion components:

```jsx
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.6 }}
>
  Animated content
</motion.div>;
```

### Q: How do I trigger animations on scroll?

A: Use whileInView:

```jsx
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
>
  Content
</motion.div>
```

### Q: How do I stagger animations?

A: Use container and item variants:

```javascript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};
```

## SEO & Metadata Questions

### Q: Where do I change the page title and description?

A: Edit in `Client/src/app/layout.js` in the metadata object.

### Q: How do I add schema markup?

A: Edit `Client/src/components/StructuredData.js` JSON-LD schema object.

### Q: How do I verify my sitemap?

A: Submit at Google Search Console: `https://your-domain.com/sitemap.xml`

## Deployment Questions

### Q: How do I deploy to Vercel?

A: See DEPLOYMENT.md or run:

```bash
npm install -g vercel
vercel
```

### Q: How do I set environment variables?

A: Create `.env.local` file with variables or add in deployment platform settings.

### Q: What happens to my domain after deployment?

A: Update DNS records to point to your hosting provider's nameservers.

## API & Backend Questions

### Q: How do I handle the contact form?

A: Currently logs to console. Implement email service using:

- [Nodemailer](https://nodemailer.com/)
- [SendGrid](https://sendgrid.com/)
- [Mailgun](https://www.mailgun.com/)
- [AWS SES](https://aws.amazon.com/ses/)

### Q: Can I connect a database?

A: Yes! Use:

- [MongoDB](https://www.mongodb.com/) - NoSQL
- [PostgreSQL](https://www.postgresql.org/) - SQL
- [Firebase](https://firebase.google.com/) - Managed
- [Supabase](https://supabase.io/) - Managed PostgreSQL

### Q: How do I add authentication?

A: Use libraries like:

- [NextAuth.js](https://next-auth.js.org/)
- [Auth0](https://auth0.com/)
- [Clerk](https://clerk.dev/)

## Performance Questions

### Q: How do I optimize images?

A: Use Next.js Image component:

```jsx
import Image from "next/image";

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority // For above-fold images
/>;
```

### Q: How do I reduce bundle size?

A: - Enable dynamic imports

- Remove unused dependencies
- Use production build
- Check with `npm analyze`

### Q: How do I improve Core Web Vitals?

A: - Optimize images

- Minimize CSS/JS
- Use lazy loading
- Improve TTFB (time to first byte)

## Debugging Questions

### Q: How do I debug animations?

A: - Add `transition={{ duration: 2 }}` to slow down

- Use browser DevTools to inspect
- Check console for errors
- Use Framer Motion debugger

### Q: How do I find bugs?

A: - Check browser console (F12)

- Use next/debug in package.json
- Set `NODE_ENV=development`
- Add console.log statements

### Q: Where do I find error logs?

A: - Browser console for frontend errors

- Server console for backend errors
- Check deployment platform logs (Vercel, Netlify, etc.)

## Maintenance Questions

### Q: How often should I update dependencies?

A: Check monthly using `npm outdated`. Update with `npm update`.

### Q: What should I backup?

A: - Your git repository

- Environment variables (separate)
- Database (if you add one)
- Configuration files

### Q: How do I monitor the website?

A: Use tools like:

- Google Analytics (traffic)
- Google Search Console (SEO)
- UptimeRobot (availability)
- Sentry (error tracking)

## Troubleshooting Common Issues

### Q: "Module not found" error

A: Check:

- File exists at correct path
- Import path is correct: `../components/` vs `./components/`
- File name case matches (case sensitive on Linux/Mac)

### Q: Styles not applying

A: - Clear `.next` folder: `rm -rf .next`

- Restart dev server
- Check CSS Module naming
- Verify import statement

### Q: API route not working

A: - File must be at `app/api/routename/route.js`

- Export `POST`, `GET`, etc. functions
- Check request method matches
- Verify response format

### Q: Performance is slow

A: - Check dev tools Network tab

- Profiles performance
- Optimize large images
- Check for large dependencies
- Use production build

## Advanced Topics

### Q: How do I implement dark/light mode toggle?

A: Use `next-themes` package:

```bash
npm install next-themes
```

### Q: How do I add multi-language support (i18n)?

A: Use `next-i18next`:

```bash
npm install next-i18next
```

### Q: How do I create dynamic routes?

A: Create folders with brackets:

```
app/blog/[slug]/page.js  → /blog/my-post
app/gallery/[id]/page.js  → /gallery/123
```

### Q: How do I handle file uploads?

A: Use form with `enctype="multipart/form-data"` and handle in API route with `multipart/form-data` parser library.

## Getting Help

- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev
- **Framer Motion**: https://www.framer.com/motion/
- **Stack Overflow**: Tag with `next.js` or `framer-motion`
- **GitHub Issues**: Report bugs with reproduction steps

---

**Questions not answered?** Email: bravantmovers.m@gmail.com
