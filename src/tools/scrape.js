const fs=require('fs');
const urls=fs.readFileSync('gm/model_urls.txt','utf8').trim().split(/\r?\n/);
const u=s=>[...new Set(s)];
(async()=>{
 const out=[];
 for(const url of urls){
  let h;
  try{ const r=await fetch(url,{headers:{'user-agent':'Mozilla/5.0'}}); h=await r.text(); }
  catch(e){ console.error('FAIL',url,e.message); continue; }
  const slug=url.split('/').pop();
  out.push({
   slug, url,
   title:((h.match(/<title>(.*?)<\/title>/)||[])[1]||'').replace(/ \| Gears and Models$/,''),
   pdf:u(h.match(/_files\/ugd\/[A-Za-z0-9_.]+/g)||[]),
   zip:u(h.match(/_files\/archives\/[A-Za-z0-9_.]+/g)||[]),
   imgs:u(h.match(/a023d3_[0-9a-f]+~mv2\.(?:jpg|png|jpeg|webp)/g)||[]),
   cats:u(h.match(/\/categories\/[a-z0-9-]+/g)||[]),
  });
  process.stderr.write('.');
 }
 fs.writeFileSync('gm/models.json',JSON.stringify(out,null,1));
 console.log('\ndone',out.length);
})();
