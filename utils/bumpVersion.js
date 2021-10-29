/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable require-jsdoc */
const fs = require('fs');
const pkg = require('../package.json');

const { version } = pkg;

const args = process.argv.map((a) => a.replace(/^-+/, ''));
const versionSplit = version.split('.').map((v) => Number(v));

if (args.includes('ma')) versionSplit[0] += 1;
if (args.includes('mi')) versionSplit[1] += 1;
if (args.includes('p')) versionSplit[2] += 1;
let newVersion = versionSplit.join('.');

if (newVersion === version) {
  versionSplit[2] += 1;
}
newVersion = versionSplit.join('.');

pkg.version = newVersion;
fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));

console.log(newVersion);
