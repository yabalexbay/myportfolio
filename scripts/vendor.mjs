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
};

mkdirSync('assets/icons', { recursive: true });
for (const [name, src] of Object.entries(ICONS)) {
  copyFileSync(`node_modules/devicon/icons/${src}`, `assets/icons/${name}.svg`);
}
copyFileSync('node_modules/devicon/LICENSE', 'assets/icons/LICENSE');

copyFileSync('node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2', 'fonts/inter-latin-wght.woff2');
copyFileSync('node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2', 'fonts/jetbrains-mono-latin-400.woff2');
// Optimised in place by `npx svgo assets/icons/*.svg` (see package.json "vendor").
console.log('vendored', Object.keys(ICONS).length, 'icons and 2 fonts');
