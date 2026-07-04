# Jonathan's Life Command Center

A local-first visual command board. Faith · Family · Fitness · Finance, plus Work, Cross-Pillar Projects, and Research — as a draggable, color-coded thought map.

**Truth first • Family protected • Capacity strengthened • Finances stabilized**

## Privacy model (read this first)

- **No login. No cloud. No analytics. No tracking. No backend.**
- All map data lives in **this browser's IndexedDB** on this device. Two small preferences (first-run acknowledgment, priority-lane open/closed) use localStorage.
- Data leaves the device **only** when you click Export JSON.
- The GitHub repository holds **only** app source code, the safe starter seed skeleton, and documentation. Your personal edits never enter the repo — the deployed site is just code; your data stays in your browser.
- Do **not** store passwords, account numbers, private keys, recovery codes, bank/card numbers, or customer records in the app. Encrypted Locked Thought Bubbles arrive in Phase 2; until then every node is plain text on the device.

## Run locally

Requirements: Node.js 18+ (20 recommended) and npm.

```bash
npm install
npm run dev
```

Open the printed URL (it will look like `http://localhost:5173/life-command-center/`).

Other commands:

```bash
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build locally to test it
```

## Using the app

- **Add a thought:** click **+ Thought**, or double-click empty canvas to drop one right there.
- **Edit:** click any node — the Inspector opens on the right. Title, description, next tiny action, pillar, status, priority stars, time horizon, tags, people, notes.
- **Move:** drag nodes anywhere. Positions save automatically ("● Saved locally" in the top bar).
- **Connect:** hover a node, drag from the small handle on its edge to another node. Cross-links show as dashed teal lines; remove them from the Inspector.
- **Views:** Four Pillars (everything), Priority Now, Backlog Board (drag cards between status columns), Family-Centered, Cash Engine. Risk & Watchdog is a Phase 2 placeholder.
- **Priority Lane:** the strip along the bottom shows your top five (★ Priority Now first, then by stars).
- **Search:** filters the map live; parent branches stay visible for context.
- **Zoom/pan:** scroll wheel or pinch to zoom, drag empty canvas to pan, minimap bottom-right.

## Editing the seed data

The starter skeleton lives in `src/seedData.ts`. Each branch is a plain object — edit titles, descriptions, statuses (`s`), priority (`p`), horizons (`h`), people, and tags there. The seed only loads on **first run** (or after **Reset**); once the app has saved to IndexedDB it uses your saved map, not the file.

Keep the seed file repo-safe: starter titles only, no private details.

## Backups

- **Export JSON** downloads `lcc-backup-YYYY-MM-DD.json` — your entire map.
- **Import** restores from a backup file (it replaces the current map after confirming).
- Recommended rhythm: export weekly and after big mapping sessions. Store backups somewhere private — an encrypted drive, a private folder, a password manager's file vault. **Never commit backups to the repo** (the `.gitignore` blocks common backup filenames, but don't rely on it — just keep them out).

---

## Deploy to GitHub Pages

The repo is set up for **Vite + GitHub Actions + GitHub Pages**. Pushing to `main` builds and deploys automatically.

### The base path issue (why blank pages happen)

GitHub Pages serves a project site from a sub-path, not the domain root:

```
https://USERNAME.github.io/REPO_NAME/
```

Vite must prefix every asset URL with that sub-path. That's the `base` setting in `vite.config.ts`:

```ts
const REPO_BASE = '/life-command-center/';
```

Rules:

- Repo named `life-command-center` → `base: '/life-command-center/'`
- Repo named anything else → `base: '/YOUR_REPO_NAME/'` (trailing slash matters)
- User site repo named `USERNAME.github.io` → `base: '/'`

If the base doesn't match the repo name, the deployed page loads blank because the browser requests `/assets/...` instead of `/REPO_NAME/assets/...`.

### Step-by-step deployment

**1. Create the GitHub repository**

- Go to github.com → **New repository**.
- Name it `life-command-center` (or anything — then update `REPO_BASE` in `vite.config.ts` to match).
- Public or private both work; **note:** if the repo is public, the app code and seed data are public. Your personal map data is never in the repo either way.
- Don't initialize with a README (this project already has one).

**2. Push the project**

From the project folder:

```bash
git init
git add .
git commit -m "Initial Life Command Center app"
git branch -M main
git remote add origin https://github.com/USERNAME/life-command-center.git
git push -u origin main
```

Replace `USERNAME` with your GitHub username (and the repo name if you changed it).

**3. Enable GitHub Pages via Actions**

- In the repo: **Settings → Pages**.
- Under **Build and deployment → Source**, choose **GitHub Actions** (not "Deploy from a branch").

**4. Run the deployment**

The push in step 2 already triggered the workflow. Check the **Actions** tab — you'll see "Deploy to GitHub Pages" running. First run takes 1–3 minutes. You can also re-run it manually from the Actions tab (the workflow has `workflow_dispatch`).

**5. Find the live link**

- **Settings → Pages** shows the URL, or
- Open the completed workflow run — the `deploy` job shows the URL.

It will be:

```
https://USERNAME.github.io/life-command-center/
```

**6. Updating the app later**

Edit code, then:

```bash
git add .
git commit -m "Describe the change"
git push
```

Every push to `main` redeploys automatically. Your browser data is untouched by redeploys — it lives in IndexedDB, separate from the site's code.

### ⚠️ Warnings

- **Public repo = public code.** Anyone can read the source and the starter seed skeleton. That's fine — but it means the seed file must stay generic.
- **Personal data stays in the browser.** The live site is static code; your edits never upload anywhere. Back them up via Export JSON.
- **Never commit:** exported JSON backups, `.env` files, API keys, real financial data, customer records, or private mind-map exports. The `.gitignore` blocks `node_modules/`, `dist/`, `.env*`, and common backup filename patterns — but the discipline is yours: backups go in a private location, not the repo.
- **IndexedDB is per browser, per device, per URL.** Your localhost map and your GitHub Pages map are two separate stores. Move data between them with Export/Import.

### Troubleshooting

**Blank page after deploy**
Almost always the base path. Confirm `REPO_BASE` in `vite.config.ts` exactly matches your repo name with leading and trailing slashes (`'/life-command-center/'`), commit, push. Check the browser console — 404s on `/assets/...` confirm it.

**Wrong base path / assets not loading (404 on JS/CSS/fonts)**
Same fix as above. Also confirm you deployed the `dist` folder via the workflow (Pages source = "GitHub Actions"), not a raw branch.

**404 on refresh**
This app is a single route, so plain refresh works. If you later add client-side routing, GitHub Pages will 404 on deep links; the standard fix is a `404.html` that redirects to `index.html`, or use hash-based routing.

**GitHub Actions failed**
Open the failed run in the Actions tab and read the failing step. Common causes: Pages source not set to "GitHub Actions" (deploy step fails with permissions error), or a TypeScript error (build step fails — run `npm run build` locally to see the same error). The workflow needs the `pages: write` and `id-token: write` permissions, which are already in `deploy.yml`.

**Camera/mic permissions on the deployed site (future phases)**
Browsers only allow camera/microphone on secure contexts. GitHub Pages is HTTPS, so Phase 3/4 voice and gesture features will work there. `localhost` also counts as secure. A plain `http://` LAN address will not.

**IndexedDB / local storage behavior per browser and device**
- Data does not sync between browsers, devices, profiles, or between localhost and the deployed URL.
- Private/incognito windows discard IndexedDB when closed.
- Safari can evict storage for sites unused for extended periods; iOS is the most aggressive.
- "Clear browsing data" deletes the map.
- Defense: export JSON backups regularly.

---

## What's in Phase 1 (this build)

- Local-first visual mind map seeded with the full starter skeleton (~70 nodes)
- Drag, connect, add (double-click canvas), edit, archive, delete
- Pillar color system, status badges, priority stars, next-action lines
- Node Inspector side panel
- Five working views + Backlog board with drag-between-columns
- Priority Lane (top five)
- Live search
- IndexedDB autosave with save indicator, JSON export/import, seed reset
- First-run privacy briefing
- GitHub Pages deployment pipeline

## Known limitations (honest list)

- **No encryption yet.** The 🔒 Lock button is a disabled Phase 2 placeholder; all node content is plain text in browser storage.
- **No Watchdog diagnostics yet.** The data model reserves the fields (`diagnostics`, `encryptedPayload`, `locked`) so Phase 2 adds panels, not migrations.
- **No voice, no camera gestures, no AI** — Phases 3–5 by design.
- **Single map document.** No multi-map workspaces.
- **No undo.** Delete asks for confirmation, but there's no undo stack yet. Export before big reorganizations.
- **No Markdown/print export yet** (JSON only in Phase 1).
- Positions are free-form; there's no auto-relayout button after heavy dragging.

## Next steps (Phase 2)

1. Watchdog Diagnostic Panel: the ten diagnostic fields, green/yellow/red/lock result, rule-based recommendations.
2. Locked Thought Bubbles: AES-GCM via Web Crypto, PBKDF2 key derivation, per-node salt+IV, auto-lock timeout, encrypted export.
3. Undo stack and Markdown export are strong candidates to fold in.

## Architecture (plain English)

- `src/types.ts` — the single data model. Phase 2 fields already reserved.
- `src/constants.ts` — pillars, colors, statuses, views.
- `src/seedData.ts` — starter skeleton + computed radial layout.
- `src/db.ts` — IndexedDB read/write (whole-document, no dependencies).
- `src/store.ts` — all state and actions (Zustand), debounced autosave, export/import.
- `src/views.ts` — each view is a filter predicate; adding a lens = adding a case.
- `src/components/` — TopBar, MapCanvas (React Flow), ThoughtNodeCard, Inspector, BacklogBoard, PriorityLane, FirstRunNotice.

Stack: React 18 · TypeScript · Vite · @xyflow/react (React Flow 12) · Zustand · IBM Plex + Marcellus fonts bundled locally (no CDN, works offline).
