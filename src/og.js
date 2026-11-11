// מפיק את תמונת השיתוף img/brand/share.png מתוך src/og.html, בעזרת כרום ללא חלון.
// הרצה:  node src/og.js
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const os = require('os');

const DIR  = __dirname;
const ROOT = path.join(DIR, '..');
const OUT  = path.join(ROOT, 'img', 'brand', 'share.png');

const candidates = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];
const browser = candidates.find(p => fs.existsSync(p));
if (!browser) throw new Error('לא נמצא כרום או אדג׳ להפקת התמונה');

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'og-shot-'));
const url = 'file:///' + path.join(DIR, 'og.html').replace(/\\/g, '/');

execFileSync(browser, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  '--window-size=1200,630',
  '--virtual-time-budget=8000',   // זמן לטעינת הפונטים מגוגל
  '--user-data-dir=' + profile,
  '--screenshot=' + OUT,
  url,
], { stdio: 'inherit' });

fs.rmSync(profile, { recursive: true, force: true });
const kb = (fs.statSync(OUT).size / 1024).toFixed(0);
console.log('img/brand/share.png  |  1200x630  |  ' + kb + 'KB');
