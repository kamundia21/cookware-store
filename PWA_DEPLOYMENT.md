# PWA Deployment & Production Guide

## 🚀 Preparing for Production

### Requirements
- ✅ HTTPS enabled (PWA requires HTTPS in production)
- ✅ All icons added to `public/Image/`
- ✅ manifest.json customized
- ✅ Tested on real devices

---

## 📦 Build & Deploy

### 1. Build for Production
```bash
npm run build
```

This creates an optimized production build in the `dist/` folder with:
- Minified JavaScript
- Optimized CSS
- Service Worker included
- All assets cached

### 2. Test Production Build Locally
```bash
npm run preview
```

Visit: `http://localhost:4173`

Test:
- [ ] All pages load correctly
- [ ] Service Worker registers (DevTools → Application)
- [ ] Install prompt appears
- [ ] Navigation works
- [ ] Offline mode works
- [ ] Cart functionality works

### 3. Deploy to Hosting

#### Option A: Vercel (Recommended for Vite)
```bash
npm i -g vercel
vercel
```

Vercel automatically:
- Enables HTTPS
- Optimizes builds
- Caches assets
- Serves service worker correctly

#### Option B: Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Option C: Traditional Hosting (Apache/Nginx)

**Important:** Configure server to serve files correctly:

**Apache (.htaccess):**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Cache manifest files properly
<FilesMatch "\.(appcache|manifest)$">
  AddType text/cache-manifest .appcache
  AddType application/manifest+json .manifest
  ExpiresActive On
  ExpiresDefault "access plus 0 seconds"
  Header set Cache-Control "max-age=0, no-cache, no-store, must-revalidate"
</FilesMatch>

# Cache assets
<FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg)$">
  ExpiresActive On
  ExpiresDefault "access plus 1 year"
  Header set Cache-Control "max-age=31536000, public"
</FilesMatch>

# Service Worker cache settings
<FilesMatch "^service-worker\.js$">
  AddType application/javascript .js
  ExpiresActive On
  ExpiresDefault "access plus 0 seconds"
  Header set Cache-Control "max-age=0, no-cache, no-store, must-revalidate"
  Header set Pragma "no-cache"
  Header set Expires "0"
</FilesMatch>
```

**Nginx:**
```nginx
server {
  listen 443 ssl http2;
  server_name yourdomain.com;

  ssl_certificate /path/to/cert.pem;
  ssl_certificate_key /path/to/key.pem;

  root /path/to/dist;

  # Service Worker cache policy
  location ~* ^/service-worker\.js$ {
    add_header Cache-Control "max-age=0, no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    add_header Expires "0";
  }

  # Manifest cache policy
  location ~* manifest\.json$ {
    add_header Cache-Control "max-age=0, no-cache, no-store, must-revalidate";
  }

  # Asset caching (1 year)
  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2|woff)$ {
    add_header Cache-Control "max-age=31536000, public, immutable";
  }

  # Single Page App routing
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

---

## ✅ Pre-Deployment Checklist

### Files Ready
- [ ] `public/manifest.json` customized
- [ ] Icons created and placed in `public/Image/`
- [ ] `index.html` has manifest link
- [ ] `public/service-worker.js` exists
- [ ] `src/components/PWAInstall/` files exist

### Configuration
- [ ] Brand colors set in manifest.json
- [ ] App name correct
- [ ] Theme colors match brand
- [ ] All URLs are relative paths
- [ ] No console errors in dev build

### Testing
- [ ] Production build completes: `npm run build`
- [ ] Preview works: `npm run preview`
- [ ] Service Worker registers in DevTools
- [ ] Install prompt appears
- [ ] All navigation works offline (after cache)
- [ ] Cart persists offline
- [ ] Images load correctly

### Mobile Testing
- [ ] Tested on Android device
- [ ] Tested on iPhone
- [ ] Install works on both
- [ ] App runs fullscreen
- [ ] Touch navigation responsive
- [ ] Offline mode verified

---

## 🔒 HTTPS Setup

PWA requires HTTPS in production. Options:

### Free HTTPS
- **Vercel/Netlify:** Automatic
- **Let's Encrypt:** Free SSL certificates
- **Cloudflare:** Free tier includes HTTPS
- **AWS/GCP:** Free tier available

### Verification
```bash
# Check HTTPS is working
curl -I https://yourdomain.com
# Should show "HTTP/2 200" or "HTTPS/200"

# Check service worker loads
curl -I https://yourdomain.com/service-worker.js
# Should show "Cache-Control: max-age=0"
```

---

## 📊 Testing in Production

### Lighthouse Audit
1. Open your production URL
2. Press F12 (DevTools)
3. Go to "Lighthouse" tab
4. Click "Generate report"
5. Check PWA score (should be 90+)

### Installation Testing
1. Visit on Android phone with Chrome
2. Wait for install prompt
3. Install and verify
4. Open from home screen
5. Test offline functionality

6. Visit on iPhone with Safari
7. Tap Share → Add to Home Screen
8. Verify app works
9. Test offline

### Common Issues

**Service Worker not registering:**
- Check HTTPS is enabled
- Verify service-worker.js is at root
- Check Content-Type headers

**Install prompt not showing:**
- Android: Need HTTPS + manifest
- iOS: Safari only, manual install
- Check manifest paths are correct

**Icons not showing:**
- Verify URLs in manifest are absolute or correct relative
- Icons must be PNG format
- Check icon files exist on server

---

## 📈 Monitor After Launch

### Key Metrics to Track
- PWA installations per day
- Install-to-launch ratio
- App engagement metrics
- Crash reports from offline mode
- Performance metrics (Lighthouse)

### Tools
- Google Analytics - Track installations
- Sentry - Error tracking
- Lighthouse CI - Automated PWA audits
- Webpack Bundle Analyzer - Bundle size

### Sample Analytics Code
```javascript
// Track PWA installation
window.addEventListener('appinstalled', () => {
  gtag('event', 'app_installed', {
    'app_name': 'Cookware Store',
    'timestamp': new Date().toISOString()
  });
  console.log('App installed');
});

// Track install prompt display
window.addEventListener('beforeinstallprompt', (e) => {
  gtag('event', 'install_prompt_shown', {
    'app_name': 'Cookware Store'
  });
});
```

---

## 🔄 Updates & Maintenance

### Service Worker Updates
Service worker automatically updates when files change. Users get new version on next visit.

To force update:
1. Modify a file
2. Rebuild: `npm run build`
3. Deploy
4. Service Worker automatically detects changes

### Version Management
Add version to manifest.json:
```json
{
  "version": "1.0.0",
  "start_url": "/?utm_source=pwa"
}
```

### Cache Busting
Production build automatically handles this with content-hash filenames.

---

## 🚨 Troubleshooting Production

### Service Worker stuck on old version
```javascript
// Clear old service workers (use with caution)
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister());
});
location.reload();
```

### HTTPS not working
- Verify SSL certificate is valid
- Check certificate chain is complete
- Ensure port 443 is open
- Test with: https://www.ssllabs.com/

### Manifest not loading
- Check `<link rel="manifest" href="/manifest.json" />`
- Verify manifest.json is in public root
- Check file is valid JSON
- Test directly: https://yourdomain.com/manifest.json

### Icons 404 errors
- Verify icon paths in manifest
- Check icons exist in public/Image/
- Ensure file permissions are correct
- Test icon URLs directly in browser

---

## 📋 Post-Deployment Checklist

- [ ] Site loads over HTTPS
- [ ] Service Worker registers successfully
- [ ] Install prompt appears on Android
- [ ] Add to Home Screen works on iOS
- [ ] App installs correctly
- [ ] App launches in fullscreen
- [ ] Offline mode works
- [ ] All navigation functional
- [ ] Cart persists
- [ ] Images load
- [ ] Performance is good (Lighthouse > 90)
- [ ] No console errors
- [ ] Analytics tracking works
- [ ] Error reporting configured

---

## 🎉 Launch Complete!

Your PWA is live! Users can now:
- Install from browser
- Access from home screen
- Use offline
- Get native app experience

Monitor metrics and gather feedback for future improvements!

---

## 📚 Resources

- [PWA Deployment Best Practices](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Installing)
- [HTTPS Setup Guide](https://certbot.eff.org/)
- [Service Worker Caching Strategies](https://developers.google.com/web/tools/workbox)
- [Lighthouse PWA Audit](https://developers.google.com/web/tools/lighthouse)

---

Questions? Refer to [PWA_SETUP.md](./PWA_SETUP.md) or consult the PWA documentation.
