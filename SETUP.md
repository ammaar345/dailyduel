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
   **DONE (July 6, 2026):** ad unit `dailyduel-banner` created, slot `1301972363` wired into `AdBanner.tsx`. Manual banners now live on homepage + practice + duel pages.
   **ads.txt** already live at /ads.txt with the correct line.

   **IMPORTANT — turn Auto Ads OFF:** you enabled Auto Ads earlier ("Apply to site"). Auto Ads spams a banner between every card (the whole-screen mess you saw) AND double-runs with the manual banners. Fix:
   - AdSense → **Ads → By site** → click the pencil/edit on `ddailyduel.pages.dev` → toggle **Auto ads OFF** → **Apply to site**
   - Only the 3 manual banners should remain.
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

## Real-time PvP — DONE (July 6, 2026)

Live simultaneous duels are built and verified. Homepage → **Duel a Friend — Live** → you get a room link → send it → friend opens it → 3-2-1 → both race the same daily puzzle live, side by side. First to solve wins.

- Uses PeerJS's **free public broker** (0.peerjs.com) — no account, no server, no cost, nothing for you to configure.
- Test it: open the site in two browsers (or phone + desktop), create a duel in one, paste the link in the other.
- Caveat: the free broker is occasionally flaky/rate-limited. If the lobby can't connect it shows an error + suggests dueling the bot. If it becomes a problem at scale, a self-hosted PeerServer (tiny free-tier box) removes the dependency — tell me and I'll wire it.

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
| AdSense | client + slot (1301972363) wired, ads.txt live; WAITING on you to turn Auto Ads OFF (step 6) |
| Analytics | WAITING ON YOU — step 2 |
| Phone test | WAITING ON YOU — step 3 |
| Custom domain | optional — step 4 |
| Launch posts | after 2+3 — step 5 |
