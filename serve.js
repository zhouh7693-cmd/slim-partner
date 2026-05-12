const http=require('http'),fs=require('fs'),path=require('path');
const s=http.createServer((req,res)=>{
  let fp=path.join('.',decodeURIComponent(req.url.split('?')[0]));
  if(fp==='.\\'||fp==='./')fp='.\\nav.html';
  try{
    const d=fs.readFileSync(fp);
    const ext=path.extname(fp);
    const t={'html':'text/html','js':'application/javascript','css':'text/css'}[ext.slice(1)]||'text/plain';
    res.writeHead(200,{'Content-Type':t+';charset=utf-8'});
    res.end(d);
  }catch(e){res.writeHead(404);res.end('not found');}
});
s.listen(8899,()=>console.log('OK 8899'));
