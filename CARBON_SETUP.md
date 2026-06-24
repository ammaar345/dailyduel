# Carbon Ads Setup Instructions

## Quick Setup (5 minutes)

### 1. Sign Up for Carbon Ads
- Go to https://carbonads.net/
- Click "Get Started"
- Fill out the form (it's free)
- Verify your email

### 2. Create Your First Ad Unit
- After logging in, click "New Ad Unit"
- Choose "Display Ad"
- Set your website URL (will be dailyduel.app when deployed)
- Choose your ad size (300x250 works well)
- Set your daily cap (start with 10-15 impressions per day)
- Save the ad unit

### 3. Get Your Placement ID
- Find your ad unit in the dashboard
- Click "Get Code" 
- Copy the "Placement ID" (it's a long string of letters/numbers)
- Example: `CE7IA5QY`

### 4. Update the Ad Code
Open `src/components/ui/AdBanner.tsx` and replace `YOUR_PLACEMENT_ID`:

```typescript
script.src = `https://cdn.carbonads.com/carbon.js?serve=CE7IA5QY&format=cover`
```

### 5. Deploy to GitHub Pages
- Run `npm run build`
- Push to `gh-pages` branch
- Carbon Ads will start showing once live

## Important Notes

- Carbon Ads pays ~$3-5 RPM for gaming audiences
- They review sites before serving ads (may take 1-2 days)
- Start with low daily cap until approved
- Only shows to free users (we'll hide for premium later)

## Revenue Projection
- 1K daily duels = $90-150/month
- 10K daily duels = $900-1,500/month