import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * GITHUB PAGES BASE PATH — READ THIS BEFORE DEPLOYING
 * ---------------------------------------------------
 * GitHub Pages serves a project site from a sub-path:
 *
 *     https://USERNAME.github.io/REPO_NAME/
 *
 * Vite needs to know that sub-path so every built asset URL
 * (JS, CSS, fonts) is prefixed correctly. If the base is wrong,
 * the deployed site loads a blank page because index.html points
 * at /assets/... instead of /REPO_NAME/assets/...
 *
 * Rules:
 *   - Repo named `life-command-center`  ->  base: '/life-command-center/'
 *   - Repo named something else         ->  base: '/YOUR_REPO_NAME/'
 *   - User site repo `USERNAME.github.io` -> base: '/'
 *
 * Change REPO_BASE below to match your repository name.
 * Local dev (`npm run dev`) is unaffected — Vite serves the app
 * at http://localhost:5173/life-command-center/ and redirects
 * the root URL there automatically.
 */
const REPO_BASE = '/life-command-center/';

export default defineConfig({
  plugins: [react()],
  base: REPO_BASE,
});
