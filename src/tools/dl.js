const fs=require('fs');
const LOGO='a023d3_c7d8bb229b334ed496d5398a32944e69~mv2.jpg';
const PLACEHOLDER='a023d3_8be4c3d9208b45c0b49ff26b5dfa91ba~mv2.jpg';
const m=require('./gm/models.json');
(async()=>{
 const out=[];
 for(const x of m){
  const cand=x.imgs.filter(i=>i!==LOGO&&i!==PLACEHOLDER);
  const id=cand[0]||null;
  let local=null;
  if(id){
   const ext=id.split('.').pop();
   local='img/'+x.slug+'.'+ext;
   const url=`https://static.wixstatic.com/media/${id}/v1/fill/w_900,h_900,al_c,q_88/i.${ext}`;
   const r=await fetch(url,{headers:{'user-agent':'Mozilla/5.0'}});
   if(r.ok){ fs.writeFileSync('site/'+local, Buffer.from(await r.arrayBuffer())); process.stderr.write('.'); }
   else { console.error('\nIMGFAIL',x.slug,r.status); local=null; }
  } else console.error('\nNOIMG',x.slug);
  out.push({slug:x.slug,title:x.title.trim(),cat:x.cats[0].replace('/categories/',''),img:local,
   pdf:x.pdf[0]?'https://www.gearsandmodels.org/'+x.pdf[0]:null,
   zip:x.zip[0]?'https://www.gearsandmodels.org/'+x.zip[0]:null,
   src:x.url});
 }
 fs.writeFileSync('gm/clean.json',JSON.stringify(out,null,1));
 console.log('\nOK',out.length,'withimg',out.filter(o=>o.img).length);
})();
