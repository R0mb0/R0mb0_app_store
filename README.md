<div align="center">
<h1>🛍️ GitHub App Store 🚀</h1>

<p>
Turn your GitHub profile into a modern, interactive App Store.
Automatically showcase your public repositories with smart thumbnail extraction, fuzzy search, an interactive category &amp; topic tree, language/stack filters (including a quick HTML / CSS / JS preset), multi-language UI, and Light/Dark mode — all powered by Next.js + Vercel.
</p>

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/c19b6a0dce8b4ba0ad1ea69c81d5791c)](https://app.codacy.com/gh/R0mb0/R0mb0_app_store/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/R0mb0/R0mb0_app_store)
[![Open Source Love svg3](https://badges.frapsoft.com/os/v3/open-source.svg?v=103)](https://github.com/R0mb0/R0mb0_app_store)
![License](https://img.shields.io/badge/license-BSD%203--Clause-blue.svg?style=plastic)
[![Donate](https://img.shields.io/badge/PayPal-Donate%20to%20Author-blue.svg)](http://paypal.me/R0mb0)


<h2><a href="https://r0mb0appstore.vercel.app/">👉 Click here to test the app! 👈</a></h2>

[![01.png](https://github.com/R0mb0/R0mb0_app_store/blob/main/Readme_imgs/01.png)](https://r0mb0appstore.vercel.app/)

<div align="center">
  <a href="http://paypal.me/R0mb0">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/R0mb0/Support_the_dev_badge/blob/main/Badge/SVG/Support_the_dev_badge_Dark.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://github.com/R0mb0/Support_the_dev_badge/blob/main/Badge/SVG/Support_the_dev_badge_Light.svg">
      <img alt="Saved you time? Support the dev" src="https://github.com/R0mb0/Support_the_dev_badge/blob/main/Badge/SVG/Support_the_dev_badge_Default.svg">
    </picture>
  </a>
</div>

<hr>

<!-- Badges: add your GitHub Actions, Codacy, Maintenance, License, and Donate badges here -->

</div>

<!-- Screenshots: add your app preview screenshots here -->

<hr>

<h2>✨ Features</h2>
<ul>
  <li><strong>Modern App Store UI</strong>: Clean, responsive card grid with smooth <code>Framer Motion</code> animations and an interactive detail modal for every project.</li>
  <li><strong>Smart Thumbnail Extraction</strong>: Automatically pulls the first real screenshot from each repository's <code>README.md</code> (filtering out SVG badges and shields). If none is found, it inspects folders like <code>readme_imgs</code>, <code>Readme_images</code>, <code>screenshots</code>, <code>images</code>, or <code>assets</code>.</li>
  <li><strong>Interactive Category Tree</strong>: Organizes repositories into macro-categories (trunk) with dynamic contextual <code>#topic</code> sub-tags (branches) and active filter breadcrumbs.</li>
  <li><strong>Language &amp; Stack Filtering</strong>: Reads all languages used in each repository with official GitHub colors, plus a one-click <strong>HTML / CSS / JS</strong> stack filter.</li>
  <li><strong>Instant Fuzzy Search</strong>: Powered by <code>Fuse.js</code> to search across project names, topics, descriptions, and README content in real time.</li>
  <li><strong>Live Demo Detection</strong>: Highlights repositories with a configured homepage URL with a live indicator and direct launch button.</li>
  <li><strong>Multi-Language Interface (i18n)</strong>: Built-in language switcher supporting English, Italian, Spanish, French, German, and Portuguese.</li>
  <li><strong>Theme Mode</strong>: Light / Dark / System mode with persisted user preference.</li>
  <li><strong>Secure &amp; Fast by Design</strong>: Your GitHub token is kept strictly server-side via Next.js API routes (<code>/api/catalog</code>) with automatic response caching.</li>
</ul>

<h2>🧠 How It Works (Data &amp; Thumbnails)</h2>
<ul>
  <li>Repositories are fetched server-side using the <strong>GitHub GraphQL API</strong> (public, non-fork, non-archived repositories owned by <code>GITHUB_USERNAME</code>).</li>
  <li>For thumbnails, the parser ignores common badge domains and <code>.svg</code> files to avoid showing status badges as app covers.</li>
  <li>If a repository's README has no raster image (<code>.png</code>, <code>.jpg</code>, <code>.webp</code>, <code>.gif</code>), the backend checks the repository root for image folders (e.g., <code>readme_imgs</code>, <code>Readme_images</code>, <code>screenshots</code>) via the GitHub REST API and uses the first valid image found.</li>
  <li>If an image fails to load or none exists, the card gracefully falls back to a styled placeholder cover.</li>
</ul>

<h2>🛠️ Tech Stack</h2>
<ul>
  <li><strong>Framework:</strong> Next.js (App Router, TypeScript)</li>
  <li><strong>Styling:</strong> Tailwind CSS</li>
  <li><strong>Animations:</strong> Framer Motion</li>
  <li><strong>Search:</strong> Fuse.js</li>
  <li><strong>Icons:</strong> Lucide React</li>
  <li><strong>APIs:</strong> GitHub GraphQL API &amp; GitHub REST API</li>
  <li><strong>Deployment:</strong> Vercel</li>
</ul>

<h2>⚡ Local Development</h2>
<ol>
  <li><strong>Clone the repository</strong></li>
</ol>

<pre><code class="language-bash">git clone https://github.com/R0mb0/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
npm install</code></pre>

<ol start="2">
  <li><strong>Create a GitHub Personal Access Token (PAT)</strong>:
    <ul>
      <li>Go to GitHub → <strong>Settings</strong> → <strong>Developer settings</strong> → <strong>Personal access tokens</strong>.</li>
      <li>Generate a token with read access to public repositories (<code>public_repo</code> for classic tokens, or <em>Public Repositories (read-only)</em> for fine-grained tokens).</li>
    </ul>
  </li>
  <li><strong>Create the environment file</strong> in the project root:</li>
</ol>

<pre><code class="language-bash"># .env.local
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxx
GITHUB_USERNAME=your_github_username</code></pre>

<ol start="4">
  <li><strong>Run the development server</strong></li>
</ol>

<pre><code class="language-bash">npm run dev</code></pre>

<p>Open <code>http://localhost:3000</code> in your browser.</p>

<h2>🚀 Deploy on Vercel (Step-by-step)</h2>
<ol>
  <li>Fork or push this repository to your GitHub account (<code>main</code> branch).</li>
  <li>Go to <a href="https://vercel.com/new">Vercel → New Project</a> and import your repository.</li>
  <li>Under <strong>Framework Preset</strong>, make sure <strong>Next.js</strong> is selected (leave Build Command and Output Directory on their default settings — do <em>not</em> override Output Directory).</li>
  <li>Add the Environment Variables in Vercel Project Settings:
    <ul>
      <li><code>GITHUB_TOKEN</code> = your GitHub Personal Access Token</li>
      <li><code>GITHUB_USERNAME</code> = your GitHub username</li>
    </ul>
  </li>
  <li>Click <strong>Deploy</strong>.</li>
  <li>Whenever you update environment variables, trigger a <strong>Redeploy</strong> from the Deployments tab.</li>
</ol>

<h2>🎨 Customization Tips</h2>
<ul>
  <li><strong>Categories &amp; Tag Grouping:</strong> Edit <code>src/lib/categorizer.ts</code> to customize macro-categories, topic mappings, or language presets (such as <code>WEB_TRIO_LANGUAGES</code>).</li>
  <li><strong>Translations:</strong> Add or modify UI strings in <code>src/lib/i18n.ts</code>.</li>
  <li><strong>Repository Previews:</strong> For the best visual result in your store, include a screenshot (<code>.png</code>, <code>.jpg</code>, or <code>.webp</code>) in your repo's <code>README.md</code> or inside a <code>readme_imgs/</code> folder, and add descriptive GitHub Topics and a Homepage URL for live demos.</li>
</ul>

<h2>🧩 Project Structure</h2>

<pre><code class="language-text">src/
  app/
    api/
      catalog/
        route.ts
    layout.tsx
    page.tsx
  components/
    AppCard.tsx
    AppModal.tsx
    LanguageProvider.tsx
    LanguageSelector.tsx
    LoadingScreen.tsx
    SearchBar.tsx
    StoreClient.tsx
    TagTree.tsx
    ThemeToggle.tsx
  lib/
    categorizer.ts
    github.ts
    i18n.ts
    readmeParser.ts
  types/
    repo.ts</code></pre>

<hr>


  <a href="https://github.com/R0mb0/Crafted_with_AI">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/R0mb0/Crafted_with_AI/blob/main/Badge/SVG/CraftedWithAIDark.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://github.com/R0mb0/Crafted_with_AI/blob/main/Badge/SVG/NotMadeByAILight.svg">
      <img alt="Crafted with AI" src="https://github.com/R0mb0/Crafted_with_AI/blob/main/Badge/SVG/NotMadeByAIDefault.svg">
    </picture>
  </a>
