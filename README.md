# NS Reset — PWA

Nervous system regulation + Builder Mode for neurodivergent entrepreneurs.

## Deploy to Vercel

### Option A: GitHub → Vercel (Recommended)

1. Create a new repo on GitHub (e.g. `ns-reset`)
2. Push this code:
   ```bash
   git init
   git add .
   git commit -m "NS Reset v1"
   git remote add origin https://github.com/YOUR_USERNAME/ns-reset.git
   git push -u origin main
   ```
3. Go to [vercel.com/new](https://vercel.com/new)
4. Import the repo
5. Click **Deploy**
6. Your app is live at `ns-reset-XXXXX.vercel.app`

### Option B: Vercel CLI

```bash
npm i -g vercel
vercel
```

## Add to iPhone Home Screen

1. Open the Vercel URL in **Safari** on your iPhone
2. Tap the **Share button** (square with arrow)
3. Tap **Add to Home Screen**
4. Name it "NS Reset"
5. Tap **Add**

Opens full-screen, no browser chrome. Looks and feels like a native app.

## Custom Domain (Optional)

In Vercel dashboard → Settings → Domains → add `reset.yourdomain.com` or whatever you want.

## Data

All data stored in localStorage on your device. Use the ⚙ Settings screen to export/import backups.
