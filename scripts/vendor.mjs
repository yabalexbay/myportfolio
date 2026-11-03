// Copies the self hosted fonts and the devicon SVGs out of node_modules so the
// site ships with zero runtime CDN requests. Rerun after upgrading either package.
import { copyFileSync, mkdirSync } from 'node:fs';

const ICONS = {
  python: 'python/python-original.svg',
  fastapi: 'fastapi/fastapi-original.svg',
  postgresql: 'postgresql/postgresql-original.svg',
  go: 'go/go-original-wordmark.svg',
  redis: 'redis/redis-original.svg',
  docker: 'docker/docker-original.svg',
  githubactions: 'githubactions/githubactions-original.svg',
  terraform: 'terraform/terraform-original.svg',
  rust: 'rust/rust-original.svg',
  nodejs: 'nodejs/nodejs-original.svg',
  linux: 'linux/linux-plain.svg',
  git: 'git/git-original.svg',
  // UI marks, inlined by the build in currentColor
  github: 'github/github-original.svg',
  linkedin: 'linkedin/linkedin-plain.svg',
};

mkdirSync('assets/icons', { recursive: true });
mkdirSync('fonts', { recursive: true });
for (const [name, src] of Object.entries(ICONS)) {
  copyFileSync(`node_modules/devicon/icons/${src}`, `assets/icons/${name}.svg`);
}
copyFileSync('node_modules/devicon/LICENSE', 'assets/icons/LICENSE');

copyFileSync('node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2', 'fonts/geist-latin-wght.woff2');
copyFileSync('node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2', 'fonts/geist-mono-latin-wght.woff2');
// Optimised in place by `npx svgo assets/icons/*.svg` (see package.json "vendor").
console.log('vendored', Object.keys(ICONS).length, 'icons and 2 fonts');
