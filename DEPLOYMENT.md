# Deployment Guide - Bravant Movers & Cleaners Website

Complete guide for deploying the Bravant Movers website to production.

## Pre-Deployment Checklist

- [ ] All components are tested locally
- [ ] Environment variables are configured
- [ ] Analytics ID is added
- [ ] Contact form is working
- [ ] Mobile responsiveness is verified
- [ ] SEO metadata is complete
- [ ] Legal pages (Privacy, Terms) are finalized
- [ ] All social media links are correct
- [ ] Images are optimized
- [ ] Forms don't send sensitive data to console

## Option 1: Deploy on Vercel (Recommended)

### Step 1: Prepare Your Repository

```bash
# Initialize git if not already done
cd Bravant-Movers
git init
git add .
git commit -m "Initial commit: Bravant Movers website"
```

### Step 2: Push to GitHub

1. Create a GitHub repository
2. Add remote and push:

```bash
git remote add origin https://github.com/yourusername/Bravant-Movers.git
git branch -M main
git push -u origin main
```

### Step 3: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select "Import Git Repository"
4. Search for your repository and import
5. Click "Client" folder in "Root Directory" setting

### Step 4: Configure Environment Variables

1. In Vercel Dashboard → Settings → Environment Variables
2. Add environment variables:
   ```
   NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
   NEXT_PUBLIC_APP_URL=https://bravantmovers.com
   NEXT_PUBLIC_ENABLE_ANALYTICS=true
   ```
3. Click "Save"

### Step 5: Deploy

Click "Deploy" and Vercel will automatically build and deploy your site.

## Option 2: Deploy on Netlify

### Step 1: Build Your Site

```bash
cd Client
npm run build
```

### Step 2: Deploy with Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=.next
```

Or manually:

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `.next` folder to deploy

### Step 3: Configure Environment Variables

1. Site Settings → Build & Deploy → Environment
2. Add your environment variables
3. Trigger a redeploy

## Option 3: Deploy to AWS Amplify

### Step 1: Connect GitHub

1. Go to AWS Amplify Console
2. Click "New App" → "Host Web App"
3. Select GitHub and authorize
4. Select your repository

### Step 2: Configure Build Settings

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd Client
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: Client/.next
    files:
      - "**/*"
  cache:
    paths:
      - Client/node_modules/**/*
```

### Step 3: Deploy

Click "Save and Deploy"

## Option 4: Self-Hosted (Linux/Digital Ocean/AWS EC2)

### Step 1: Connect to Server

```bash
ssh root@your_server_ip
```

### Step 2: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2
```

### Step 3: Clone Repository

```bash
cd /var/www
git clone https://github.com/yourusername/Bravant-Movers.git
cd Bravant-Movers/Client
npm install
npm run build
```

### Step 4: Configure Environment

```bash
nano .env.production.local
```

Add:

```
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_APP_URL=https://bravantmovers.com
```

### Step 5: Start with PM2

```bash
pm2 start npm --name "bravant-app" -- start
pm2 save
sudo pm2 startup
```

### Step 6: Setup Nginx Reverse Proxy

```bash
sudo apt install nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/bravant-movers
```

Add:

```nginx
server {
    listen 80;
    server_name bravantmovers.com www.bravantmovers.com;

    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name bravantmovers.com www.bravantmovers.com;

    ssl_certificate /etc/letsencrypt/live/bravantmovers.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bravantmovers.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Step 7: Enable SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d bravantmovers.com -d www.bravantmovers.com
```

## Post-Deployment Tasks

### 1. Test Your Site

- [ ] Visit your domain
- [ ] Check all pages load
- [ ] Test contact form
- [ ] Verify mobile responsiveness
- [ ] Check SEO in Google Search Console
- [ ] Verify all links work
- [ ] Test social media sharing

### 2. Configure Domain DNS

If using custom domain, update DNS records:

```
A Record:    @  →  Your_Server_IP
A Record:    www →  Your_Server_IP
CNAME Record: email → (if using email forwarding)
```

### 3. Set Up Google Services

#### Google Analytics

1. Create GA4 property at [analytics.google.com](https://analytics.google.com)
2. Get Measurement ID (G-XXXXX)
3. Add to environment variables
4. Verify tracking is working

#### Google Search Console

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property (choose domain or URL prefix)
3. Verify ownership (DNS or file upload)
4. Submit sitemap: `https://yourdomain.com/sitemap.xml`

#### Google Business Profile

1. Create profile at [business.google.com](https://business.google.com)
2. Add business information
3. Verify location
4. Add photos and testimonials

### 4. Set Up Email (Optional)

For handling contact form emails, configure SMTP:

```bash
# Update .env.production with your email service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 5. Monitor Performance

- Set up uptime monitoring
- Configure error tracking (Sentry)
- Monitor Core Web Vitals in Search Console
- Set up automated backups

## Updating Your Site

### Regular Updates via Git

```bash
cd Bravant-Movers
git add .
git commit -m "Update: description of changes"
git push origin main
```

**Vercel**: Automatically redeploys on git push
**Netlify**: Automatically redeploys on git push
**Self-hosted**: Manually pull and restart

### Manual Update (Self-hosted)

```bash
cd /var/www/Bravant-Movers/Client
git pull
npm install
npm run build
pm2 restart bravant-app
```

## Troubleshooting

### Site Not Loading

- Check if application is running: `pm2 list`
- Check logs: `pm2 logs`
- Verify DNS records are correct
- Check firewall rules (port 80/443 open)

### SSL Certificate Issues

- Verify certificate expiration: `certbot certificates`
- Renew certificate: `certbot renew`
- Restart Nginx: `sudo systemctl restart nginx`

### Contact Form Not Working

- Check environment variables are set
- Verify SMTP credentials
- Check server logs for errors
- Test API endpoint: `curl http://localhost:3000/api/contact`

### Performance Issues

- Check Next.js build optimization
- Enable caching headers in Nginx
- Use CDN (CloudFlare, Bunny CDN)
- Optimize images with Next.js Image component

## Security Recommendations

- [ ] Enable HTTPS/SSL certificates
- [ ] Set security headers in Nginx
- [ ] Keep Node.js and dependencies updated
- [ ] Use environment variables for sensitive data
- [ ] Set up firewall rules
- [ ] Enable bot protection (if needed)
- [ ] Regular backups of database (if applicable)
- [ ] Monitor for suspicious activity

## Backup Strategy

### Automated Backups (Self-hosted)

```bash
# Create backup script
nano /root/backup.sh
```

Add:

```bash
#!/bin/bash
BACKUP_DIR="/backups/bravant"
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf $BACKUP_DIR/bravant_$DATE.tar.gz /var/www/Bravant-Movers/
```

Make executable and add to cron:

```bash
chmod +x /root/backup.sh
crontab -e
# Add: 0 2 * * * /root/backup.sh  (daily at 2 AM)
```

## Monitoring & Analytics

### Essential Metrics to Track

1. **Web Analytics**
   - Visitor count
   - Page views
   - Bounce rate
   - Conversion rate

2. **Performance**
   - Page load time
   - Core Web Vitals
   - Server response time

3. **Conversions**
   - Contact form submissions
   - Bookings made
   - Quote requests

### Tools to Use

- Google Analytics 4
- Google Search Console
- Sentry (error tracking)
- UptimeRobot (uptime monitoring)
- Hotjar (user behavior)

## Support & Maintenance

- Regular updates to dependencies
- Monitor and fix broken links
- Update content as needed
- Handle contact form submissions
- Monitor analytics and optimize

---

**Need Help?** Contact: bravantmovers.m@gmail.com
