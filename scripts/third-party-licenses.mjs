// Writes dist/third-party-licenses.txt: the license notice of every package that ships to the
// browser, as their MIT/ISC/OFL licenses require. Production packages are read from
// package-lock.json (entries not marked "dev"), so the list follows the dependencies.
// Runs after `vite build`; usage: node scripts/third-party-licenses.mjs
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const OUTPUT = 'dist/third-party-licenses.txt';
const LICENSE_FILE = /^(licen[sc]e|copying)(\.(md|txt))?$/i;

const lock = JSON.parse(await readFile('package-lock.json', 'utf8'));
const packages = Object.entries(lock.packages)
  .filter(([location, meta]) => location.startsWith('node_modules/') && !meta.dev)
  .map(([location, meta]) => ({
    location,
    name: location.slice(location.lastIndexOf('node_modules/') + 'node_modules/'.length),
    version: meta.version,
    license: meta.license ?? 'UNKNOWN',
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

async function readLicense(location) {
  const file = (await readdir(location)).find((entry) => LICENSE_FILE.test(entry));
  return file ? (await readFile(path.join(location, file), 'utf8')).trim() : undefined;
}

const sections = [];
for (const pkg of packages) {
  const text = await readLicense(pkg.location);
  if (!text) {
    throw new Error(`No license file found for ${pkg.name}@${pkg.version}.`);
  }
  sections.push(`${pkg.name} ${pkg.version} (${pkg.license})\n\n${text}`);
}

const header = [
  'Third-party software used by https://needyfriends.pages.dev',
  '',
  'Brand icons come from Simple Icons (CC0 1.0) through react-icons; each brand belongs to its owner',
  'and is shown only to name the technology a project uses.',
].join('\n');

await writeFile(OUTPUT, `${[header, ...sections].join(`\n\n${'='.repeat(72)}\n\n`)}\n`);
console.log(`${OUTPUT}: ${packages.length} packages`);
