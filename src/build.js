// בונה את index.html שבשורש המאגר מתוך template.html + he.js + data/models.json
// הרצה:  node src/build.js          -> index.html  (האתר החי)
//        node src/build.js --artifact -> build/artifact.html (לגרסת הארטיפקט בקלוד)
const fs = require('fs');
const path = require('path');
const DIR  = __dirname;
const ROOT = path.join(DIR, '..');

const clean = require('./data/models.json');
const he    = require('./he.js');
const guide = require('./guide.js');
const dr    = require('./drive.js');
const blocks= require('./data/blocks.json');
const cr    = require('./credits.js');

const order = ['changing-rotation-angle','one-way-doors','swinging-mechanisms','worm-gears','first-fll-bioglow-mission-models'];

// ---- 1. מיזוג התוכן העברי עם נתוני הדגמים ----
const missing = [], models = [];
const heSlugs = Object.keys(he.models);
for (const c of order) {
  const inCat = clean.filter(m => m.cat === c)
                     .sort((a,b) => heSlugs.indexOf(a.slug) - heSlugs.indexOf(b.slug));
  for (const m of inCat) {
    const h = he.models[m.slug];
    if (!h) { missing.push(m.slug); continue; }
    models.push({ s:m.slug, he:h.he, en:m.title, c:m.cat, img:m.img, pdf:m.pdf, zip:m.zip, src:m.src,
                  inT:h.inT===undefined?null:h.inT, outT:h.outT===undefined?null:h.outT, d:h.d, tip:h.tip });
  }
}
if (missing.length) console.error('חסר תוכן עברי עבור:', missing);
const extra = heSlugs.filter(s => !clean.find(c => c.slug === s));
if (extra.length) console.error('מפתחות עבריים ללא דגם:', extra);

const cats = {}; for (const c of order) cats[c] = he.cats[c];
const pickSlugs = ['12-tooth-to-12-tooth-90-degrees','worm-gear-to-24-tooth-gear','one-way-door-3x5',
  '24-tooth-crown-gear-to-60-tooth-turntable-90-degrees','pulley-to-vertical-motion',
  '8-tooth-gear-to-24-tooth-crown-gear-90-degrees','rack-mechanism-one-way-door','28-tooth-gear-to-linear'];
if (pickSlugs.some(s => !models.find(m => m.s === s))) console.error('slug שגוי ברשימת המומלצים');

const data = 'var CATS='  + JSON.stringify(cats)   + ';\n'
           + 'var MODELS='+ JSON.stringify(models) + ';\n'
           + 'var LINKS=' + JSON.stringify(he.links)+ ';\n'
           + 'var CHAPTERS='+JSON.stringify(guide.chapters)+';\n'
           + 'var PROCESS='+JSON.stringify(guide.process)+';\n'
           + 'var DRIVE='+JSON.stringify(dr.drive)+';\n'
           + 'var DRIVESVG='+JSON.stringify(dr.S)+';\n'
           + 'var BLOCKS=' + JSON.stringify(blocks)+ ';\n'
           + 'var CREDITS='+ JSON.stringify(cr.credits)+ ';\n'
           + 'var THANKS_INTRO='+JSON.stringify(cr.thanksIntro)+';\n'
           + 'var THANKS_OUTRO='+JSON.stringify(cr.thanksOutro)+';\n'
           + 'var LEGAL='  + JSON.stringify(cr.legal)+ ';\n'
           + 'var PICKS=' + JSON.stringify(pickSlugs)
           + '.map(function(s){return MODELS.find(function(m){return m.s===s;});});';

let t = fs.readFileSync(path.join(DIR,'template.html'),'utf8');
if (!t.includes('/*__DATA__*/')) throw new Error('חסר המציין /*__DATA__*/ בתבנית');
t = t.replace('/*__DATA__*/', data);

// ---- 2. גרסת ארטיפקט (הפלטפורמה מוסיפה בעצמה את שלד המסמך) ----
if (process.argv.includes('--artifact')) {
  fs.mkdirSync(path.join(ROOT,'build'), { recursive:true });
  fs.writeFileSync(path.join(ROOT,'build','artifact.html'), t);
  console.log('build/artifact.html  |  דגמים', models.length, '| בתים', t.length);
  process.exit(0);
}

// ---- 3. גרסה עצמאית לאחסון רגיל: מוסיפים את שלד המסמך בחזרה ----
let h = t.replace('<meta name="claude:viewport-fit-sides" content="cover">\n','');
const i = h.indexOf('</style>');
if (i < 0) throw new Error('לא נמצא </style>');
const head = h.slice(0, i+8);
const body = h.slice(i+8).trim();

const reset = '\n<style>\n:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}\nbody{margin:0}\nimg{max-width:100%}\n[hidden]{display:none!important}\n</style>';

const out = '<!doctype html>\n<html lang="he" dir="rtl">\n<head>\n<meta charset="utf-8">\n'
  + '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
  + '<meta name="description" content="\u05de\u05e0\u05d2\u05e0\u05d5\u05e0\u05d9 \u05dc\u05d2\u05d5 \u05d8\u05db\u05e0\u05d9\u05e7 \u05d1\u05e2\u05d1\u05e8\u05d9\u05ea \u05dc\u05e0\u05d1\u05d7\u05e8\u05ea \u05d4\u05e8\u05d5\u05d1\u05d5\u05d8\u05d9\u05e7\u05d4 \u05e9\u05dc \u05d1\u05d9\u05ea \u05e1\u05e4\u05e8 \u05de\u05d5\u05d3\u05d9\u05e2\u05d9\u05dd.">\n'
  + '<link rel="icon" href="img/brand/school.png">\n'
  + reset + '\n' + head + '\n</head>\n<body>\n' + body + '\n</body>\n</html>\n';

fs.writeFileSync(path.join(ROOT,'index.html'), out);
console.log('index.html  |  דגמים', models.length, '| בתים', out.length);
