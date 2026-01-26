# Quick Start: Testing the PWA Mobile App

## 🚀 Get Started in 3 Steps

### Step 1: Run the App
```bash
npm install
npm run dev
```
Access at: `http://localhost:5173`

### Step 2: Test Installation Prompt

**On Android (Chrome/Edge):**
- Open on a real Android device
- Wait 2-3 seconds, you'll see "Install" prompt at bottom
- Tap "Install"
- App appears in app drawer

**On iPhone (Safari):**
1. Open URL in Safari
2. Tap Share button (↗️)
3. Select "Add to Home Screen"
4. Name your app and tap "Add"

### Step 3: Test Offline Mode
1. Install the app
2. Open it once while online
3. Go to DevTools → Application → Service Workers
4. Check "Offline" checkbox
5. Close and reopen the app - it should still load!

---

## 📱 Test on Your Phone

Get local IP address:
```bash
# Windows
ipconfig

# Mac/Linux  
ifconfig
```

On your phone, visit: `http://YOUR_IP:5173`

Example: `http://192.168.1.100:5173`

---

## 🎨 Customize App Appearance

### App Name
Edit `public/manifest.json`:
```json
{
  "name": "Your Store Name",
  "short_name": "Store"
}
```

### Colors
Edit `public/manifest.json` and `index.html`:
```json
"theme_color": "#8B4513",        // Your brand color
"background_color": "#ffffff"
```

### Icons (Important!)
1. Create icons and save to `public/Image/`:
   - `icon-192.png` (192x192)
   - `icon-512.png` (512x512)
   - `icon-maskable.png` (192x192)

2. Update paths in `public/manifest.json`

---

## ✅ Verify Setup

Open **DevTools** (F12) and check:

**Application Tab:**
- ✅ Manifest loads without errors
- ✅ Service Worker registered
- ✅ Icons are listed
- ✅ Theme color matches your brand

**Lighthouse Tab:**
- Run audit
- PWA score should be 90+

---

## 🐛 Troubleshooting

**Install prompt not showing?**
- Android: Needs user interaction first
- iOS: Use manual "Add to Home Screen"
- Chrome: Check manifest.json syntax

**Service Worker not working?**
- Clear cache: DevTools → Application → Storage → Clear all
- Restart dev server
- Hard refresh (Ctrl+Shift+R)

**Icons not showing?**
- Verify file names in `public/Image/`
- Match paths in `manifest.json`
- PNG format required

---

## 📦 Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Production PWA requires HTTPS!

---

## 🎯 What Users See

1. **Android:** "Install Advenco Global Cookware Store" prompt appears
2. **iOS:** Share menu with "Add to Home Screen" option
3. **Both:** Beautiful branded app icon on home screen
4. **Both:** App launches fullscreen (no browser UI)
5. **Both:** Works offline after first visit

---

## 📚 Files You Need to Know

- `public/manifest.json` - App config
- `public/service-worker.js` - Offline support  
- `src/components/PWAInstall/` - Install UI
- `index.html` - PWA registration
- `src/App.jsx` - PWA component integration

---

That's it! Your app is ready for mobile. 🎉
