# DailyDuel — Publish Checklist (Manual Steps)

Everything code-side is done and deployed. This file lists every step **you** must do
by hand to fully publish and monetize, in order. Live site: https://ddailyduel.pages.dev/

---

## 0. How deploys work (read first)

- Cloudflare Pages watches the **`main`** branch of https://github.com/ammaar345/dailyduel
- Any push to `main` auto-builds and goes live in ~1-2 minutes. No dashboard action needed.
- Local dev: `npm run dev` in this folder (vite picks a port, usually 5173/5174)
- Production build test: `npm run build` (must pass before pushing)

---

## 1. Google AdSense (ads revenue) — ~15 min + review wait

Carbon Ads needs 10k monthly views; AdSense has **no minimum**. Code is already wired.

1. Go to https://adsense.google.com and sign in with the Google account you want paid into
2. Click **Get started** → enter site: `ddailyduel.pages.dev`
3. Fill payment country + review Terms → Continue
4. AdSense shows a **verification code snippet** (looks like `<script async src="...ca-pub-XXXX...">`).
   - You do NOT need to paste the whole snippet. Just copy the `ca-pub-XXXXXXXXXXXXXXXX` id from it and send it to me (or paste it yourself, step 6) — the loader script in the app uses it automatically once configured.
   - If AdSense insists on seeing the snippet in the page `<head>` for verification, tell me and I'll add it to `index.html` — that's a 1-line change.
   **DONE (July 3, 2026):** client id `ca-pub-4302153561917574` is already in `index.html` head + `AdBanner.tsx`. Verification script is live — AdSense can detect the site now.
5. Submit for review. **Wait time: a few days to 2 weeks.** The site already has the privacy policy AdSense requires (https://ddailyduel.pages.dev/privacy).
6. **After approval — only 2 things left:**
   a. In AdSense: **Ads → By ad unit → Display ads** → create one, name it `dailyduel-banner` → copy the **slot number** (10 digits) → send it to me, or paste into `ADSENSE_SLOT` in `src/components/ui/AdBanner.tsx` (currently `'XXXXXXXXXX'`). Ads stay hidden until this is filled.
   b. `public/ads.txt` is already created with your id. Confirm the exact line matches what AdSense shows at **Account → ads.txt** (should be `google.com, pub-4302153561917574, DIRECT, f08c47fec0942fa0`). Required or earnings get held.
   c. Commit + push to `main` (or tell me the slot and I do it)
7. Ads appear on: homepage, practice page, duel page. Nothing shows until step 6 is done — that's intentional.

## 2. Cloudflare Web Analytics (free, cookie-free) — 2 min

You can't tell if the launch worked without this.

1. https://dash.cloudflare.com → **Workers & Pages** → click the **dailyduel** project
2. **Metrics** tab (or **Settings → Web Analytics** depending on dashboard version)
3. Toggle **Web Analytics** ON. That's it — Cloudflare injects the beacon automatically, no code.
4. View stats later at dash.cloudflare.com → Analytics & Logs → Web Analytics

## 3. Real phone test — 5 min, before posting anywhere

Open https://ddailyduel.pages.dev/ on your actual phone:

- [ ] Homepage loads, marshmallows rain, no sideways scrolling
- [ ] Practice: type a full word on the on-screen keyboard — keys respond instantly, no zoom-in on tap
- [ ] Duel the Bot: both boards fit side by side
- [ ] Win or lose → result screen → **Share Result** → paste somewhere: text + link look right
- [ ] Copy Challenge Link → open it in another browser (or incognito) → "Accept Challenge — beat X.Xs" appears
- [ ] Settings: switch all 4 themes, toggle sound
- [ ] iPhone Safari specifically if you can — clipboard + audio are the risky bits

If anything's broken, tell me the phone model + what happened.

## 4. Custom domain (optional but recommended before ProductHunt) — ~$10/yr

`ddailyduel.pages.dev` works but looks hobbyist in launch posts.

1. Buy a domain (Cloudflare Registrar is at-cost: dash.cloudflare.com → Domain Registration).
   Ideas: `dailyduel.gg`, `dailyduel.io`, `playdailyduel.com` (dailyduel.app/.com may be taken — check)
2. Cloudflare dashboard → Workers & Pages → dailyduel → **Custom domains** → Add → follow prompts (automatic if the domain is on Cloudflare)
3. Then tell me the domain — I update `src/lib/site.ts`, the og:image URLs in `index.html`, and the ads.txt location in one commit. Old .pages.dev URL keeps working.

## 5. Launch posts — the actual "publish"

Do these AFTER steps 2 & 3. Suggested order:

**Reddit (day 1):**
- r/webgames — title like: "I made a Wordle where you race a bot — and challenge friends to beat your time"
- r/WordGames, r/puzzles — same post, tweak wording
- Rules: most subs require you to engage in comments, don't just drop links. Reply to everyone.

**Friend challenge seeding (day 1+):** win the daily, hit Share, send the "Race me" link to group chats. That link IS the growth loop.

**CrazyGames submission (week 1):** https://developer.crazygames.com → Submit game → they host/promote and rev-share ads. Solves the zero-traffic cold start. Their review takes days; free to submit.

**ProductHunt (week 2, after Reddit feedback):** https://www.producthunt.com/posts/new — launch Tuesday-Thursday, use `marshmallow-source.png` + `public/og.png` as gallery images. First comment: explain the friend-challenge loop.

## 6. Later / optional money

- **Gumroad "Duel Master" $5** (remove ads + exclusive crown): set up at gumroad.com when there's traffic; I build the purchase flow + unlock when you're ready
- **Real-time PvP** (simultaneous duels vs friends): planned via PeerJS free broker, no account needed — say go and I build it. This is the biggest retention upgrade left.

## Known limitations (fine to ship)

- Real-time simultaneous PvP not built yet — duels are vs smart bot; friend duels are async (beat-my-time links)
- Daily puzzle rolls at **UTC midnight**, not local midnight
- 73-word answer pool ≈ 2.5 months of dailies before repeat (expand list later)
- Bot never runs out of guesses in practice, capped at 6 in duels

## Status snapshot (July 3, 2026)

| Item | State |
|---|---|
| Game playable (practice / bot duel / friend duel) | DONE |
| Mobile layout 375px+ | DONE |
| Share links + og preview card | DONE |
| Privacy policy | DONE (live at /privacy) |
| AdSense | client id wired + verification live; WAITING on Google review, then paste slot (step 6a) |
| Analytics | WAITING ON YOU — step 2 |
| Phone test | WAITING ON YOU — step 3 |
| Custom domain | optional — step 4 |
| Launch posts | after 2+3 — step 5 |
