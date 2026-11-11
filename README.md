# גלגלי שיניים ודגמים

אתר בעברית לנבחרת הרובוטיקה של בית ספר מודיעים (נחלים), כיתות ה'–ו'.
עיבוד עברי של [gearsandmodels.org](https://www.gearsandmodels.org/) — 48 מנגנוני לגו טכניק בחמש קטגוריות,
עם תמונות, הסברים, טיפים לבנייה ומחשבון יחסי העברה.

**האתר החי:** https://spitario.github.io/gears-models-he/
**העמוד באתר בית הספר:** https://modiim.tik-tak.school/robotics-gears/

## מבנה

```
index.html           ← הקובץ שמתפרסם. נבנה אוטומטית — לא לערוך ישירות!
img/                 ← 48 תמונות הדגמים + הלוגו
  build/             ← שקופיות מהרצאת "עקרונות בנייה" של נבחרת הג׳ירפות
  process/           ← שקופיות מהרצאת "מרעיון משוגע למציאות"
  blocks/            ← 135 צילומי בלוקים של Spike Prime
src/
  template.html      ← המבנה והעיצוב של האתר (HTML + CSS + JS)
  he.js              ← תוכן הדגמים בעברית: קטגוריות, דגמים, קישורים
  guide.js           ← תוכן העמודים "עקרונות בנייה" ו"תהליך הפיתוח"
  data/models.json   ← נתוני הדגמים שנאספו מאתר המקור (תמונה, PDF, ZIP, קישור)
  data/blocks.json   ← מדריך הבלוקים: 10 קטגוריות, 121 בלוקים
  build.js           ← מזריק את התוכן לתבנית ומייצר את index.html
  tools/             ← סקריפטים חד־פעמיים ששימשו לאיסוף הנתונים והתמונות
.nojekyll            ← מונע מ-GitHub Pages להתעלם מקבצים שמתחילים ב-_
```

## בנייה

```bash
node src/build.js              # מייצר index.html
node src/build.js --artifact   # מייצר build/artifact.html לגרסת הארטיפקט בקלוד
```

הסקריפט מתריע אם יש דגם בלי תוכן עברי, או תוכן עברי בלי דגם מתאים.

## פרסום

```bash
git add -A && git commit -m "תיאור השינוי" && git push
```

GitHub Pages מתעדכן תוך כדקה. העמוד באתר בית הספר מצביע לכאן ולא צריך שינוי.

## להוסיף דגם

1. להוסיף רשומה ל-`src/data/models.json` (slug, cat, img, ואם יש — pdf/zip/src).
2. להוסיף את התמונה ל-`img/`.
3. להוסיף ערך מקביל ב-`src/he.js` תחת `models`, לפי אותו slug:
   `he` (שם בעברית), `inT`/`outT` (מספר שיניים, להשמיט בדגמי משימה), `d` (הסבר), `tip` (טיפ).
4. `node src/build.js`

## מקור

התוכן מבוסס על gearsandmodels.org של קבוצת Desert Capybaras #3000 מאופקים.
קישורי ההורדה (PDF והוראות בנייה ל-BrickLink Studio) מצביעים לאתר המקור.
