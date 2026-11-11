const fs=require('fs');
const m=require('./gm/clean.json');
const LOGO='a023d3_c7d8bb229b334ed496d5398a32944e69~mv2.jpg';
const raw=require('./gm/models.json');
(async()=>{
 for(const x of m){
  const r0=raw.find(r=>r.slug===x.slug);
  const id=r0.imgs.filter(i=>i!==LOGO&&i!=='a023d3_8be4c3d9208b45c0b49ff26b5dfa91ba~mv2.jpg')[0];
  const ext=id.split('.').pop();
  const url=`https://static.wixstatic.com/media/${id}/v1/fill/w_620,h_620,al_c,q_80,enc_auto/i.${ext}`;
  const r=await fetch(url,{headers:{'user-agent':'Mozilla/5.0'}});
  if(r.ok){ fs.writeFileSync('site/'+x.img, Buffer.from(await r.arrayBuffer())); process.stderr.write('.'); }
 }
 console.log('done');
})();
