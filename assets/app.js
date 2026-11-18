// Language switch + live download counter (public GitHub API, no token)
(function(){
  function setLang(l){
    document.documentElement.lang=l;
    document.querySelectorAll('[data-en]').forEach(function(e){var t=e.getAttribute('data-'+l); if(t!==null) e.textContent=t;});
    var en=document.getElementById('l-en'), de=document.getElementById('l-de');
    if(en&&de){en.classList.toggle('on',l==='en');de.classList.toggle('on',l==='de');}
    try{localStorage.setItem('lang',l);}catch(e){}
    paint();
  }
  var counts=null;
  function paint(){
    if(!counts) return;
    var de=document.documentElement.lang==='de';
    document.querySelectorAll('.count[data-asset]').forEach(function(e){
      var n=counts[e.getAttribute('data-asset')];
      if(typeof n==='number'){ e.innerHTML=de?('<b>'+n+'</b>× heruntergeladen'):('downloaded <b>'+n+'</b> times'); }
    });
  }
  var b1=document.getElementById('l-en'), b2=document.getElementById('l-de');
  if(b1) b1.onclick=function(){setLang('en')}; if(b2) b2.onclick=function(){setLang('de')};
  var saved=null; try{saved=localStorage.getItem('lang');}catch(e){}
  if(saved==='de') setLang('de');
  if(!window.REPO_OWNER||!document.querySelector('.count')) return;
  fetch('https://api.github.com/repos/'+window.REPO_OWNER+'/'+window.REPO_NAME+'/releases?per_page=100',{headers:{'Accept':'application/vnd.github+json'}})
    .then(function(r){ if(!r.ok) throw 0; return r.json(); })
    .then(function(rel){
      counts={};
      rel.forEach(function(x){ (x.assets||[]).forEach(function(a){ counts[a.name]=(counts[a.name]||0)+a.download_count; }); });
      paint();
    }).catch(function(){ /* fallback: no number shown */ });
})();
