# Connect 4 - Deployment Guide for Hostinger

This guide explains how to deploy your Connect 4 game to Hostinger hosting.

**Author:** M. Cooper
**Website:** www.mcooper.com
**Last Updated:** 2025-11-04

---

## Prerequisites

- Hostinger hosting account with File Manager or FTP access
- Node.js installed locally (for building the project)
- Git installed (optional, for version control)

---

## Step 1: Build the Production Version

1. **Navigate to your project directory:**

   ```bash
   cd /mnt/c/Projects/Project/connect4
   ```

2. **Install dependencies** (if not already installed):

   ```bash
   npm install --no-bin-links
   ```

3. **Run the production build:**

   ```bash
   npm run build
   ```

   This will:
   - Run TypeScript type checking
   - Bundle and optimize all files
   - Generate a `dist/` folder with production-ready files

4. **Verify the build:**
   ```bash
   npm run preview
   ```
   Open `http://localhost:4173` to test the production build locally.

---

## Step 2: Prepare Files for Upload

The `dist/` folder contains everything needed for deployment:

```
dist/
├── index.html              # Main HTML file
├── assets/
│   ├── index-[hash].js     # Bundled JavaScript
│   └── index-[hash].css    # Bundled CSS
├── manifest.json           # PWA manifest
├── robots.txt              # Search engine instructions
├── sitemap.xml             # Site structure for SEO
└── *.png                   # Icons and images
```

---

## Step 3: Deploy to Hostinger

### Option A: Using File Manager (Recommended)

1. **Log in to Hostinger:**
   - Go to [hpanel.hostinger.com](https://hpanel.hostinger.com)
   - Navigate to **Hosting** → **File Manager**

2. **Navigate to your website's root directory:**
   - Go to `public_html/` (for main domain)
   - OR `public_html/connect4/` (for subdirectory)

3. **Upload the dist/ folder contents:**
   - Click **Upload Files**
   - Select ALL files from the `dist/` folder
   - Upload them to your chosen directory

4. **Set correct permissions:**
   - Select all uploaded files
   - Set permissions to `644` for files
   - Set permissions to `755` for directories

### Option B: Using FTP (Alternative)

1. **Get FTP credentials from Hostinger:**
   - In hPanel, go to **Hosting** → **FTP Accounts**
   - Note your FTP hostname, username, and password

2. **Connect using an FTP client** (e.g., FileZilla):
   - Host: `ftp.yourdomain.com`
   - Username: `your-ftp-username`
   - Password: `your-ftp-password`
   - Port: `21` (or `22` for SFTP)

3. **Upload dist/ folder contents:**
   - Navigate to `public_html/` or `public_html/connect4/`
   - Upload all files from your local `dist/` folder

---

## Step 4: Configure Domain/Subdomain

### For Main Domain (www.mcooper.com)

The files should be in `public_html/` directory.

### For Subdirectory (www.mcooper.com/connect4)

1. **Create the subdirectory:**

   ```
   public_html/connect4/
   ```

2. **Upload files to this directory**

3. **Update base path in code** (if needed):
   - In `vite.config.ts`, add:
     ```ts
     export default defineConfig({
       base: '/connect4/',
       // ... other config
     })
     ```
   - Rebuild and redeploy

### For Subdomain (connect4.mcooper.com)

1. **Create subdomain in Hostinger:**
   - Go to **Hosting** → **Subdomains**
   - Add subdomain: `connect4`
   - Document root: `public_html/connect4`

2. **Upload files to the subdomain directory**

---

## Step 5: Configure .htaccess (Optional - For Performance)

This game uses **HashRouter**, which means routing is handled client-side using URL hashes (e.g., `/#/`). This eliminates the need for server-side routing configuration! However, you can optionally create a `.htaccess` file for performance and security enhancements:

```apache
# Redirect to HTTPS (recommended for security)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

# Compression for better performance
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
  ExpiresByType application/pdf "access plus 1 month"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

**Note:** The `.htaccess` file is **optional** for this game since we use HashRouter. No routing rules needed!

---

## Step 6: Verify Deployment

**Important:** This game uses **HashRouter**, so URLs will include a hash (#) symbol:

- Main domain: `https://www.mcooper.com/#/`
- Subdirectory: `https://www.mcooper.com/connect4/#/`
- Subdomain: `https://connect4.mcooper.com/#/`

1. **Visit your website** using the appropriate URL above

2. **Test all functionality:**
   - ✅ Game loads correctly
   - ✅ All graphics display
   - ✅ Sound effects work
   - ✅ Tutorial and help dialogs open
   - ✅ Keyboard shortcuts work
   - ✅ Leaderboard saves data
   - ✅ AI opponents play correctly

3. **Test on mobile devices:**
   - ✅ Responsive layout works
   - ✅ Touch controls work
   - ✅ PWA manifest loads

4. **Verify SEO:**
   - Check `robots.txt`: `https://www.mcooper.com/connect4/robots.txt`
   - Check `sitemap.xml`: `https://www.mcooper.com/connect4/sitemap.xml`
   - Check Open Graph tags: Use [Open Graph Debugger](https://www.opengraph.xyz/)

---

## Step 7: Optional Enhancements

### SSL Certificate (HTTPS)

1. **Enable SSL in Hostinger:**
   - Go to **Hosting** → **SSL**
   - Install free Let's Encrypt SSL certificate
   - Force HTTPS redirect (already in .htaccess above)

### Custom Domain

1. **Point custom domain to Hostinger:**
   - Update DNS records at your domain registrar
   - Add A record pointing to Hostinger's IP
   - Wait for DNS propagation (24-48 hours)

### Analytics

Add Google Analytics to `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID"></script>
<script>
  window.dataLayer = window.dataLayer || []
  function gtag() {
    dataLayer.push(arguments)
  }
  gtag('js', new Date())
  gtag('config', 'YOUR-GA-ID')
</script>
```

---

## Troubleshooting

### Issue: Blank page after deployment

**Solution:** Check browser console for errors. Likely causes:

- Base path misconfigured in Vite
- Files uploaded to wrong directory
- Missing .htaccess file

### Issue: 404 errors on page refresh

**Solution:** This shouldn't happen with HashRouter! If it does:

- Verify all files are uploaded correctly
- Check that index.html is accessible
- Clear browser cache

### Issue: Assets not loading (404)

**Solution:**

- Verify all files from `dist/assets/` were uploaded
- Check file permissions (should be 644)
- Clear browser cache

### Issue: PWA not working

**Solution:**

- Ensure manifest.json is accessible
- Verify HTTPS is enabled
- Check icon files are present

---

## Updating the Game

To deploy updates:

1. Make changes to source code
2. Run `npm run build`
3. Upload new `dist/` files to Hostinger (overwrite existing)
4. Clear browser cache or use hard refresh (Ctrl+Shift+R)

---

## Performance Optimization

### Enable Gzip Compression

Already included in .htaccess above. Reduces file sizes by ~70%.

### CDN (Optional)

For better global performance, consider using Hostinger's Cloudflare integration.

### Image Optimization

- Icons are already optimized SVGs
- Consider adding WebP versions of any PNG images

---

## Backup

**Always keep backups:**

- Keep source code in Git repository
- Download `dist/` folder after each build
- Use Hostinger's backup feature (if available)

---

## Support

For Hostinger-specific issues:

- [Hostinger Help Center](https://support.hostinger.com/)
- Live chat support available 24/7

For game code issues:

- Review this deployment guide

---

## Checklist

Before going live:

- [ ] Production build completed successfully
- [ ] All files uploaded to correct directory
- [ ] .htaccess file configured
- [ ] SSL certificate enabled
- [ ] Domain/subdomain configured
- [ ] Tested on desktop browsers
- [ ] Tested on mobile devices
- [ ] Verified PWA functionality
- [ ] Checked robots.txt and sitemap.xml
- [ ] Analytics configured (optional)
- [ ] Backup created

---

**Congratulations!** 🎉 Your Connect 4 game is now live on www.mcooper.com!

Designed with ❤️ by M. Cooper
