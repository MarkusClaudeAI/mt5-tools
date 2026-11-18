(function(){
  var L='en', counts=null, D=window.I18N||{};
  function t(k){return (D[L]&&D[L][k])||(D.en&&D.en[k])||'';}
  function apply(){
    document.documentElement.lang=L;
    document.querySelectorAll('[data-i18n]').forEach(function(e){var v=t(e.getAttribute('data-i18n')); if(v) e.textContent=v;});
    document.querySelectorAll('.lang button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-l')===L);});
    paint();
  }
  function setLang(l){L=l; try{localStorage.setItem('lang',l);}catch(e){} apply();}
  document.querySelectorAll('.lang button').forEach(function(b){b.onclick=function(){setLang(b.getAttribute('data-l'));};});
  function paint(){
    if(!counts) return;
    document.querySelectorAll('.count[data-asset]').forEach(function(e){
      var n=counts[e.getAttribute('data-asset')];
      if(typeof n==='number'){ e.innerHTML=t('dlx').replace('{n}','<b>'+n+'</b>'); }
    });
    var list=document.getElementById('ranklist'); if(!list) return;
    var arr=Object.keys(counts).filter(function(k){return counts[k]>0&&window.NAMES[k];}).sort(function(a,b){return counts[b]-counts[a];}).slice(0,5);
    list.innerHTML='';
    document.getElementById('rank0').hidden=arr.length>0;
    arr.forEach(function(k,i){
      var li=document.createElement('li'); if(i===0) li.className='first';
      li.innerHTML=(i===0?'<span class="crown">♛</span>':'<span>'+(i+1)+'.</span>')+'<img src="assets/logos/'+window.LOGOS[k]+'" alt="">'+
        '<a href="#t-'+k.replace(/\.ex5$/,'')+'">'+window.NAMES[k]+'</a><span class="n">'+counts[k]+'</span>';
      list.appendChild(li);
    });
  }
  var saved=null; try{saved=localStorage.getItem('lang');}catch(e){}
  if(!saved){var n=(navigator.language||'en').slice(0,2); if(D[n]) saved=n;}
  if(saved&&D[saved]) L=saved;
  apply();
  // Pro preview clips
  document.querySelectorAll('.pv').forEach(function(b){
    b.onclick=function(){var v=b.nextElementSibling; if(!v) return; if(v.hidden){v.hidden=false; v.play().catch(function(){});} else {v.pause(); v.hidden=true;}};
  });
  // YouTube live: loads only after click (privacy)
  var yb=document.getElementById('ytload');
  if(yb) yb.onclick=function(){
    var box=document.getElementById('ytbox');
    box.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/live_stream?channel=UC8BSvOa9ZVMWKMTQOPSieZA&autoplay=1&mute=1" title="Signal-Check LIVE" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
  };
  // signal network canvas
  var c=document.getElementById('net');
  if(c&&c.getContext&&!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)){
    var x=c.getContext('2d'),P=[],W,H,dpr=Math.min(window.devicePixelRatio||1,2);
    function size(){W=c.offsetWidth;H=c.offsetHeight;c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0);}
    size(); window.addEventListener('resize',size);
    var N=Math.min(60,Math.round(W/22));
    for(var i=0;i<N;i++)P.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,p:Math.random()*6.28});
    var cols=['34,211,238','139,92,246','244,114,182'];
    (function step(){
      x.clearRect(0,0,W,H);
      for(var i=0;i<P.length;i++){var a=P[i];a.x+=a.vx;a.y+=a.vy;a.p+=.03;if(a.x<0||a.x>W)a.vx*=-1;if(a.y<0||a.y>H)a.vy*=-1;
        for(var j=i+1;j<P.length;j++){var b=P[j],dx=a.x-b.x,dy=a.y-b.y,d=dx*dx+dy*dy;if(d<16000){x.strokeStyle='rgba('+cols[i%3]+','+(.28*(1-d/16000))+')';x.lineWidth=1;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke();}}
        x.fillStyle='rgba('+cols[i%3]+','+(.55+.45*Math.sin(a.p))+')';x.shadowColor='rgba('+cols[i%3]+',1)';x.shadowBlur=8;x.beginPath();x.arc(a.x,a.y,1.8,0,6.28);x.fill();x.shadowBlur=0;}
      if(!document.hidden) requestAnimationFrame(step); else setTimeout(step,500);
    })();
  }
  if(!window.REPO_OWNER) return;
  fetch('https://api.github.com/repos/'+window.REPO_OWNER+'/'+window.REPO_NAME+'/releases?per_page=100',{headers:{'Accept':'application/vnd.github+json'}})
    .then(function(r){ if(!r.ok) throw 0; return r.json(); })
    .then(function(rel){ counts={}; rel.forEach(function(x){(x.assets||[]).forEach(function(a){counts[a.name]=(counts[a.name]||0)+a.download_count;});}); paint(); })
    .catch(function(){ /* fallback: no numbers */ });
})();
