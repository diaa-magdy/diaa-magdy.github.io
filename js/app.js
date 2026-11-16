/* ===== Lingo Planet · Pre A1 — app engine ===== */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
const app=$('#app');
const CFG=window.LP_CONFIG||{};
const ADMIN=(CFG.adminEmail||'').toLowerCase();
const UNIT_LIST=Object.keys(UNITS).map(Number).sort((a,b)=>a-b);
const LEVELS=[
 {id:'preA1',code:'Pre A1',en:'Foundation',ar:'التأسيس',ic:'🌱',ready:true},
 {id:'a1p',code:'A1+',en:'Elementary Plus',ar:'المبتدئ المتقدم',ic:'🚀'},
 {id:'a2',code:'A2',en:'Pre-Intermediate',ar:'ما قبل المتوسط',ic:'📗'},
 {id:'a2p',code:'A2+',en:'Pre-Intermediate Plus',ar:'ما قبل المتوسط المتقدم',ic:'📘'},
 {id:'b1',code:'B1',en:'Intermediate',ar:'المتوسط',ic:'💬'},
 {id:'b1p',code:'B1+',en:'Intermediate Plus',ar:'المتوسط المتقدم',ic:'🎯'},
 {id:'b2',code:'B2',en:'Upper-Intermediate',ar:'فوق المتوسط',ic:'🏅'},
 {id:'b2p',code:'B2+',en:'Upper-Intermediate Plus',ar:'فوق المتوسط المتقدم',ic:'🌟'},
 {id:'c1',code:'C1',en:'Advanced',ar:'المتقدم',ic:'👑'}];
const LV=id=>LEVELS.find(l=>l.id===id);
const LEGACY_BEFORE=1794868100000; /* students created before levels existed keep Pre A1 */

/* ================= helpers ================= */
function toast(m){const t=$('#toast');t.innerHTML=m;t.classList.add('on');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('on'),2200);}
function burst(x,y,ch){const b=document.createElement('div');b.className='burst';b.textContent=ch;b.style.left=x+'px';b.style.top=y+'px';document.body.appendChild(b);setTimeout(()=>b.remove(),900);}
function burstAt(el,ch){const r=el.getBoundingClientRect();burst(r.left+r.width/2,r.top,ch);}
function seeded(arr,seed){const a=arr.slice();let s=seed;for(let i=a.length-1;i>0;i--){s=(s*9301+49297)%233280;const j=Math.floor(s/233280*(i+1));[a[i],a[j]]=[a[j],a[i]];}if(a.join()===arr.join()&&a.length>1)a.push(a.shift());return a;}
const ONES=["","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
const TENS=["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
const NUM_AR={1:"واحد",2:"اثنان",3:"ثلاثة",4:"أربعة",5:"خمسة",6:"ستة",7:"سبعة",8:"ثمانية",9:"تسعة",10:"عشرة",11:"أحد عشر",12:"اثنا عشر",13:"ثلاثة عشر",14:"أربعة عشر",15:"خمسة عشر",16:"ستة عشر",17:"سبعة عشر",18:"ثمانية عشر",19:"تسعة عشر",20:"عشرون",30:"ثلاثون",40:"أربعون",50:"خمسون",60:"ستون",70:"سبعون",80:"ثمانون",90:"تسعون",100:"مائة"};
function nWord(n){if(n===100)return"one hundred";if(n<20)return ONES[n];const t=Math.floor(n/10),o=n%10;return TENS[t]+(o?"-"+ONES[o]:"");}
function nAr(n){if(NUM_AR[n])return NUM_AR[n];return NUM_AR[n%10]+" و"+NUM_AR[Math.floor(n/10)*10];}
const norm=w=>String(w).toLowerCase().replace(/’/g,"'");
function lookup(w){
  w=norm(w).replace(/^'+|'+$/g,''); if(AR[w]) return AR[w];
  if(/^\d+$/.test(w)){const n=+w;if(n>0&&n<=100)return nAr(n)+" — "+nWord(n);}
  if(NAMES.includes(w)) return 'اسم علم';
  w=w.replace(/'s$/,'')||w;if(AR[w])return AR[w];if(NAMES.includes(w))return 'اسم علم';for(const suf of ["'s","ies","es","s","ed","ing","d"]) if(w.endsWith(suf)){const b=w.slice(0,-suf.length);if(AR[b])return AR[b];if(suf==='ies'&&AR[b+'y'])return AR[b+'y'];if((suf==='ing'||suf==='ed')&&AR[b+'e'])return AR[b+'e'];}
  return null;
}
/* every English word becomes tappable; *x* is highlighted */
function T(s){
  return String(s).split(/(\*[^*]+\*)/).map(part=>{
    const hi=/^\*[^*]+\*$/.test(part); const p=hi?part.slice(1,-1):part;
    const h=p.replace(/[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'’]*|\d+/g,m=>`<span class="w" data-w="${m}">${m}</span>`);
    return hi?`<b class="hl">${h}</b>`:h;
  }).join('');
}
const plain=s=>String(s).replace(/\*/g,'');

/* ================= VOICE: recorded natural voices (Kokoro AI), browser voice as fallback ================= */
const VOICE={f:'f',m:'m',m2:'m2',f2:'f2'};
function fnv(s){let h=0x811c9dc5;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return h.toString(16).padStart(8,'0');}
function speechText(t){return plain(t).replace(/_{2,}/g,' blank ').replace(/\s+/g,' ').trim();}
function audioKey(t,v){return fnv(norm(speechText(t))+'|'+(v||'f'));}
const AUDMAP=window.AUDMAP||{};const BUF={},LOADING={};let ACX=null;
function actx(){if(!ACX){try{ACX=new (window.AudioContext||window.webkitAudioContext)();}catch(e){}}return ACX;}
function loadSprite(u){if(BUF[u]||LOADING[u]||!AUDMAP[u])return;LOADING[u]=1;const c=actx();if(!c)return;
  fetch('audio/s'+u+'.mp3').then(r=>r.arrayBuffer()).then(b=>new Promise((ok,no)=>c.decodeAudioData(b,ok,no))).then(buf=>{BUF[u]=buf;}).catch(e=>{console.warn('audio',u,e);LOADING[u]=0;});}
let voices=[];
function loadV(){try{voices=speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang));}catch(e){}}
if('speechSynthesis' in window){loadV();speechSynthesis.onvoiceschanged=loadV;}
function pickVoice(g){if(!voices.length)loadV();let P=voices.filter(v=>/en[-_]US/i.test(v.lang));if(!P.length)P=voices;if(!P.length)return null;const nat=P.filter(v=>/natural|online|neural/i.test(v.name));if(nat.length)P=nat;
  if(g&&g[0]==='m')return P.find(v=>/guy|andrew|brian|christopher|eric|davis|david|male/i.test(v.name)&&!/female/i.test(v.name))||P[0];
  return P.find(v=>/aria|jenny|ava|emma|samantha|zira|google us english|female/i.test(v.name))||P[0];}
let curSrc=null, playTok=0;
function findClip(k){for(const u of [CUR,0,8,...UNIT_LIST]){const m=AUDMAP[u];if(m&&m[k]&&BUF[u])return [u,m[k]];}return null;}
function say(text,o={}){
  const st=speechText(text); if(!st){o.onend&&o.onend();return;}
  const v=VOICE[o.g]||'f'; const hit=findClip(audioKey(st,v))||findClip(audioKey(st,'f'));
  const c=actx();
  if(hit&&c){try{if(c.state==='suspended')c.resume();const src=c.createBufferSource();src.buffer=BUF[hit[0]];src.playbackRate.value=o.slow?0.75:1;src.connect(c.destination);
      src.onended=()=>{if(curSrc===src)curSrc=null;o.onend&&o.onend();};src.start(0,hit[1][0],hit[1][1]);curSrc=src;return;}catch(e){console.warn(e);}}
  tts(st,o);
}
function tts(st,o){
  if(!('speechSynthesis' in window)){o.onend&&o.onend();return;}
  const u=new SpeechSynthesisUtterance(st);u.lang='en-US';const vv=pickVoice(o.g);if(vv)u.voice=vv;u.rate=o.slow?0.6:0.92;
  if(o.onend){let d=false;const f=()=>{if(!d){d=true;o.onend();}};u.onend=f;u.onerror=f;}
  speechSynthesis.speak(u);
}
function stopAll(){playTok++;try{speechSynthesis.cancel();}catch(e){}if(curSrc){const x=curSrc;curSrc=null;x.onended=null;try{x.stop();}catch(e){}}$$('.now').forEach(e=>e.classList.remove('now'));}
function speakNow(t,o){stopAll();say(t,o||{});}

/* ================= word popup ================= */
let selEl=null;
function showPop(el){
  const w=el.dataset.w, ar=el.dataset.ar||lookup(w), sw=el.dataset.sayw||w;
  if(selEl) selEl.classList.remove('sel'); selEl=el; el.classList.add('sel');
  $('#popW').textContent=w;
  const a=$('#popA'); if(ar){a.textContent=ar;a.classList.remove('none');}else{a.textContent='استمع للنطق 🔊';a.classList.add('none');}
  $('#popS').onclick=e=>{e.stopPropagation();speakNow(sw);};
  $('#popSl').onclick=e=>{e.stopPropagation();speakNow(sw,{slow:true});};
  const p=$('#pop');p.classList.add('on');
  const r=el.getBoundingClientRect(),pw=p.offsetWidth,ph=p.offsetHeight;
  let left=r.left+r.width/2-pw/2+scrollX;left=Math.max(8+scrollX,Math.min(left,scrollX+innerWidth-pw-8));
  let top=r.bottom+8+scrollY;if(r.bottom+ph+16>innerHeight)top=r.top-ph-8+scrollY;
  p.style.left=left+'px';p.style.top=top+'px';speakNow(sw);
}
function hidePop(){$('#pop').classList.remove('on');if(selEl){selEl.classList.remove('sel');selEl=null;}}
document.addEventListener('click',e=>{
  const w=e.target.closest('.w'); if(w){e.stopPropagation();e.preventDefault();showPop(w);const vc=w.closest('.vc');if(vc)vocabSeen(vc.dataset.w);return;}
  const s=e.target.closest('[data-say]'); if(s){speakNow(s.dataset.say,{g:s.dataset.g});return;}
  if(!e.target.closest('#pop')) hidePop();
});

/* ================= BACKEND (Firebase when configured, this device otherwise) ================= */
const LKEY='lingo_planet_preA1_v3';
let L={students:{},me:null,scores:{},cfg:{phones:[],admins:[]}};
try{const s=JSON.parse(localStorage.getItem(LKEY)||'null');if(s)L=Object.assign(L,s);}catch(e){}
function lsave(){try{localStorage.setItem(LKEY,JSON.stringify(L));}catch(e){}}
const ONLINE=!!(CFG.firebase&&window.firebase);
let fdb=null, fauth=null, USER=null, PROFILE=null, SET={phones:[],admins:[]}, STAFF=false;
const API={
  async init(cb){
    if(ONLINE){
      firebase.initializeApp(CFG.firebase); fauth=firebase.auth(); fdb=firebase.firestore();
      try{await fauth.getRedirectResult();}catch(e){console.warn(e);}
      fauth.onAuthStateChanged(async u=>{USER=u;PROFILE=null;
        if(u){try{const d=await fdb.collection('students').doc(u.uid).get();PROFILE=d.exists?Object.assign({uid:u.uid},d.data()):null;}catch(e){console.warn(e);}
          await API.loadSettings();}
        cb();});
    } else { USER=L.me?{uid:L.me,email:L.me}:null; PROFILE=USER?L.students[L.me]||null:null; await API.loadSettings(); cb(); }
  },
  async google(){
    if(!ONLINE){return 'local';}
    const p=new firebase.auth.GoogleAuthProvider(); p.setCustomParameters({prompt:'select_account'});
    try{await fauth.signInWithPopup(p);}catch(e){ if(/popup|operation-not-supported|web-storage/i.test(e.code||'')) await fauth.signInWithRedirect(p); else toast('⚠️ '+(e.message||e)); }
  },
  async register(name,email){
    if(ONLINE){const doc={name,email:USER.email,status:USER.email.toLowerCase()===ADMIN?'approved':'pending',created:Date.now(),prog:{},tests:{}};
      await fdb.collection('students').doc(USER.uid).set(doc);PROFILE=Object.assign({uid:USER.uid},doc);}
    else{L.students[email]=L.students[email]||{uid:email,name,email,status:email===ADMIN?'approved':'pending',created:Date.now(),prog:{},tests:{}};L.me=email;lsave();USER={uid:email,email};PROFILE=L.students[email];}
  },
  async logout(){ if(ONLINE) await fauth.signOut(); else {L.me=null;lsave();USER=null;PROFILE=null;} },
  async refresh(){ if(ONLINE&&USER){const d=await fdb.collection('students').doc(USER.uid).get();PROFILE=d.exists?Object.assign({uid:USER.uid},d.data()):null;} else if(USER){PROFILE=L.students[USER.uid]||null;} },
  saveProg(){ if(!PROFILE)return; if(ONLINE){fdb.collection('students').doc(USER.uid).set({prog:PROFILE.prog,tests:PROFILE.tests,final:PROFILE.final||null},{merge:true}).catch(e=>console.warn(e));} else {L.students[USER.uid]=PROFILE;lsave();} },
  async students(){ if(ONLINE){const q=await fdb.collection('students').get();return q.docs.map(d=>Object.assign({uid:d.id},d.data()));} return Object.values(L.students); },
  async setStatus(uid,st){ if(ONLINE) await fdb.collection('students').doc(uid).set({status:st},{merge:true}); else {L.students[uid].status=st;lsave();} },
  async loadSettings(){
    SET={phones:[],admins:[]};STAFF=false;
    if(!ONLINE){SET={phones:(L.cfg.phones||[]).slice(),admins:(L.cfg.admins||[]).slice()};STAFF=!!USER&&SET.admins.includes((USER.email||'').toLowerCase());return;}
    if(!USER)return;
    try{const d=await fdb.collection('config').doc('public').get();if(d.exists)SET.phones=d.data().phones||[];}catch(e){console.warn(e);}
    try{const d=await fdb.collection('config').doc('staff').get();if(d.exists){SET.admins=d.data().admins||[];STAFF=SET.admins.includes((USER.email||'').toLowerCase());}}catch(e){/* not staff */}
  },
  async saveSettings(){
    if(ONLINE){await fdb.collection('config').doc('public').set({phones:SET.phones});await fdb.collection('config').doc('staff').set({admins:SET.admins});}
    else{L.cfg={phones:SET.phones.slice(),admins:SET.admins.slice()};lsave();}
  },
  async setLevel(uid,id,val){
    if(ONLINE){await fdb.collection('students').doc(uid).update({['levels.'+id]:val,status:'approved'});}
    else{const st=L.students[uid];st.levels=st.levels||{};st.levels[id]=val;st.status='approved';lsave();}
  },
  async remove(uid){ if(ONLINE) await fdb.collection('students').doc(uid).delete(); else {delete L.students[uid];lsave();} },
  async addScore(key,score){
    const id=USER.uid.replace(/[^\w@.-]/g,'_')+'_'+key; const row={uid:USER.uid,name:PROFILE.name,key,score,ts:Date.now()};
    if(ONLINE){const ref=fdb.collection('scores').doc(id);const d=await ref.get().catch(()=>null);if(!d||!d.exists||d.data().score<score)await ref.set(row);}
    else{const o=L.scores[id];if(!o||o.score<score){L.scores[id]=row;lsave();}}
  },
  async scores(key){
    if(ONLINE){const q=key?await fdb.collection('scores').where('key','==',key).get():await fdb.collection('scores').get();return q.docs.map(d=>d.data());}
    return Object.values(L.scores).filter(x=>!key||x.key===key);
  }
};
const isOwner=()=>!!(USER&&ADMIN&&(USER.email||'').toLowerCase()===ADMIN);
const isAdmin=()=>isOwner()||STAFF;
function lvState(prof,id){ /* returns {on, until, legacy} */
  const e=((prof||{}).levels||{})[id];
  if(e) return {on:!!e.on&&(!e.until||e.until>Date.now()),until:e.until||null,expired:!!(e.on&&e.until&&e.until<=Date.now())};
  if(id==='preA1'&&prof&&prof.status==='approved'&&(prof.created||0)<LEGACY_BEFORE) return {on:true,until:null,legacy:true};
  return {on:false,until:null};
}
const hasLevel=id=>isAdmin()||lvState(PROFILE,id).on;
const fmtD=t=>new Date(t).toLocaleDateString('en-GB');

/* ================= PROGRESS ================= */
function unitActs(n){const u=UNITS[n];const a=[];u.videos.forEach(v=>a.push(v.id,v.id+'q',v.id+'f'));a.push('voc','talk','gram');u.exercises.forEach((x,i)=>a.push('ex'+i));if(u.numbers)a.push('num');a.push('rq','sq','game','test');return a;}
function prog(n){PROFILE.prog=PROFILE.prog||{};PROFILE.prog['u'+n]=PROFILE.prog['u'+n]||{};return PROFILE.prog['u'+n];}
function done(n,a){if(!PROFILE)return;const p=prog(n);if(!p[a]){p[a]=1;API.saveProg();updateProg(n);}}
function pctOf(prof,n){const p=(prof.prog||{})['u'+n]||{};const A=unitActs(n);return Math.round(A.filter(a=>p[a]).length/A.length*100);}
const pct=n=>PROFILE?pctOf(PROFILE,n):0;
function testBest(n,prof){prof=prof||PROFILE;const t=(prof&&prof.tests||{})['u'+n];return t?t.best:null;}
function unlocked(n){ if(isAdmin()||!CFG.lockUnits||n===1) return true; const b=testBest(n-1); return b!==null&&b>=UNITS[n-1].test.pass; }
function overall(){return Math.round(UNIT_LIST.reduce((s,n)=>s+pct(n),0)/UNIT_LIST.length);}
function updateProg(n){
  $$('[data-prog]').forEach(el=>{const k=el.dataset.prog;el.style.width=(k==='all'?overall():pct(+k))+'%';});
  $$('[data-progt]').forEach(el=>{const k=el.dataset.progt;el.textContent=(k==='all'?overall():pct(+k))+'%';});
  if(n){const p=prog(n);$$('[data-act]').forEach(el=>{const on=el.dataset.act.split(',').every(a=>p[a]);el.classList.toggle('on',on);el.textContent=on?'✅ تم':'⬜ لم يكتمل';});}
}

/* ================= ROUTER ================= */
function go(v){if(location.hash==='#'+v)render();else location.hash=v;}
addEventListener('hashchange',render);
let CUR=0;
function render(){
  loadSprite(0);
  stopAll();hidePop();closeModal();CUR=0;
  const v=(location.hash||'').slice(1);
  if(!USER) return vLogin();
  if(!PROFILE) return vProfileForm();
  if(v==='admin'&&isAdmin()) return vAdmin();
  if(PROFILE.status==='rejected'&&!isAdmin()) return vPending();
  const lm=v.match(/^level-(\w+)$/);
  if(lm&&LV(lm[1])){const L1=LV(lm[1]);
    if(!hasLevel(L1.id)){vLevels();return subscribe(L1.id);}
    if(!L1.ready){toast('⏳ ليفل '+L1.code+' هيتضاف قريب جدًا');return vLevels();}
    return vHome();}
  const m=v.match(/^unit-(\d)$/);
  if((m||v==='final'||v==='certificate')&&!hasLevel('preA1')){vLevels();return subscribe('preA1');}
  if(m&&UNITS[+m[1]]){ if(!unlocked(+m[1])){toast('🔒 لازم تنجح في اختبار الوحدة اللي قبلها');return vHome();} return vUnit(+m[1]); }
  if(v==='final') return vFinal();
  if(v==='certificate') return vCert();
  if(v==='champions'&&(PROFILE.status==='approved'||isAdmin())) return vChampions();
  return vLevels();
}
function topBar(back){
  const ini=(PROFILE?PROFILE.name:'?').trim().charAt(0).toUpperCase();
  return `<header class="top"><div class="in">
   ${back?`<button class="pill p-mint" onclick="go('${typeof back==='string'?back:(/^#(unit|final|certificate)/.test(location.hash)?'level-preA1':'home')}')">← ${typeof back==='string'||!/^#(unit|final|certificate)/.test(location.hash)?'الرئيسية':'Pre A1'}</button>`:''}
   <a class="logo" href="#home"><img src="img/icon-192.png" alt=""><span class="t"><b>LINGO <span>PLANET</span></b><small>DIAA MAGDY</small></span></a>
   <span class="sp"></span>
   ${isAdmin()?`<a class="pill p-g" href="#admin">👨‍🏫 Dashboard</a>`:''}
   <span class="pill p-or">⭐ <span data-progt="${CUR||'all'}">0%</span></span>
   <button class="avatar" title="My account" onclick="openProfile()">${esc(ini)}</button>
  </div></header>`;
}

/* ================= LOGIN / REGISTER / PENDING ================= */
function vLogin(){
  app.innerHTML=`<div class="auth"><div class="card box">
   <img class="chatty" src="img/chatty.png" alt="Chatty">
   <h1>Welcome to Lingo Planet!</h1>
   <div class="ar" style="color:var(--mut);font-weight:700">أهلًا بيك في أكاديمية Lingo Planet — Mr. Diaa Magdy. سجّل بحساب جوجل (الجيميل) بتاعك.</div>
   ${ONLINE?`<button class="btn b-w" style="width:100%;font-size:17px;margin-top:16px" onclick="API.google()"><svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg> Sign in with Google · الدخول بجوجل</button>`
   :`<form id="rf"><label class="fld"><span>Your name · اسمك</span><input id="rn" required placeholder="Ahmed Ali"></label><label class="fld"><span>Gmail</span><input id="re" required type="email" placeholder="name@gmail.com"></label><div class="err" id="rerr"></div><button class="btn b-g" style="width:100%;font-size:17px">🚀 Join · سجّل</button></form>`}
   <div class="note ar">🔒 سجّل بالجيميل، وبعدها اختار الليفل اللي اشتركت فيه — بيتفتحلك بعد تفعيل الأدمن.</div>
  </div></div>`;
  const f=$('#rf'); if(f) f.onsubmit=async e=>{e.preventDefault();const name=$('#rn').value.trim(),email=$('#re').value.trim().toLowerCase();
    if(name.length<2){$('#rerr').textContent='اكتب اسمك';return;} if(!/^[^\s@]+@gmail\.com$/.test(email)){$('#rerr').textContent='لازم إيميل Gmail صحيح';return;}
    await API.register(name,email);render();};
}
function vProfileForm(){
  app.innerHTML=`<div class="auth"><div class="card box"><img class="chatty" src="img/chatty.png" alt="">
   <h1>One more step! ✍️</h1><div class="ar" style="color:var(--mut);font-weight:700">اكتب اسمك بالإنجليزي زي ما هيتكتب في الشهادة.</div>
   <form id="pf"><label class="fld"><span>Full name · الاسم بالكامل</span><input id="pn" required value="${esc(USER.displayName||'')}" placeholder="Ahmed Ali"></label>
   <label class="fld"><span>Gmail</span><input value="${esc(USER.email||'')}" disabled></label><div class="err" id="perr"></div>
   <button class="btn b-g" style="width:100%;font-size:17px">✅ Start · ابدأ</button></form>
   <button class="btn b-soft" style="width:100%;margin-top:10px" onclick="API.logout().then(render)">حساب تاني</button></div></div>`;
  $('#pf').onsubmit=async e=>{e.preventDefault();const n=$('#pn').value.trim();if(n.length<3){$('#perr').textContent='اكتب اسمك كامل';return;}
    try{await API.register(n,USER.email);render();}catch(err){$('#perr').textContent='حصلت مشكلة، جرّب تاني';console.warn(err);}};
}
function waLink(phone,msg){return 'https://wa.me/'+String(phone).replace(/\D/g,'').replace(/^00/,'')+'?text='+encodeURIComponent(msg);}
function contactBtns(msg){
  if(!SET.phones.length) return `<div class="note ar">تواصل مع أكاديمية Lingo Planet لتفعيل اشتراكك.</div>`;
  return `<div class="wa-list">${SET.phones.map(p=>`<a class="wa-btn" target="_blank" rel="noopener" href="${waLink(p.phone,msg)}"><span class="wi">💬</span><span><b>${esc(p.name||'Admin')}</b><small dir="ltr">+${esc(String(p.phone).replace(/\D/g,'').replace(/^00/,''))}</small></span><span class="go">واتساب ←</span></a>`).join('')}</div>`;
}
function subscribe(id){const L1=LV(id);
  const msg=`السلام عليكم 👋\nعايز أشترك في ليفل ${L1.code} (${L1.ar}) في Lingo Planet.\nالاسم: ${PROFILE.name}\nالجيميل: ${PROFILE.email}`;
  openModal(`<div style="text-align:center"><div style="font-size:54px">🔒</div><h2 class="fred" style="margin:0;color:var(--g7)">${L1.code} · ${L1.en}</h2><div class="ar" style="font-weight:800;color:var(--mut)">ليفل ${L1.ar}</div></div>
   <div class="paybox ar"><b>💳 ادفع اشتراكك وافتح الليفل</b><br>كلّم أي حد من الأدمنز على الواتساب، وابعت <b>سكرين الدفع</b> مع الجيميل بتاعك:<div class="mail" dir="ltr">${esc(PROFILE.email)}</div>وهيتفتحلك الليفل على طول ✅</div>
   ${contactBtns(msg)}
   <div class="row" style="justify-content:center;margin-top:12px"><button class="btn b-soft" onclick="closeModal();API.refresh().then(render)">🔄 دفعت؟ اضغط هنا بعد التفعيل</button></div>`);
}
function vPending(){
  const msg=`السلام عليكم، حسابي في Lingo Planet متوقف.\nالاسم: ${PROFILE.name}\nالجيميل: ${PROFILE.email}`;
  app.innerHTML=`<div class="auth"><div class="card box"><img class="chatty" src="img/chatty.png" alt="">
   <h1>Account paused ⛔</h1>
   <div class="ar" style="font-weight:700;color:var(--mut);font-size:16px">حسابك متوقف حاليًا. لو ده خطأ كلّم الأكاديمية.</div>
   <div class="note" style="margin-top:14px">📧 ${esc(PROFILE.email)}</div>
   ${contactBtns(msg)}
   <div class="row" style="justify-content:center;margin-top:14px"><button class="btn b-g" onclick="API.refresh().then(render)">🔄 Check again</button><button class="btn b-w" onclick="API.logout().then(render)">Log out</button></div>
  </div></div>`;
}

/* ================= LEVELS HUB ================= */
function vLevels(){
  const first=(PROFILE.name||'').split(' ')[0];const open=LEVELS.filter(l=>hasLevel(l.id)).length;
  app.innerHTML=topBar()+`<main class="wrapc">
   <section class="hero"><div class="tx"><span class="lv">Lingo Planet · Pre A1 → C1</span><h1>Hi, <span>${esc(first)}</span>! 👋</h1>
     <p class="ar">${open?'اختار الليفل بتاعك وكمّل رحلتك 🚀':'أهلًا بيك! اختار الليفل اللي عايز تبدأ بيه واشترك عشان يتفتحلك.'}</p>
     <div class="stats3"><div class="stat"><b>${open}</b><small>Open levels</small></div><div class="stat"><b>${LEVELS.length}</b><small>All levels</small></div><div class="stat"><b data-progt="all">0%</b><small>Pre A1</small></div></div></div>
    <div class="bubble">From <b>zero</b> to <b>C1</b> 🦜<br>Step by step!</div>
    <img class="ch" src="img/chatty.png" alt="Chatty"></section>
   <h2 class="fred" style="color:var(--g7);margin:26px 0 4px">🗺️ Levels <span class="ar" style="font-size:15px;color:var(--mut)">· المستويات</span></h2>
   <div class="lgrid">${LEVELS.map((l,i)=>{const st=isAdmin()?{on:true}:lvState(PROFILE,l.id);const on=st.on;
     const badge=on?(l.ready?`<span class="lb ok">✅ مفتوح</span>`:`<span class="lb soon">⏳ قريبًا</span>`):(st.expired?`<span class="lb lock">⌛ الاشتراك خلص · جدّد</span>`:`<span class="lb lock">🔒 ادفع اشتراكك</span>`);
     return `<a class="lcard ${on?'on':'off'} lc${i}" href="#level-${l.id}"><div class="lic">${l.ic}</div><div class="lcode">${l.code}</div><div class="len">${l.en}</div><div class="lar ar">${l.ar}</div>${badge}${on&&st.until?`<div class="lexp">لحد ${fmtD(st.until)}</div>`:''}${l.id==='preA1'&&on?`<div class="bar"><i data-prog="all" style="width:0"></i></div>`:''}</a>`;}).join('')}</div>
   <div class="bigcards">
    ${PROFILE.status==='approved'||isAdmin()?`<div class="bc bc-game"><h3>🏆 Champions</h3><p class="ar">أبطال التحديات — مين جايب أعلى سكور.</p><a class="btn b-lime" href="#champions">شوف الأبطال</a><div class="em">🎮</div></div>`:''}
    <div class="bc bc-me"><h3>💬 Subscribe · اشترك</h3><p class="ar">عايز تفتح ليفل جديد؟ كلّم الأدمن على الواتساب وابعت سكرين الدفع.</p><button class="btn b-lime" onclick="subscribe('${(LEVELS.find(l=>!hasLevel(l.id))||LEVELS[0]).id}')">كلّم الأدمن</button><div class="em">📲</div></div>
   </div><div class="foot">Lingo Planet · Diaa Magdy — Speak more · Learn better · Grow further</div></main>`;
  updateProg();
}

/* ================= ADMIN ================= */
let admTab='pending',admQ='';
async function vAdmin(){
  app.innerHTML=topBar('home')+`<main class="adm"><div class="pad" style="text-align:center">⏳ Loading…</div></main>`;
  let S=[];try{S=await API.students();}catch(e){toast('⚠️ '+e.message);}
  S.sort((a,b)=>(b.created||0)-(a.created||0));
  const grp=s=>s.status==='rejected'?'blocked':(LEVELS.some(l=>lvState(s,l.id).on)?'active':'pending');
  const cnt=k=>S.filter(s=>grp(s)===k).length;
  const q=admQ.trim().toLowerCase();
  const L2=S.filter(s=>q?((s.email||'').toLowerCase().includes(q)||(s.name||'').toLowerCase().includes(q)):grp(s)===admTab);
  const owner=isOwner();
  $('.adm').innerHTML=`<div class="hero" style="min-height:0;padding:22px"><div class="tx" style="max-width:70%"><span class="lv">${owner?'Teacher & CEO · Diaa Magdy':'Admin · '+esc(USER.email)}</span><h1 style="font-size:30px">Students</h1><p class="ar">دوّر بالجيميل، واضغط على الليفل اللي الطالب دفعه عشان يتفتحله ✅ — ودوس تاني عشان تقفله.</p>
    <div class="stats3"><div class="stat"><b>${cnt('pending')}</b><small>New</small></div><div class="stat"><b>${cnt('active')}</b><small>Subscribed</small></div><div class="stat"><b>${cnt('blocked')}</b><small>Blocked</small></div></div></div><img class="ch" src="img/chatty.png" alt="" style="width:150px"></div>
   <input class="inp" id="admq" placeholder="🔎 ابحث بالجيميل أو الاسم…" value="${esc(admQ)}" style="width:100%;margin:6px 0">
   ${q?'':`<div class="tabsx">${[['pending','🆕 جداد'],['active','✅ مشتركين'],['blocked','⛔ موقوفين']].map(t=>`<button class="${admTab===t[0]?'on':''}" onclick="admTab='${t[0]}';vAdmin()">${t[1]} (${cnt(t[0])})</button>`).join('')}</div>`}
   <div class="card">${L2.length?L2.map(s=>{const me=(s.email||'').toLowerCase()===ADMIN;return `<div class="stu" style="flex-wrap:wrap"><span class="avatar">${esc((s.name||'?').charAt(0).toUpperCase())}</span><div style="flex:1;min-width:180px"><b>${esc(s.name||'')}</b><small>${esc(s.email||'')}${s.created?' · '+fmtD(s.created):''}</small>
      <div class="lchips">${LEVELS.map(l=>{const st=lvState(s,l.id);return `<button class="lchip ${st.on?'on':st.expired?'exp':''}" data-lv="${l.id}" data-uid="${esc(s.uid)}" data-name="${esc(s.name||'')}" title="${st.until?'لحد '+fmtD(st.until):''}">${st.on?'✅':st.expired?'⌛':'🔒'} ${l.code}${st.until?` <small>${fmtD(st.until)}</small>`:''}</button>`;}).join('')}</div>
      ${lvState(s,'preA1').on?`<div class="mini-prog">${UNIT_LIST.map(n=>{const p=pctOf(s,n),t=testBest(n,s);return `<span title="Unit ${n}">U${n} ${p}%${t!==null?' · 📝'+t+'%':''}</span>`;}).join('')}${s.final?`<span>🎓 ${s.final.best}%</span>`:''}</div>`:''}</div>
      ${me?'':(s.status==='rejected'?`<button class="btn b-g" style="padding:8px 14px" data-st="approved" data-uid="${esc(s.uid)}">↩ Unblock</button>`:`<button class="btn b-red" style="padding:8px 14px" data-st="rejected" data-uid="${esc(s.uid)}">⛔ Block</button>`)}
      ${owner&&!me?`<button class="btn b-w" style="padding:8px 12px" title="Delete" data-del="${esc(s.uid)}" data-name="${esc(s.name||'')}">🗑</button>`:''}</div>`;}).join('')
     :`<div class="pad ar" style="color:var(--mut);text-align:center">لا يوجد طلاب هنا.</div>`}</div>
   ${owner?`<div class="card pad" style="margin-top:16px"><div class="sub">📞 أرقام الأدمنز <small>بتظهر للطالب لما يدوس على ليفل مقفول</small></div>
     <div id="phl">${SET.phones.map((p,i)=>`<div class="setrow"><b>${esc(p.name)}</b><span dir="ltr">+${esc(String(p.phone).replace(/\D/g,''))}</span><button class="mini" data-delph="${i}">✖</button></div>`).join('')||'<div class="ar" style="color:var(--mut)">مفيش أرقام لسه.</div>'}</div>
     <div class="row" style="margin-top:8px"><input class="inp" id="phn" placeholder="الاسم (مثلًا: Mr. Diaa)" style="flex:1;min-width:140px"><input class="inp" id="php" dir="ltr" placeholder="201001234567" style="flex:1;min-width:140px"><button class="btn b-g" id="phadd">➕ إضافة</button></div>
     <div class="ar" style="color:var(--mut);font-size:13px;margin-top:4px">اكتب الرقم بكود الدولة من غير + (مصر: 20… · السعودية: 966…)</div>
     <div class="sub" style="margin-top:22px">👥 الأدمنز المساعدين <small>يقدروا يفتحوا الليفلات ويوقفوا الطلاب — مش بيقدروا يحذفوا أو يغيروا الإعدادات</small></div>
     <div>${SET.admins.map((e,i)=>`<div class="setrow"><b dir="ltr">${esc(e)}</b><button class="mini" data-delad="${i}">✖</button></div>`).join('')||'<div class="ar" style="color:var(--mut)">مفيش أدمنز مساعدين لسه.</div>'}</div>
     <div class="row" style="margin-top:8px"><input class="inp" id="ade" dir="ltr" type="email" placeholder="assistant@gmail.com" style="flex:1;min-width:200px"><button class="btn b-g" id="adadd">➕ إضافة أدمن</button></div></div>`:''}
   <div class="row" style="justify-content:center;margin:16px 0"><a class="btn b-soft" href="#champions">🏆 لوحة الأبطال</a><a class="btn b-soft" href="#home">📚 الليفلات</a></div>`;
  const qi=$('#admq');qi.oninput=()=>{admQ=qi.value;clearTimeout(qi._t);qi._t=setTimeout(()=>{const pos=qi.selectionStart;vAdmin().then(()=>{const n=$('#admq');n.focus();n.setSelectionRange(pos,pos);});},350);};
  $$('[data-lv]').forEach(b=>b.onclick=()=>{const id=b.dataset.lv,uid=b.dataset.uid,L1=LV(id),s=S.find(x=>x.uid===uid),st=lvState(s,id);
    if(st.on){if(!confirm(`قفل ليفل ${L1.code} عن ${b.dataset.name}؟`))return;API.setLevel(uid,id,{on:false,by:USER.email,at:Date.now()}).then(()=>{toast('🔒 اتقفل');vAdmin();}).catch(e=>toast('⚠️ '+e.message));return;}
    openModal(`<h2 class="fred" style="color:var(--g7);margin:0 0 6px">✅ فتح ${L1.code} · ${L1.ar}</h2><div class="ar" style="font-weight:700">للطالب: <b>${esc(b.dataset.name)}</b></div>
      <label class="fld" style="margin-top:12px"><span>ينتهي الاشتراك يوم (اختياري)</span><input type="date" id="lvu"></label><div class="ar" style="color:var(--mut);font-size:13px">سيبه فاضي = مفتوح على طول.</div>
      <div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn b-w" onclick="closeModal()">إلغاء</button><button class="btn b-g" id="lvok">✅ افتح الليفل</button></div>`);
    $('#lvok').onclick=async()=>{const d=$('#lvu').value;const until=d?new Date(d+'T23:59:59').getTime():null;$('#lvok').disabled=true;
      try{await API.setLevel(uid,id,{on:true,until,by:USER.email,at:Date.now()});closeModal();toast('✅ اتفتح ليفل '+L1.code);}catch(e){toast('⚠️ '+e.message);}vAdmin();};});
  $$('[data-del]').forEach(b=>b.onclick=async()=>{if(!confirm('حذف الطالب "'+b.dataset.name+'" نهائيًا؟ لو حاول يدخل تاني هيرجع كطالب جديد.'))return;b.disabled=true;try{await API.remove(b.dataset.del);toast('🗑 تم حذف الطالب');}catch(e){toast('⚠️ '+e.message);}vAdmin();});
  $$('[data-st]').forEach(b=>b.onclick=async()=>{b.disabled=true;try{await API.setStatus(b.dataset.uid,b.dataset.st);toast(b.dataset.st==='approved'?'↩ اترجع':'⛔ اتوقف');}catch(e){toast('⚠️ '+e.message);}vAdmin();});
  if(owner){
    const save=async m=>{try{await API.saveSettings();toast(m);}catch(e){toast('⚠️ '+e.message);}vAdmin();};
    $('#phadd').onclick=()=>{const n=$('#phn').value.trim(),ph=$('#php').value.replace(/\D/g,'').replace(/^00/,'');if(!n||ph.length<9){toast('اكتب الاسم والرقم بكود الدولة');return;}SET.phones.push({name:n,phone:ph});save('✅ اتضاف الرقم');};
    $$('[data-delph]').forEach(b=>b.onclick=()=>{SET.phones.splice(+b.dataset.delph,1);save('اتشال الرقم');});
    $('#adadd').onclick=()=>{const e=$('#ade').value.trim().toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[a-z]+$/.test(e)){toast('اكتب جيميل صحيح');return;}if(e===ADMIN||SET.admins.includes(e))return;SET.admins.push(e);save('✅ اتضاف الأدمن');};
    $$('[data-delad]').forEach(b=>b.onclick=()=>{SET.admins.splice(+b.dataset.delad,1);save('اتشال الأدمن');});
  }
}

/* ================= HOME ================= */
function vHome(){
  const first=PROFILE.name.split(' ')[0]; const done7=UNIT_LIST.filter(n=>{const b=testBest(n);return b!==null&&b>=UNITS[n].test.pass;}).length;
  const finalOpen=isAdmin()||done7===UNIT_LIST.length; const fin=PROFILE.final;
  app.innerHTML=topBar('home')+`<main class="wrapc">
   <section class="hero"><div class="tx"><span class="lv">Pre A1 · Beginner Level</span><h1>Hi, <span>${esc(first)}</span>! 👋</h1>
     <p class="ar">مستوى التأسيس — بداية قوية للكلام الحقيقي بالإنجليزي.</p>
     <div class="stats3"><div class="stat"><b data-progt="all">0%</b><small>Level progress</small></div><div class="stat"><b>${done7} / ${UNIT_LIST.length}</b><small>Tests passed</small></div><div class="stat"><b>${fin?fin.best+'%':'—'}</b><small>Final exam</small></div></div></div>
    <div class="bubble">Hi! I'm <b>Chatty</b> 🦜<br>Let's learn English together!</div>
    <img class="ch" src="img/chatty.png" alt="Chatty" data-say="Hi! I'm Chatty. Let's learn English together!"></section>
   <h2 class="fred" style="color:var(--g7);margin:26px 0 4px">📚 Your units <span class="ar" style="font-size:15px;color:var(--mut)">· الوحدات</span></h2>
   <div class="ugrid">${UNIT_LIST.map(n=>{const u=UNITS[n],op=unlocked(n),p=pct(n),t=testBest(n);
     return `<${op?'a':'div'} class="ucard ${op?'open':'lock'}" ${op?`href="#unit-${n}"`:`onclick="toast('🔒 انجح في اختبار الوحدة ${n-1} الأول')"`}>
      <div class="ucov" style="background-image:url(${u.cover})"><span>${u.icon}</span></div>
      <div class="num">UNIT ${n}</div><h3>${u.title}</h3><div class="ar">${u.ar}</div>
      <div class="bar"><i data-prog="${n}" style="width:${p}%"></i></div><div class="pc">${p}% done${t!==null?` · 📝 ${t}%`:''}</div></${op?'a':'div'}>`;}).join('')}</div>
   <div class="bigcards">
    <div class="bc bc-game"><h3>🏆 Champions</h3><p class="ar">أبطال التحديات — مين جايب أعلى سكور في كل لعبة.</p><a class="btn b-lime" href="#champions">شوف الأبطال</a><div class="em">🎮</div></div>
    <div class="bc bc-me"><h3>📈 My progress</h3><p class="ar">نسبة مذاكرتك في كل وحدة ونتايج اختباراتك.</p><button class="btn b-lime" onclick="openProfile()">حسابي</button><div class="em">🦜</div></div>
    <div class="bc bc-exam"><h3>📝 Final Level Exam</h3><p class="ar">اختبار شامل: Listening · Vocabulary · Grammar · Reading · Writing — بيفتح بعد ما تنجح في الـ ${UNIT_LIST.length} وحدات.</p>${finalOpen?`<a class="btn b-lime" href="#final">▶ ابدأ الاختبار</a>`:`<button class="btn b-w" onclick="toast('🔒 انجح في اختبارات كل الوحدات الأول')">🔒 ${done7}/${UNIT_LIST.length}</button>`}<div class="em">🎯</div></div>
    <div class="bc bc-cert"><h3>🎓 Level Certificate</h3><p class="ar">شهادة اجتياز المستوى PDF باسمك وتوقيع Mr. Diaa Magdy.</p>${(fin&&fin.best>=FINAL.pass)||isAdmin()?`<a class="btn b-w" href="#certificate">📄 ${isAdmin()&&!(fin&&fin.best>=FINAL.pass)?'معاينة الشهادة':'شهادتي'}</a>`:`<button class="btn b-w" onclick="toast('🎓 الشهادة بتطلع بعد النجاح في الاختبار النهائي')">🔒 Locked</button>`}<div class="em">📜</div></div>
   </div><div class="foot">Lingo Planet · Diaa Magdy — Speak more · Learn better · Grow further</div></main>`;
  updateProg();
}

/* ================= PROFILE ================= */
async function openProfile(){
  openModal(`<div style="text-align:center"><img src="img/chatty.png" style="width:90px;margin:0 auto" alt=""><h2 class="fred" style="margin:4px 0 0;color:var(--g7)">${esc(PROFILE.name)}</h2><div style="color:var(--mut);font-weight:700">${esc(PROFILE.email)}</div></div>
   <div class="sub">📈 My progress <small>نسبة المذاكرة في كل وحدة</small></div>
   ${UNIT_LIST.map(n=>{const p=pct(n),t=testBest(n);return `<div class="rrow"><span class="e">${UNITS[n].icon}</span><b>Unit ${n} · ${UNITS[n].title}${t!==null?` <small style="color:var(--g5)">📝 ${t}%</small>`:''}</b><div class="bar"><i style="width:${p}%"></i></div><span class="s">${unlocked(n)?p+'%':'🔒'}</span></div>`;}).join('')}
   <div class="rrow"><span class="e">🎓</span><b>Final exam</b><span class="s">${PROFILE.final?PROFILE.final.best+'%':'—'}</span></div>
   <div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn b-w" onclick="closeModal();API.logout().then(render)">Log out</button></div>`);
}
function openModal(html,onClose){const m=$('#modal');$('#mbody').innerHTML=html;m.classList.add('on');m._close=onClose;}
function closeModal(){const m=$('#modal');if(!m||!m.classList.contains('on'))return;m.classList.remove('on');if(m._close){const f=m._close;m._close=null;f();}}

/* ================= EXERCISE ENGINE ================= */
const S={},EXD={};
function reg(id,total,act){S[id]={total,got:0,ans:0,act};}
function scoreIt(id,ok){const s=S[id];s.ans++;if(ok)s.got++;const sc=$('#sc-'+id);if(sc){sc.textContent=`${s.got} / ${s.total}`;sc.classList.toggle('full',s.ans===s.total);}
  if(s.ans===s.total){done(CUR,s.act);toast(s.got===s.total?'🌟 Perfect! '+s.got+'/'+s.total:'👏 '+s.got+' / '+s.total);}}
function exWrap(id,num,d,inner){return `<div class="ex" id="ex-${id}"><div class="ex-h"><span class="n">${num}</span><div><b>${d.title}</b><div class="ar">${d.ar||''}</div></div><span class="sc" id="sc-${id}">0 / ${S[id].total}</span></div><div id="in-${id}">${inner}</div></div>`;}
function mcqInner(id,d){
  return d.items.map((it,i)=>{
    const q=it.q!==undefined?T(it.q).replace(/_{2,}/g,`<span class="blank" id="bl-${id}-${i}">&nbsp;</span>`):'';
    const sayT=it.say||(it.sayNum?nWord(it.sayNum):(it.q||''));
    return `<div class="it"><span class="qn">${i+1}.</span>${it.pic?`<span class="pic">${it.pic}</span>`:''}<button class="spk sm" data-say="${esc(plain(sayT))}" title="Listen">🔊</button><span class="qt">${q||'<i style="color:var(--mut)">Listen 🎧</i>'}</span><span class="opts">${it.o.map((o,k)=>`<button class="opt" data-ex="${id}" data-i="${i}" data-k="${k}">${esc(o)}</button>`).join('')}</span><span class="mark" id="mk-${id}-${i}"></span></div>`;
  }).join('')+`<div class="ex-foot"><button class="btn b-soft" onclick="resetEx('${id}')">↻ Try again</button></div>`;
}
function ordInner(id,d){return d.items.map((it,i)=>{const sh=seeded(it.c.map((c,k)=>k),i*7+3);
  return `<div class="it ord" id="o-${id}-${i}"><span class="qn">${i+1}.</span><div class="line" id="ol-${id}-${i}"></div><div class="tiles" id="ot-${id}-${i}">${sh.map(k=>`<button class="tile" data-ord="${id}" data-i="${i}" data-k="${k}">${esc(it.c[k])}</button>`).join('')}</div></div>`;}).join('')+`<div class="ex-foot"><button class="btn b-soft" onclick="resetEx('${id}')">↻ Try again</button></div>`;}
function fillInner(id,d){return d.items.map((it,i)=>`<div class="it"><span class="qn">${i+1}.</span><button class="spk sm" data-say="${esc(it.full)}" data-g="${it.g||''}">🔊</button><span class="qt">${it.who?`<b style="color:var(--g5)">${it.who}:</b> `:''}${T(it.before)} <input class="fillin" data-fill="${id}" data-i="${i}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="?"> ${T(it.after)}</span><span class="mark" id="mk-${id}-${i}"></span></div>`).join('')
  +`<div class="ex-foot"><span class="ar" style="color:var(--mut);font-size:13px;margin-inline-end:auto">💡 ${d.items.map(x=>x.ans).sort().join(' · ')}</span><button class="btn b-g" onclick="checkFill('${id}')">✔ Check</button><button class="btn b-soft" onclick="resetEx('${id}')">↻</button></div>`;}
function innerOf(id,d){return d.type==='ord'?ordInner(id,d):d.type==='fill'?fillInner(id,d):mcqInner(id,d);}
function makeEx(id,num,d,act){EXD[id]=d;reg(id,d.items.length,act);return exWrap(id,num,d,innerOf(id,d));}
function resetEx(id){const d=EXD[id];S[id].got=0;S[id].ans=0;$('#in-'+id).innerHTML=innerOf(id,d);const sc=$('#sc-'+id);sc.textContent=`0 / ${S[id].total}`;sc.classList.remove('full');}
document.addEventListener('click',e=>{
  const b=e.target.closest('.opt[data-ex]'); if(b){
    const id=b.dataset.ex,i=+b.dataset.i,k=+b.dataset.k,it=EXD[id].items[i];const btns=$$(`.opt[data-ex="${id}"][data-i="${i}"]`);if(btns[0].disabled)return;
    btns.forEach(x=>x.disabled=true);const ok=k===it.a;b.classList.add(ok?'ok':'bad');if(!ok)btns[it.a].classList.add('show');
    $(`#mk-${id}-${i}`).textContent=ok?'✅':'❌';const bl=$(`#bl-${id}-${i}`);if(bl){bl.textContent=it.o[it.a];bl.classList.add('ok');}
    if(ok){burstAt(b,'🎉');if(it.q&&EXD[id].speak&&/_{2,}/.test(it.q))speakNow(plain(it.q.replace(/_{2,}/,it.o[it.a]).replace(/ \(.*\)$/,'').replace(/ — .*$/,'')));} else sfx(false);
    scoreIt(id,ok);return;}
  const t=e.target.closest('.tile[data-ord]'); if(t){
    const id=t.dataset.ord,i=+t.dataset.i;const line=$(`#ol-${id}-${i}`),tiles=$(`#ot-${id}-${i}`);if(line.dataset.done)return;
    if(t.parentElement===tiles){line.appendChild(t);t.classList.add('in');}else{tiles.appendChild(t);t.classList.remove('in');}
    if(!tiles.children.length){const it=EXD[id].items[i];const ok=[...line.children].map(x=>+x.dataset.k).join()===it.a.join();line.dataset.done=1;line.classList.add(ok?'ok':'bad');
      const S2=ordSentence(it);line.insertAdjacentHTML('beforeend',`<span class="mark">${ok?'✅':'❌'}</span>`);
      if(!ok)$(`#o-${id}-${i}`).insertAdjacentHTML('beforeend',`<div class="fix">✔ ${esc(S2)}</div>`);else burstAt(line,'🎉');speakNow(S2);scoreIt(id,ok);}}
});
function ordSentence(it){const s=it.a.map(k=>it.c[k]).join(' ');return s.charAt(0).toUpperCase()+s.slice(1)+(/[.!?]$/.test(s)?'':'.');}
function checkFill(id){const d=EXD[id];if(S[id].ans)return;
  $$(`.fillin[data-fill="${id}"]`).forEach(inp=>{const i=+inp.dataset.i,it=d.items[i];const ok=norm(inp.value.trim())===norm(it.ans);inp.classList.add(ok?'ok':'bad');inp.disabled=true;if(!ok)inp.value=inp.value?`${inp.value} → ${it.ans}`:it.ans;$(`#mk-${id}-${i}`).textContent=ok?'✅':'❌';scoreIt(id,ok);});}
let AC=null;function sfx(ok){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.value=ok?880:200;g.gain.value=.06;o.connect(g);g.connect(AC.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+.25);o.stop(AC.currentTime+.26);}catch(e){}}

/* ================= SECTION BUILDERS ================= */
function secH(ic,title,ar,acts){return `<div class="sec-h"><div class="ic">${ic}</div><div><h2>${title}</h2><div class="ar">${ar}</div></div>${acts?`<span class="done" data-act="${acts}">⬜</span>`:''}</div>`;}
function tip(en,ar){return `<div class="tip"><img src="img/chatty.png" alt=""><div><b>Chatty's tip:</b> ${T(en)}<div class="ar">${ar}</div></div></div>`;}
let SECMODE='all';
function jump(id){
  SECMODE=id; stopAll(); $$('video').forEach(v=>v.pause());
  $$('.sec').forEach(sec=>sec.classList.toggle('hide',id!=='all'&&sec.id!=='s-'+id));
  $$('.tip-top').forEach(t=>t.classList.toggle('hide',id!=='all'));
  $$('#secnav [data-jump]').forEach(b=>{const on=b.dataset.jump===id;b.classList.toggle('on',on);if(on){const n=$('#secnav');n.scrollTo({left:b.offsetLeft-n.clientWidth/2+b.clientWidth/2,behavior:'smooth'});}});
  const nav=$('#secnav'),el=document.getElementById('s-'+id);
  const top=id==='all'||!el?0:(el.getBoundingClientRect().top+scrollY-64-nav.offsetHeight-6);
  window.scrollTo({top:Math.max(0,top),behavior:'instant'});
}
function videoPlayer(src,poster,act){return `<div class="vbox"><video src="${src}" poster="${poster||''}" controls playsinline preload="none" ${act?`data-vact="${act}"`:''}></video></div>`;}
function lineHTML(v,L,i){const p=v.sp[L[0]];return `<div class="tline" data-li="${i}"><span class="who-av ${p.g[0]==='f'?'f':'m'}">${p.n.charAt(0)}</span><div style="flex:1"><b>${p.n}</b>${T(L[1])}<div class="ar">${L[2]}</div></div><button class="spk sm" data-say="${esc(L[1])}" data-g="${p.g}">🔊</button></div>`;}
function fillFrom(v){return {type:'fill',title:'Complete the conversation',ar:'أكمل المحادثة من الفيديو',items:v.fill.map(([li,word])=>{const L=v.lines[li];const t=L[1];const k=t.toLowerCase().indexOf(word.toLowerCase());const p=v.sp[L[0]];return {who:p.n,g:p.g,full:t,before:t.slice(0,k),after:t.slice(k+word.length),ans:t.substr(k,word.length)};})};}
function gramBlocks(blocks){return blocks.map(b=>{
  if(b.type==='intro') return `<div class="gintro">${T(b.en)}<div class="ar">${b.ar}</div></div>`;
  if(b.type==='big') return `<div class="gbig" style="grid-template-columns:repeat(${b.items.length},1fr)">${b.items.map(x=>`<div class="gb gb${x.c}"><div class="v">${x.v}</div><span class="p">${x.p}</span>${x.eg.map(e=>`<div class="eg" data-say="${esc(e)}">🔊 ${esc(e)}</div>`).join('')}</div>`).join('')}</div>`;
  if(b.type==='uses') return `<div class="sub">${b.title} <small>${b.ar||''}</small></div><div class="uses" style="grid-template-columns:repeat(${Math.min(4,b.items.length)},1fr)">${b.items.map(x=>`<div class="use" data-say="${esc(x[2])}"><div class="e">${x[0]}</div><b>${x[1]}</b>${T(x[2])}<div class="ar">${x[3]||''}</div></div>`).join('')}</div>`;
  if(b.type==='table') return `<div class="sub">${b.title}</div><div class="tscroll"><table class="forms"><tr>${b.head.map(h=>`<th>${h}</th>`).join('')}<th></th></tr>${b.rows.map(r=>`<tr>${r.map((c,i)=>`<td class="${b.neg===i?'neg':''}">${T(c)}</td>`).join('')}<td><button class="spk sm" data-say="${esc(r.filter(c=>/[a-z]{2}/i.test(c)).join('. '))}">🔊</button></td></tr>`).join('')}</table></div>`;
  if(b.type==='list') return `<div class="sub">${b.title}</div><div class="chips">${b.items.map(s=>`<button class="chip" data-say="${esc(s)}">🔊 ${esc(s)}</button>`).join('')}</div>`;
  if(b.type==='parts') return `<div class="sub">${b.title} <small>${b.ar}</small></div><div class="parts">${b.parts.map((p,i)=>`<div class="part pc${i}"><b>${p[0]}</b><span>${p[1]}</span><small class="ar">${p[2]}</small></div>`).join('')}</div>`;
  if(b.type==='preps') return `<div class="preps">${b.items.map(x=>`<div class="prep" data-say="${esc(x[2])}"><div class="e">${x[0]}</div><b>${x[1]}</b><div class="s">${T(x[2])}</div><div class="ar">${x[3]}</div></div>`).join('')}</div>`;
  if(b.type==='clocks') return `<div class="clocks">${b.items.map(x=>`<div class="clock" data-say="${esc(x[1])}">${clockSVG(x[0])}<b>${x[0]}</b><span>${esc(x[1])}</span></div>`).join('')}</div>`;
  if(b.type==='tip') return tip(b.en,b.ar);
  return '';}).join('');}
function clockSVG(t){const [h,m]=t.split(':').map(Number);const ma=m*6,ha=(h%12)*30+m/2;
  return `<svg viewBox="0 0 100 100" width="84" height="84"><circle cx="50" cy="50" r="46" fill="#fff" stroke="#0C6115" stroke-width="5"/>${[...Array(12)].map((_,i)=>{const a=i*30*Math.PI/180;return `<circle cx="${50+38*Math.sin(a)}" cy="${50-38*Math.cos(a)}" r="${i%3?1.6:3}" fill="#0A2116"/>`;}).join('')}<line x1="50" y1="50" x2="${50+24*Math.sin(ha*Math.PI/180)}" y2="${50-24*Math.cos(ha*Math.PI/180)}" stroke="#0A2116" stroke-width="5" stroke-linecap="round"/><line x1="50" y1="50" x2="${50+34*Math.sin(ma*Math.PI/180)}" y2="${50-34*Math.cos(ma*Math.PI/180)}" stroke="#FBA204" stroke-width="3.5" stroke-linecap="round"/><circle cx="50" cy="50" r="4" fill="#0C6115"/></svg>`;}

/* ================= UNIT PAGE ================= */
let vocabSeenSet=new Set();
function vocabSeen(w){vocabSeenSet.add(w);if(vocabSeenSet.size>=6)done(CUR,'voc');}
function vUnit(n){
  CUR=n;loadSprite(n);const u=UNITS[n];Object.keys(S).forEach(k=>delete S[k]);vocabSeenSet=new Set();
  const NAV=[u.videos.length&&['videos','🎬 Videos'],['vocab','📚 Words'],['talk','🗣️ Speaking'],['grammar','📘 Grammar'],['practice','✍️ Practice'],u.numbers&&['numbers','🔢 Numbers'],['reading','📖 Reading'],['sounds','🔤 Sounds'],['games','🎮 Games'],['test','📝 Unit Test']].filter(Boolean);
  let H=topBar(true)+`<main class="wrapc">
   <section class="uhero" style="background-image:linear-gradient(110deg,rgba(10,33,22,.92),rgba(12,97,21,.85) 45%,rgba(29,148,13,.55)),url(${u.cover})"><div class="tx"><span class="k">UNIT ${n} · Pre A1</span><h1>${u.title} ${u.icon}</h1>
    <div class="ar" style="margin-top:8px;font-weight:700;color:#e4f6d6">${u.intro}</div><div class="uprog"><div class="bar"><i data-prog="${n}"></i></div><b data-progt="${n}">0%</b></div></div>
    <img class="ch" src="img/chatty.png" alt="" data-say="Welcome to unit ${n}! Tap any word to hear it."></section>
   <nav class="secnav" id="secnav"><button class="on" data-jump="all">📚 All · الكل</button>${NAV.map(x=>`<button data-jump="${x[0]}">${x[1]}</button>`).join('')}</nav>
   <div class="tip-top">${tip('Tap any English word to hear it and see the meaning!','👆 اضغط على أي كلمة إنجليزية في الصفحة كلها عشان تسمع نطقها وتشوف معناها.')}</div>`;
  /* videos */
  if(u.videos.length){H+=`<section class="sec" id="s-videos">${secH('🎬','Videos','شاهد الفيديو، اقرأ النص، وحل التمارين',u.videos.map(v=>v.id).join(','))}`;
    u.videos.forEach((v,vi)=>{H+=`<div class="sub">${vi+1}️⃣ ${v.title} <small>${v.ar}</small></div>${videoPlayer(v.src,v.poster,v.id)}
      <div class="card trans-card"><div class="row" style="padding:10px 12px"><button class="btn b-g" onclick="playLines('${v.id}')">▶ Listen line by line</button><button class="btn b-soft" onclick="stopAll()">■</button><button class="btn b-soft" onclick="this.closest('.trans-card').classList.toggle('noar')">ع Translation</button></div>
      <div class="trans-l" id="tr-${v.id}">${v.lines.map((L,i)=>lineHTML(v,L,i)).join('')}</div></div>`;
      H+=makeEx(v.id+'q','?',{type:'mcq',title:'Did you understand?',ar:'هل فهمت الفيديو؟',items:v.quiz},v.id+'q');
      if(v.fill) H+=makeEx(v.id+'f','✎',fillFrom(v),v.id+'f');});
    H+=`</section>`;}
  /* vocab */
  H+=`<section class="sec" id="s-vocab">${secH('📚','Vocabulary','الكلمات الجديدة — اضغط على الصورة تسمع الكلمة والجملة','voc')}<div class="vtabs" id="vtabs">${u.vocab.map((g,i)=>`<button class="${i?'':'on'}" data-vt="${i}">${g.t} · <span class="ar">${g.ar}</span></button>`).join('')}</div><div id="vgrid"></div></section>`;
  /* talk */
  H+=`<section class="sec" id="s-talk">${secH('🗣️',"Let's Talk",'أجب عن الأسئلة — اكتب إجابتك واسمعها','talk')}
   ${u.talk.map((t,ti)=>`<div class="sub">${t.title} <small>${t.ar}</small></div><div class="qgrid">${t.list.map((q,i)=>`<div class="qc"><div class="row" style="flex-wrap:nowrap"><button class="spk sm" data-say="${esc(q[0])}">🔊</button><span class="q">${T(q[0])}</span></div><div class="ar">${q[1]}</div>
     <div class="row" style="flex-wrap:nowrap"><input placeholder="Write your answer…" data-talk="${ti}-${i}"><button class="spk sm" style="background:var(--or);box-shadow:none" title="Hear my answer" data-myans="${ti}-${i}">🗣</button></div>
     <button class="mini" style="margin-top:8px" onclick="this.closest('.qc').classList.toggle('open')">💡 Example</button><div class="exa">${T(q[2])} <button class="spk sm" data-say="${esc(q[2])}">🔊</button></div></div>`).join('')}</div>`).join('')}
   ${tip('Listen carefully, think, and give full answers.','استمع جيدًا، فكّر، وجاوب بجملة كاملة.')}</section>`;
  /* grammar + practice */
  H+=`<section class="sec" id="s-grammar">${secH('📘','Grammar: '+u.grammar.title,u.grammar.ar,'gram')}${gramBlocks(u.grammar.blocks)}<div class="row" style="justify-content:center;margin-top:12px"><button class="btn b-g" onclick="done(${n},'gram');toast('✅ تمام! روح للتمارين');jump('practice')">✔ فهمت — للتمارين</button></div></section>`;
  H+=`<section class="sec" id="s-practice">${secH('✍️','Practice','تمارين بنتيجة فورية',u.exercises.map((x,i)=>'ex'+i).join(','))}${u.exercises.map((x,i)=>makeEx('ex'+i,i+1,x,'ex'+i)).join('')}</section>`;
  /* numbers (unit 1) */
  if(u.numbers){const nrow=a=>`<div class="ngrid">${a.map(k=>`<button class="nt w" data-w="${nWord(k)}" data-ar="${nAr(k)}"><b>${k}</b><span>${nWord(k)}</span></button>`).join('')}</div>`;
    const NL={type:'mcq',title:'Listen and choose the number',ar:'استمع واختر الرقم',items:[[13,[13,30,33]],[50,[15,50,55]],[18,[80,18,8]],[46,[64,46,40]],[72,[27,72,70]],[19,[90,9,19]],[89,[98,89,80]],[100,[10,100,1]]].map(([k,o])=>({sayNum:k,o:o.map(String),a:o.indexOf(k)}))};
    H+=`<section class="sec" id="s-numbers">${secH('🔢','Numbers 1 – 100','الأرقام وإزاي تقول عمرك','num')}<div class="sub">1 – 10</div>${nrow([1,2,3,4,5,6,7,8,9,10])}<div class="sub">11 – 20</div>${nrow([11,12,13,14,15,16,17,18,19,20])}<div class="sub">20 – 100</div>${nrow([20,30,40,50,60,70,80,90,100,21])}
     ${tip('21 = twenty-one, 46 = forty-six. Say: I am 12 years old.','من ٢١ لـ ٩٩: العشرات + شرطة + الآحاد. وعشان تقول عمرك: I am + الرقم + years old.')}${makeEx('nl','🎧',NL,'num')}</section>`;}
  /* reading */
  const R=u.reading;
  H+=`<section class="sec" id="s-reading">${secH('📖','Reading: '+R.title,R.ar,'rq')}${R.video?`<div class="sub">🎬 Watch the explanation <small>شرح القطعة بالفيديو</small></div>${videoPlayer(R.video,R.poster)}`:''}
   <div class="rbox"><div class="card pad"><div class="row" style="margin-bottom:8px"><button class="btn b-g" onclick="readAll(${n})">▶ Read to me</button><button class="btn b-soft" onclick="stopAll()">■</button><button class="btn b-soft" onclick="$('#rd').classList.toggle('tr')">ع Translation</button></div>
    <div class="read" id="rd">${R.lines.map((l,i)=>`<p id="rl-${i}"><button class="mini" data-say="${esc(l[0])}" data-g="${R.g||'f'}">🔊</button><span class="tx">${T(l[0])}</span><span class="ar">${l[1]}</span></p>`).join('')}</div></div>
    <div class="card pad"><div class="sub" style="margin-top:0">🔑 Key points</div><div class="fam">${R.keys.map(p=>`<div class="fm" data-say="${esc(p[1])}"><div class="e">${p[0]}</div><b>${p[1]}</b><small>${p[2]}</small></div>`).join('')}</div></div></div>
   ${makeEx('rq','?',{type:'mcq',title:'Reading questions',ar:'أسئلة على القطعة',items:R.quiz},'rq')}</section>`;
  /* sounds */
  const SN=u.sounds;
  H+=`<section class="sec" id="s-sounds">${secH('🔤',SN.title,SN.ar,'sq')}${SN.video?`${videoPlayer(SN.video,SN.poster)}`:''}
   <div class="vwg" style="grid-template-columns:repeat(${Math.min(5,SN.groups.length)},1fr)">${SN.groups.map(v=>`<div class="vw" style="background:${v[3]}"><div class="L">${v[0]}</div><div class="ipa">${v[1]} · ${v[2]}</div><div class="ws">${v[4].map(x=>`<button class="w" data-w="${x[1]}"><i>${x[0]}</i>${x[1]}</button>`).join('')}</div></div>`).join('')}</div>
   ${tip(SN.tip[0],SN.tip[1])}${makeEx('sq','🎧',{type:'mcq',title:SN.quiz.title,ar:SN.quiz.ar,items:SN.quiz.items.map(([pic,w,a])=>({pic,say:w,o:SN.quiz.opts,a}))},'sq')}</section>`;
  /* games */
  H+=`<section class="sec" id="s-games">${secH('🎮','Games & Challenges','العب وتحدّى زمايلك — أعلى سكور بيتكتب اسمه للكل','game')}
   <div class="ggrid"><div class="gcard gc1"><div class="em">🧠</div><h3>Memory Challenge</h3><p class="ar">وصّل كل كلمة بصورتها بأقل محاولات.</p><div class="best" id="best-memory">…</div><button class="btn b-lime" onclick="gMemory()">▶ Play</button></div>
    <div class="gcard gc2"><div class="em">🔤</div><h3>Spelling Bee</h3><p class="ar">اسمع الكلمة ورتّب حروفها.</p><div class="best" id="best-spell">…</div><button class="btn b-w" onclick="gSpell()">▶ Play</button></div>
    <div class="gcard gc3"><div class="em">⚡</div><h3>Speed Challenge</h3><p class="ar">٤٥ ثانية: الجملة صح ولا غلط؟</p><div class="best" id="best-speed">…</div><button class="btn b-w" onclick="gSpeed()">▶ Play</button></div></div>
   <div class="card board"><div class="pad" style="padding-bottom:6px"><div class="row"><h3 class="fred" style="margin:0;color:var(--g7)">🏆 Leaderboard · لوحة الأبطال</h3><span style="flex:1"></span><div class="tabsx" id="lbtabs" style="margin:0">${[['memory','🧠'],['spell','🔤'],['speed','⚡']].map((t,i)=>`<button class="${i?'':'on'}" data-lb="${t[0]}">${t[1]}</button>`).join('')}</div></div></div><div id="lbody"><div class="pad">⏳</div></div></div></section>`;
  /* test */
  H+=`<section class="sec" id="s-test">${secH('📝','Unit '+n+' Test','اختبار الوحدة — Vocabulary · Grammar · Conversation · Reading · Writing','test')}<div id="testArea"></div></section><div class="foot">Lingo Planet · Diaa Magdy</div></main>`;
  app.innerHTML=H;scrollTo(0,0);
  renderVocab(0);renderBoard('memory');renderBests();testStart(n);updateProg(n);
  SECMODE='all';$$('[data-jump]').forEach(a=>a.onclick=()=>jump(a.dataset.jump));
  $$('#vtabs button').forEach(b=>b.onclick=()=>{$$('#vtabs button').forEach(x=>x.classList.remove('on'));b.classList.add('on');renderVocab(+b.dataset.vt);});
  $$('#lbtabs button').forEach(b=>b.onclick=()=>{$$('#lbtabs button').forEach(x=>x.classList.remove('on'));b.classList.add('on');renderBoard(b.dataset.lb);});
  $$('[data-myans]').forEach(b=>b.onclick=()=>{const v=$(`[data-talk="${b.dataset.myans}"]`).value.trim();v?tts(v,{}):toast('اكتب إجابتك الأول ✍️');});
  $$('[data-talk]').forEach(i=>i.addEventListener('change',()=>{if($$('[data-talk]').filter(x=>x.value.trim()).length>=3)done(n,'talk');}));
  $$('video[data-vact]').forEach(v=>{v.addEventListener('play',()=>stopAll());v.addEventListener('timeupdate',()=>{if(v.duration&&v.currentTime/v.duration>.85)done(n,v.dataset.vact);});});
  $$('video').forEach(v=>v.addEventListener('play',()=>{stopAll();$$('video').forEach(o=>{if(o!==v)o.pause();});}));

}
function playLines(id){const u=UNITS[CUR],v=u.videos.find(x=>x.id===id);stopAll();$$('video').forEach(o=>o.pause());const tok=playTok;let i=0;
  const next=()=>{$$(`#tr-${id} .tline`).forEach(t=>t.classList.remove('now'));if(tok!==playTok||i>=v.lines.length)return;const el=$(`#tr-${id} [data-li="${i}"]`);el.classList.add('now');el.scrollIntoView({block:'nearest',behavior:'smooth'});
    const L=v.lines[i];say(L[1],{g:v.sp[L[0]].g,onend:()=>{i++;setTimeout(next,350);}});};next();}
function renderVocab(g){const u=UNITS[CUR];
  $('#vgrid').innerHTML=`<div class="vgrid">${u.vocab[g].items.map(([e,w,s])=>`<div class="vc" data-w="${esc(w)}" data-s="${esc(s)}"><div class="pic">${e}</div><div class="b"><b class="w" data-w="${esc(w)}">${w}</b><div class="ar">${lookup(w)||''}</div><div class="s">${T(s)}</div></div></div>`).join('')}</div>`;
  $$('#vgrid .vc').forEach(c=>c.onclick=e=>{if(e.target.closest('.w'))return;stopAll();const tok=playTok;say(c.dataset.w,{onend:()=>{if(tok===playTok)setTimeout(()=>say(c.dataset.s),250);}});vocabSeen(c.dataset.w);burstAt(c,'⭐');});}
function readAll(n){const R=UNITS[n].reading;stopAll();const tok=playTok;let i=0;const next=()=>{$$('.read p.now').forEach(p=>p.classList.remove('now'));if(tok!==playTok||i>=R.lines.length)return;const p=$('#rl-'+i);p.classList.add('now');say(R.lines[i][0],{g:R.g,onend:()=>{i++;setTimeout(next,300);}});};next();}

/* ================= GAMES ================= */
const gkey=g=>g+'-u'+CUR;
async function addScoreLB(game,score){done(CUR,'game');try{await API.addScore(gkey(game),score);}catch(e){console.warn(e);}delete SC_CACHE[gkey(game)];delete SC_CACHE['*'];renderBoard(game);renderBests();$$('#lbtabs button').forEach(b=>b.classList.toggle('on',b.dataset.lb===game));}
const SC_CACHE={};
async function topOf(key,fresh){const c=SC_CACHE[key||'*'];if(!fresh&&c&&Date.now()-c.t<180000)return c.v;let L2=[];try{L2=await API.scores(key);}catch(e){}L2.sort((a,b)=>b.score-a.score);SC_CACHE[key||'*']={t:Date.now(),v:L2};return L2;}
async function renderBoard(game){const el=$('#lbody');if(!el)return;const L2=(await topOf(gkey(game))).slice(0,10);
  el.innerHTML=L2.length?L2.map((x,i)=>`<div class="lb ${x.uid===USER.uid?'me':''}"><span class="r">${i<3?['🥇','🥈','🥉'][i]:i+1}</span><b>${esc(x.name)}</b><span class="s">${x.score}</span></div>`).join(''):`<div class="pad ar" style="text-align:center;color:var(--mut)">لسه محدش لعب — كن أول بطل! 🏆</div>`;}
async function renderBests(){for(const g of ['memory','spell','speed']){const el=$('#best-'+g);if(!el)continue;const t=(await topOf(gkey(g)))[0];el.innerHTML=t?`👑 ${esc(t.name)} · ${t.score}`:'👑 No champion yet';}}
async function endGame(game,score,msg){
  await addScoreLB(game,score);const rank=(await topOf(gkey(game))).findIndex(x=>x.uid===USER.uid)+1;
  $('#mbody').innerHTML=`<div style="text-align:center"><img src="img/chatty.png" style="width:120px;margin:0 auto" alt=""><h2 class="fred" style="color:var(--g7);margin:6px 0">${msg}</h2><div class="fred" style="font-size:56px;color:var(--g5);line-height:1">${score}</div><div style="font-weight:800;color:var(--mut)">points · ترتيبك #${rank||'—'}</div>
   <div class="row" style="justify-content:center;margin-top:14px"><button class="btn b-g" onclick="closeModal();${game==='memory'?'gMemory':game==='spell'?'gSpell':'gSpeed'}()">↻ Play again</button><button class="btn b-soft" onclick="closeModal();jump('games')">🏆 Leaderboard</button></div></div>`;
  speakNow(score>0?'Great job!':'Try again!');
}
function gMemory(){const P=UNITS[CUR].games.pairs;
  const cards=seeded([...P.map((p,i)=>({k:i,t:'e',v:p[0]})),...P.map((p,i)=>({k:i,t:'w',v:p[1]}))],Date.now()%9973);let open=[],got=0,moves=0,t0=Date.now(),lock=false;
  openModal(`<h2 class="fred" style="margin:0;color:var(--g7)">🧠 Memory Challenge</h2><div class="hud"><span>Moves: <b id="mm">0</b></span><span>⏱ <b id="mt">0</b>s</span></div><div class="mem">${cards.map((c,i)=>`<button class="mc" data-i="${i}"><span class="q">?</span></button>`).join('')}</div>`,()=>clearInterval(tm));
  const tm=setInterval(()=>{const e=$('#mt');if(e)e.textContent=Math.round((Date.now()-t0)/1000);},1000);
  $$('.mc').forEach(b=>b.onclick=()=>{if(lock)return;const c=cards[+b.dataset.i];if(b.classList.contains('up')||b.classList.contains('got'))return;
    b.classList.add('up');b.innerHTML=c.t==='e'?`<span class="e">${c.v}</span>`:c.v;if(c.t==='w')say(c.v);open.push([b,c]);
    if(open.length===2){moves++;$('#mm').textContent=moves;const [[b1,c1],[b2,c2]]=open;open=[];
      if(c1.k===c2.k&&c1.t!==c2.t){b1.classList.add('got');b2.classList.add('got');got++;burstAt(b2,'🎉');sfx(true);
        if(got===P.length){clearInterval(tm);const secs=Math.round((Date.now()-t0)/1000);setTimeout(()=>endGame('memory',Math.max(50,1000-moves*25-secs*5),'🎉 You did it!'),600);}}
      else{lock=true;setTimeout(()=>{[b1,b2].forEach(x=>{x.classList.remove('up');x.innerHTML='<span class="q">?</span>';});lock=false;},800);}}});}
function gSpell(){const words=seeded(UNITS[CUR].games.spell,Date.now()%7919).slice(0,6);let qi=0,score=0,typed=[];
  openModal(`<h2 class="fred" style="margin:0;color:var(--g7)">🔤 Spelling Bee</h2><div class="hud"><span>Word <b id="sq">1</b>/6</span><span>⭐ <b id="ss">0</b></span></div><div id="sgame"></div>`);
  const show=()=>{const [e,w0]=words[qi];const w=w0.toLowerCase().replace(/[^a-z]/g,'');typed=[];const Lt=seeded(w.split(''),qi*13+w.length);
    $('#sgame').innerHTML=`<div class="big-e">${e}</div><div style="text-align:center"><button class="btn b-g" data-say="${esc(w0)}">🔊 Listen</button></div><div class="slots">${w.split('').map(()=>'<span></span>').join('')}</div><div class="letters">${Lt.map(c=>`<button data-c="${c}">${c}</button>`).join('')}</div><div style="text-align:center"><button class="btn b-soft" id="sundo">⌫ Undo</button></div>`;
    say(w0);
    $$('.letters button').forEach(b=>b.onclick=()=>{b.disabled=true;typed.push(b);const sl=$$('.slots span');sl[typed.length-1].textContent=b.dataset.c;
      if(typed.length===w.length){const ok=typed.map(x=>x.dataset.c).join('')===w;if(ok){score+=100;burstAt(sl[sl.length-1],'🎉');sfx(true);}else{sfx(false);sl.forEach((s,i)=>{s.textContent=w[i];s.style.color='var(--bad)';});}
        say(w0);$('#ss').textContent=score;setTimeout(()=>{qi++;if(qi<words.length){$('#sq').textContent=qi+1;show();}else endGame('spell',score,score>=500?'🐝 Spelling star!':'👏 Good try!');},1400);}});
    $('#sundo').onclick=()=>{const b=typed.pop();if(!b)return;b.disabled=false;$$('.slots span')[typed.length].textContent='';};};show();}
function gSpeed(){const Q=seeded(UNITS[CUR].games.speed,Date.now()%6007);let qi=0,score=0,left=45;
  openModal(`<h2 class="fred" style="margin:0;color:var(--g7)">⚡ Speed Challenge</h2><div class="hud"><span>⭐ <b id="ps">0</b></span><span>⏱ <b id="pt">45</b>s</span></div><div class="timer"><i id="pbar" style="width:100%"></i></div><div class="speedq" id="pq" style="margin-top:12px"></div><div class="tf"><button class="t" id="pT">✔ Correct</button><button class="f" id="pF">✖ Wrong</button></div>`,()=>clearInterval(tm));
  const show=()=>{$('#pq').textContent=Q[qi%Q.length][0];};
  const ans=v=>{const ok=Q[qi%Q.length][1]===v;score=Math.max(0,score+(ok?10:-5));$('#ps').textContent=score;burstAt($(v?'#pT':'#pF'),ok?'✅':'❌');sfx(ok);qi++;show();};
  $('#pT').onclick=()=>ans(true);$('#pF').onclick=()=>ans(false);show();
  const tm=setInterval(()=>{left--;const t=$('#pt');if(!t){clearInterval(tm);return;}t.textContent=left;$('#pbar').style.width=(left/45*100)+'%';if(left<=0){clearInterval(tm);endGame('speed',score,score>=100?'⚡ Super fast!':'👏 Nice!');}},1000);}

/* ================= CHAMPIONS ================= */
async function vChampions(){
  app.innerHTML=topBar(true)+`<main class="wrapc"><div class="sec"><div class="sec-h"><div class="ic">🏆</div><div><h2>Champions · الأبطال</h2><div class="ar">مجموع أعلى سكور لكل طالب في كل الألعاب والوحدات</div></div></div><div id="champ" class="card"><div class="pad">⏳</div></div><div id="champ2"></div></div></main>`;
  const all=await topOf(null);const tot={};all.forEach(x=>{tot[x.uid]=tot[x.uid]||{name:x.name,uid:x.uid,s:0,n:0};tot[x.uid].s+=x.score;tot[x.uid].n++;});
  const R=Object.values(tot).sort((a,b)=>b.s-a.s).slice(0,20);
  $('#champ').innerHTML=R.length?R.map((x,i)=>`<div class="lb ${x.uid===USER.uid?'me':''}"><span class="r">${i<3?['🥇','🥈','🥉'][i]:i+1}</span><b>${esc(x.name)} <small style="color:var(--mut)">· ${x.n} games</small></b><span class="s">${x.s}</span></div>`).join(''):`<div class="pad ar" style="text-align:center">لسه محدش لعب!</div>`;
  $('#champ2').innerHTML=UNIT_LIST.map(n=>{const g=['memory','spell','speed'].map(k=>{const b=all.filter(x=>x.key===k+'-u'+n).sort((a,c)=>c.score-a.score)[0];return `<span class="chip">${{memory:'🧠',spell:'🔤',speed:'⚡'}[k]} ${b?esc(b.name)+' · '+b.score:'—'}</span>`;}).join('');return `<div class="sub">${UNITS[n].icon} Unit ${n} · ${UNITS[n].title}</div><div class="chips">${g}</div>`;}).join('');
}

/* ================= TESTS (unit + final) ================= */
let TA={},TST=null,LAST=null;
function testStart(n){const T0=UNITS[n].test;const tb=testBest(n);
  $('#testArea').innerHTML=`<div class="test-start"><h2 class="fred" style="margin:0;font-size:28px">Ready for the Unit ${n} test? 🎯</h2>
   <div class="ar" style="color:#d6f0c6;font-weight:700;margin-top:4px">الاختبار فيه ٥ أجزاء والنتيجة بتظهر في الآخر. لازم ${T0.pass}% عشان تنجح وتفتح الوحدة اللي بعدها، وتقدر تنزّل النتيجة PDF وتبعتها للمستر.</div>
   <ul>${T0.sections.map(s=>`<li>${s.icon} ${s.title}</li>`).join('')}</ul>${tb!==null?`<div style="font-weight:900;margin-bottom:10px">🏅 Best score: ${tb}%</div>`:''}
   <button class="btn b-lime" style="font-size:17px" onclick="testRender('#testArea',UNITS[${n}].test,'u${n}','Unit ${n} · ${esc(UNITS[n].title)}')">▶ Start the test</button><img class="ch" src="img/chatty.png" alt=""></div>`;}
function testRender(sel,T0,key,label){
  TA={};TST={T0,key,label,sel};let q=0;
  $(sel).innerHTML=T0.sections.map(s=>`<div class="tsec"><div class="tsec-h"><span class="e">${s.icon}</span><div><b>${s.title}</b> <span class="ar" style="color:var(--mut)">· ${s.ar}</span></div></div><div class="tsec-b">
   ${s.listen?`<div class="ar" style="color:var(--mut);margin:8px 0">🎧 اضغط 🔊 واسمع الجملة، وبعدين اختار الإجابة الصح. تقدر تسمع أكتر من مرة.</div>`:''}
   ${s.passage?`<div class="passage"><div class="row" style="margin-bottom:6px"><button class="btn b-g" style="padding:7px 12px" data-say="${esc(s.passage.join(' '))}">🔊 Listen</button><b style="color:#a86a00">Read the text:</b></div>${s.passage.map(T).join(' ')}</div>`:''}
   ${s.writing?`<div class="fb" style="margin-top:12px"><b>${T(s.prompt)}</b><div class="ar">${s.promptAr}</div><div class="chk" id="wchk">${s.checks.map(c=>`<span>${c[0]} ${esc(c[1])}</span>`).join('')}</div></div>
     <textarea class="essay" id="essay" placeholder="Write here in English…" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="sentences"></textarea><div class="row"><span class="wc" id="wcount">0 words</span><span style="flex:1"></span><span class="ar" style="font-size:13px;color:var(--mut)">اكتب بنفسك — من ٤٠ لـ ٨٠ كلمة</span></div>`:''}
   ${(s.qs||[]).map((it,i)=>{q++;const sayT=it.say||it.q;return `<div class="it"><span class="qn">${q}.</span>${it.pic?`<span class="pic">${it.pic}</span>`:''}<button class="spk ${s.listen?'':'sm'}" data-say="${esc(plain(s.listen?it.audio:sayT))}" data-g="${it.g||''}">🔊</button><span class="qt">${s.listen?`<i style="color:var(--mut)">${esc(it.q||'Listen and choose.')}</i>`:T(it.q).replace(/_{2,}/g,'<span class="blank">&nbsp;</span>')}</span><span class="opts">${it.o.map((o,k)=>`<button class="opt" data-t="${s.id}-${i}" data-k="${k}">${esc(o)}</button>`).join('')}</span></div>`;}).join('')}
   </div></div>`).join('')+`<div class="row" style="justify-content:center;margin:18px 0"><button class="btn b-or" style="font-size:18px;padding:14px 26px" onclick="testSubmit()">✔ Finish & see my result</button></div><div id="testRes"></div>`;
  $$('.opt[data-t]').forEach(b=>b.onclick=()=>{$$(`.opt[data-t="${b.dataset.t}"]`).forEach(x=>x.classList.remove('pick'));b.classList.add('pick');TA[b.dataset.t]=+b.dataset.k;});
  const ta=$('#essay');const W=T0.sections.find(s=>s.writing);
  ta.addEventListener('input',()=>{const c=(ta.value.match(/[A-Za-z']+/g)||[]).length;const w=$('#wcount');w.textContent=c+' words';w.classList.toggle('okk',c>=40);const g=W.checks.map(c=>CHECK[c[2]]?CHECK[c[2]](ta.value):false);$$('#wchk span').forEach((sp,i)=>sp.classList.toggle('on',g[i]));});
  ta.addEventListener('paste',e=>{e.preventDefault();toast('✍️ لازم تكتب بنفسك — اللصق مش مسموح');});ta.addEventListener('drop',e=>e.preventDefault());
  $(sel).scrollIntoView({behavior:'smooth'});
}
function testSubmit(){
  const {T0,key,label,sel}=TST;const total=T0.sections.reduce((a,s)=>a+(s.qs?s.qs.length:0),0);const answered=Object.keys(TA).length;const essay=($('#essay').value||'').trim();
  if((answered<total||essay.split(/\s+/).filter(Boolean).length<10)&&!testSubmit.w){testSubmit.w=true;toast(`⚠️ فاضل ${total-answered} سؤال${essay.length<10?' والكتابة':''} — اضغط تاني لو عايز تسلّم`);return;}
  testSubmit.w=false;const W=T0.sections.find(s=>s.writing);
  const secs=T0.sections.map(s=>{if(s.writing){const g=gradeEssay(essay,W.checks);return {s,got:g.score,tot:g.max,g};}
    let got=0;const rev=[];s.qs.forEach((it,i)=>{const a=TA[s.id+'-'+i];if(a===it.a)got++;else rev.push({q:s.listen?('🎧 '+it.audio):it.q,your:a===undefined?'—':it.o[a],right:it.o[it.a]});});return {s,got,tot:s.qs.length,rev};});
  const obj=secs.filter(x=>!x.g);const og=obj.reduce((a,x)=>a+x.got,0),ot=obj.reduce((a,x)=>a+x.tot,0);const Wg=secs.find(x=>x.g);
  const pc=Math.round(og/ot*80+Wg.got/Wg.tot*20);const pass=pc>=T0.pass;
  if(key==='final'){const prev=PROFILE.final;PROFILE.final={best:Math.max(pc,prev?prev.best:0),last:pc,date:Date.now()};}
  else{PROFILE.tests=PROFILE.tests||{};const prev=PROFILE.tests[key];PROFILE.tests[key]={best:Math.max(pc,prev?prev.best:0),last:pc,date:Date.now()};done(CUR,'test');}
  API.saveProg();
  const stars=pc>=90?'⭐⭐⭐':pc>=75?'⭐⭐☆':pc>=T0.pass?'⭐☆☆':'☆☆☆';LAST={pc,pass,secs,essay,date:new Date(),label,key};
  $$('.opt[data-t]').forEach(b=>{const [sid,i]=b.dataset.t.split('-');const it=T0.sections.find(s=>s.id===sid).qs[+i];b.disabled=true;if(+b.dataset.k===it.a)b.classList.add(b.classList.contains('pick')?'ok':'show');else if(b.classList.contains('pick'))b.classList.add('bad');});
  $('#essay').disabled=true;
  const nextU=key.startsWith('u')?+key.slice(1)+1:0;
  $('#testRes').innerHTML=`<div class="result"><div class="res-top"><img class="ch" src="img/chatty.png" alt=""><div class="pc">${pc}%</div><div class="st">${stars}</div>
    <div class="pass ${pass?'y':'n'}">${pass?'✅ PASSED · ناجح':'❌ Try again · حاول تاني'}</div><div class="ar" style="margin-top:8px;color:#d6f0c6;font-weight:700">${pass?(key==='final'?'مبروك! شهادتك جاهزة 🎓':'برافو! كده فتحت الوحدة اللي بعدها 🎉'):'راجع الأجزاء اللي غلطت فيها وجرّب تاني 💪'}</div></div>
   <div class="res-b">${secs.map(x=>`<div class="rrow"><span class="e">${x.s.icon}</span><b>${x.s.title} <span class="ar" style="color:var(--mut);font-weight:600">· ${x.s.ar}</span></b><div class="bar"><i style="width:${x.got/x.tot*100}%"></i></div><span class="s">${x.got}/${x.tot}</span></div>`).join('')}
    ${essayFeedbackHTML(Wg.g,essay)}
    ${secs.some(x=>x.rev&&x.rev.length)?`<div class="fb"><h4>🔁 Review your mistakes · راجع أخطاءك</h4>${secs.filter(x=>x.rev).flatMap(x=>x.rev).map(r=>`<div class="rev">${esc(r.q)}<br><span class="neg">✖ ${esc(r.your)}</span> &nbsp; <span class="hl">✔ ${esc(r.right)}</span></div>`).join('')}</div>`:''}
    <div class="row" style="justify-content:center;margin-top:14px"><button class="btn b-g" id="pdfBtn" onclick="makePDF()">📄 Download PDF</button>
     <a class="btn b-lime" target="_blank" rel="noopener" href="https://wa.me/${CFG.whatsapp||''}?text=${encodeURIComponent(`Lingo Planet · Pre A1 · ${label}\nName: ${PROFILE.name}\nScore: ${pc}% ${pass?'(Passed)':'(Not passed)'}\n${secs.map(x=>x.s.title+': '+x.got+'/'+x.tot).join('\n')}`)}">💬 WhatsApp</a>
     ${pass&&key==='final'?`<a class="btn b-or" href="#certificate">🎓 My certificate</a>`:''}${pass&&nextU&&UNITS[nextU]?`<a class="btn b-or" href="#unit-${nextU}">▶ Unit ${nextU}</a>`:''}
     <button class="btn b-soft" onclick="testRender('${sel}',TST.T0,'${key}',TST.label)">↻ Retake</button></div></div></div>`;
  $('#testRes').scrollIntoView({behavior:'smooth'});speakNow(pass?'Congratulations! You passed!':'Good try! Practice and try again.');sfx(pass);
}

/* ---------- automatic writing marking ---------- */
const JOBS='student|teacher|doctor|engineer|nurse|farmer|chef|driver|pilot|worker|officer|police|lawyer|accountant|dentist|pharmacist|manager|housewife';
const has=(re)=>t=>re.test(' '+t.toLowerCase()+' ');
const CHECK={
 name:has(/my name is|my name's|\bi'?m [a-z]+|\bi am [a-z]+/), age:has(/years old|\b\d{1,2}\b/), from:has(/\bfrom\b/), live:has(/\blive[s]?\b/), job:has(new RegExp('\\b('+JOBS+')s?\\b')),
 family:has(/\b(father|mother|brother|sister|family|grandfather|grandmother|dad|mom|parents)\b/),
 getup:has(/get[s]? up|wake[s]? up/), breakfast:has(/breakfast/), go:has(/\bgo(es)? to\b/), after:has(/after school|after work|afternoon/), evening:has(/evening|night/), bed:has(/go(es)? to bed|sleep/),
 animal:has(/favou?rite animal|i have a|\b(dog|cat|bird|rabbit|fish|horse|lion|elephant|monkey)\b/), petname:has(/(its|his|her) name/), describe:has(/\b(big|small|brown|white|black|cute|fast|strong|friendly|funny|beautiful)\b/), likes:has(/\b(like|likes|love|loves|enjoy)\b/), because:has(/because/),
 ihave:has(/\bi have\b/), hehas:has(/\b(he|father|brother|dad) has\b|\bmy (father|brother|dad) has\b/), shehas:has(/\b(she|mother|sister|mom) has\b/), donthave:has(/don't have|doesn't have|do not have|does not have/), room:has(/my room|in my room|room has/),
 favfood:has(/favou?rite food/), dontlike:has(/don't like|do not like|doesn't like/), drink:has(/\bdrink/),
 house:has(/\b(house|apartment|flat|home)\b/), thereis:has(/there is|there are/), prep:has(/\b(in|on|under|behind|next to|near|between|in front of)\b/),
 day:has(/\bon (monday|tuesday|wednesday|thursday|friday|saturday|sunday)/), time:has(/o'clock|half past|quarter|\bat \d/), birthday:has(/birthday/), season:has(/\b(spring|summer|autumn|winter|fall)\b/), weather:has(/\b(hot|cold|sunny|rain|snow|warm|windy)\b/)
};
const EXTRA=('a an the and or but so because very too also my your his her our their its me him them us i you he she it we they am is are was were be have has had do does not no yes like likes love loves play plays playing watch watching tv read reading write writing study studying learn school class grade old years year live lives in at on from with of to for this that these those there here big small happy good nice kind beautiful great name called call work works job hospital company office shop house home flat apartment city town village country street egypt cairo giza alexandria sohag aswan luxor mansoura tanta assiut minya qena mom dad parents son daughter uncle aunt cousin wife husband baby child children kids boy girl man woman people friend friends best football basketball swimming games music drawing cooking computer phone mobile english arabic math science one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty thirty forty fifty sixty seventy eighty ninety hundred hello hi bye thanks thank please sorry favourite favorite color colour food sport hobby hobbies dream want wants go goes going speak speaks help helps can will every day morning evening afternoon night weekend lot lots many much all older younger only together sometimes usually always often never then after before up get gets wake shower breakfast lunch dinner bed sleep sleeps tea coffee milk juice water eat eats drink drinks cook cooks clean cleans room kitchen bedroom bathroom garden sofa desk chair table window door under behind next near between front time clock half past quarter monday tuesday wednesday thursday friday saturday sunday january february march april may june july august september october november december spring summer autumn winter hot cold sunny rain snow warm weather birthday pet pets dog cat bird fish rabbit horse cow sheep lion elephant monkey brown white black red blue green yellow orange pink cute fast strong friendly funny pizza pasta chicken rice bread egg eggs fruit apple apples banana bananas vegetables salad healthy delicious hungry sweet sweets mosque gym travel rest visit park beach sea swim clothes car bike bus walk walks walking toys books pen pencil bag').split(/\s+/);
let DICT=null;function known(w){DICT=DICT||new Set([...Object.keys(AR),...EXTRA,...NAMES]);w=norm(w).replace(/'s$/,'');if(DICT.has(w))return true;for(const s of ['s','es','ies','ed','ing','d','ly'])if(w.endsWith(s)&&(DICT.has(w.slice(0,-s.length))||DICT.has(w.slice(0,-s.length)+'y')||DICT.has(w.slice(0,-s.length)+'e')))return true;return /^(i'm|i've|i'll|it's|he's|she's|we're|they're|you're|don't|doesn't|isn't|aren't|can't|o'clock|i'd)$/.test(w);}
function gradeEssay(text,checks){
  const words=text.match(/[A-Za-z][A-Za-z']*/g)||[];const wc=words.length;const marks=[];
  const lenPts=wc>=40?4:wc>=30?3:wc>=20?2:wc>=10?1:0;
  const cc=checks.map(c=>CHECK[c[2]]?CHECK[c[2]](text):false);const conPts=cc.filter(Boolean).length;
  const GR=[[/\bI (is|are)\b/gi,'I am','مع I نستخدم am'],[/\b(he|she|it) (am|are)\b/gi,'… is','مع he/she/it نستخدم is'],[/\b(we|you|they) (am|is)\b/gi,'… are','مع we/you/they نستخدم are'],
   [/\bmy (father|mother|brother|sister|friend|teacher|dad|mom|cat|dog) (am|are)\b/gi,'my … is','مع شخص واحد نستخدم is'],
   [/\b(I|he|she|we|they|you) (\d+|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen) years\b/gi,'I am … years old','ناقص am / is / are قبل العمر'],
   [/\b(I|he|she|we|they|you) from\b/gi,'I am from','ناقص am / is / are قبل from'],
   [new RegExp('\\b(am|is) ('+JOBS+')\\b','gi'),'am a / is a …','ناقص a أو an قبل الوظيفة'],
   [/\ba (engineer|officer|accountant|apple|egg|elephant|umbrella|orange|old)\b/gi,'an …','قبل الحرف المتحرك نستخدم an'],
   [/\b(he|she|it|my (father|mother|brother|sister|friend|dad|mom)) (play|go|watch|like|live|work|study|eat|drink|cook|read|get|have|want|love|help|clean|sleep|walk)\b/gi,'he plays / she goes …','مع he / she / it زوّد s على الفعل'],
   [/\b(I|we|they|you) (plays|goes|watches|likes|lives|works|studies|eats|drinks|cooks|reads|gets|has|wants|loves|helps|cleans|sleeps|walks)\b/gi,'I play / they go …','مع I / we / they / you الفعل من غير s'],
   [/\b(doesn't|does not|don't) has\b/gi,"doesn't have",'بعد don\'t / doesn\'t نستخدم have'],
   [/\bon (january|february|march|april|may|june|july|august|september|october|november|december|summer|winter|spring|autumn)\b/gi,'in …','مع الشهور والفصول نستخدم in'],
   [/\bin (monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi,'on …','مع الأيام نستخدم on']];
  let gErr=0;GR.forEach(([re,fix,ar])=>{let m;re.lastIndex=0;while((m=re.exec(text))){gErr++;marks.push({s:m.index,e:m.index+m[0].length,t:'g',msg:`${ar} ← ${fix}`});}});
  const graPts=wc?Math.max(0,5-gErr):0;
  let mErr=0;const mIss=[];let m;const lowI=/(^|[^A-Za-z'])(i)(?=[^A-Za-z'’]|$|'m)/g;while((m=lowI.exec(text))){mErr++;const s=m.index+m[1].length;marks.push({s,e:s+1,t:'g',msg:'الضمير I يُكتب كابيتال دائمًا'});}
  const dm=/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|march|april|june|july|august|september|october|november|december|egypt|cairo|english|arabic)\b/g;while((m=dm.exec(text))){mErr++;marks.push({s:m.index,e:m.index+m[0].length,t:'g',msg:'الأيام والشهور والبلاد واللغات بحرف كابيتال'});}
  const sents=text.split(/(?<=[.!?])\s+/).filter(x=>x.trim());let capE=0;sents.forEach(s=>{const c=s.trim().charAt(0);if(c&&c!==c.toUpperCase())capE++;});if(capE){mErr+=Math.min(2,capE);mIss.push(`${capE} جملة بتبدأ بحرف صغير — ابدأ كل جملة بحرف كابيتال`);}
  if(wc&&!/[.!?]\s*$/.test(text)){mErr++;mIss.push('حط نقطة (.) في آخر الكلام');}
  if(wc>15&&!/[.!?]/.test(text.slice(0,-1))){mErr++;mIss.push('قسّم الكلام لجمل قصيرة وحط نقطة بعد كل جملة');}
  const unk=[];const wre=/[A-Za-z][A-Za-z']*/g;while((m=wre.exec(text))){const w=m[0];if(/^[A-Z]/.test(w)&&w!=='I')continue;if(!known(w)){unk.push(w);marks.push({s:m.index,e:m.index+w.length,t:'sp',msg:'راجع الإملاء'});}}
  mErr+=Math.floor(unk.length/2);const mecPts=wc?Math.max(0,5-mErr):0;
  return {score:lenPts+conPts+graPts+mecPts,max:20,wc,cc,marks,crit:[
   ['📏','Length · الطول',lenPts,4,wc>=40?`${wc} كلمة — ممتاز`:`${wc} كلمة — المطلوب ٤٠ كلمة على الأقل`],
   ['🧩','Content · المحتوى',conPts,6,checks.map((c,i)=>(cc[i]?'✅':'❌')+' '+c[1]).join(' · ')],
   ['📘','Grammar · القواعد',graPts,5,gErr?`${gErr} غلطة قواعد — شوف العلامات الحمرا`:'مفيش أخطاء قواعد واضحة 👏'],
   ['✏️','Spelling & punctuation · الإملاء والترقيم',mecPts,5,[...mIss,unk.length?`كلمات راجع إملاءها: ${[...new Set(unk)].slice(0,8).join('، ')}`:''].filter(Boolean).join(' — ')||'كتابة نضيفة 👏']]};
}
function essayFeedbackHTML(g,text){const ms=g.marks.slice().sort((a,b)=>a.s-b.s);let out='',p=0;ms.forEach(x=>{if(x.s<p)return;out+=esc(text.slice(p,x.s))+`<mark class="${x.t==='sp'?'sp':''}" title="${esc(x.msg)}" onclick="toast(this.title)">${esc(text.slice(x.s,x.e))}</mark>`;p=x.e;});out+=esc(text.slice(p));
  return `<div class="fb"><h4>✍️ Writing feedback · تصحيح الكتابة <span style="float:right;color:var(--g5)">${g.score}/20</span></h4>${g.crit.map(c=>`<div class="crit"><span>${c[0]}</span><span class="pt">${c[2]}/${c[3]}</span><div><b>${c[1]}</b><div class="ar" style="font-size:13.5px;color:var(--mut)">${c[4]}</div></div></div>`).join('')}
   <div class="sub" style="font-size:15px;margin:10px 0 6px">Your text <small>الأحمر = قواعد · الأصفر = إملاء — اضغط على العلامة تعرف السبب</small></div><div class="essay-show">${out||'<i>—</i>'}</div>
   <div class="ar" style="font-size:12.5px;color:var(--mut);margin-top:6px">🤖 التصحيح تلقائي ومبدئي — المستر ضياء بيراجع النتيجة لما تبعتها.</div></div>`;}

/* ---------- PDF ---------- */
async function savePDF(pdf,filename){const blob=pdf.output('blob');
  try{const d=window.claude?await claude.use('downloads'):null;if(d){await d.save({filename,data:blob});toast('📄 تم حفظ الملف');return;}}catch(e){if(e&&e.code==='declined')return;}
  if(window.AndroidBridge){}
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},4000);toast('📄 الملف اتحفظ في Downloads');}
async function toPDF(el,filename,landscape){
  if(!window.html2canvas||!window.jspdf){toast('⏳ لحظة… جرّب تاني');return;}
  const canvas=await html2canvas(el,{scale:2,backgroundColor:'#ffffff',useCORS:true});const {jsPDF}=window.jspdf;const pdf=new jsPDF({orientation:landscape?'landscape':'portrait',unit:'pt',format:'a4'});
  const pw=pdf.internal.pageSize.getWidth(),ph=pdf.internal.pageSize.getHeight();const ih=canvas.height*pw/canvas.width;const img=canvas.toDataURL('image/jpeg',.92);
  if(landscape||ih<=ph)pdf.addImage(img,'JPEG',0,0,pw,Math.min(ih,ph));else{let y=0;while(y<ih){pdf.addImage(img,'JPEG',0,-y,pw,ih);y+=ph;if(y<ih)pdf.addPage();}}
  await savePDF(pdf,filename);}
function makePDF(){if(!LAST)return;const b=$('#pdfBtn');b.disabled=true;b.textContent='⏳ …';const Wg=LAST.secs.find(x=>x.g);
  $('#report').innerHTML=`<div class="rep" id="repEl"><div class="rep-h"><img src="img/chatty.png" alt=""><div class="t"><b>LINGO PLANET</b><small>DIAA MAGDY · English Courses</small></div><div style="margin-inline-start:auto;text-align:end;font-weight:800"><div style="font-family:Fredoka;font-size:20px;color:#0C6115">Test Result</div>Pre A1 · ${esc(LAST.label)}</div></div>
   <table><tr><th>Student</th><td>${esc(PROFILE.name)}</td><th>Date</th><td>${LAST.date.toLocaleDateString('en-GB')} ${LAST.date.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}</td></tr><tr><th>Email</th><td>${esc(PROFILE.email)}</td><th>Total</th><td style="font-weight:900;font-size:18px;color:${LAST.pass?'#17a34a':'#e0384b'}">${LAST.pc}% — ${LAST.pass?'PASSED':'NOT PASSED'}</td></tr></table>
   <table><tr><th>Section</th><th>Score</th></tr>${LAST.secs.map(x=>`<tr><td>${x.s.icon} ${x.s.title}</td><td><b>${x.got} / ${x.tot}</b></td></tr>`).join('')}</table>
   <h3 style="font-family:Fredoka;color:#0C6115;margin:16px 0 6px">Writing</h3><div style="border:1px solid #d6e6c8;border-radius:10px;padding:10px;font-size:14px;line-height:1.6;white-space:pre-wrap">${esc(LAST.essay)||'—'}</div>
   <table>${Wg.g.crit.map(c=>`<tr><td style="width:34%">${c[0]} ${c[1]}</td><td style="width:12%"><b>${c[2]}/${c[3]}</b></td><td class="ar" style="font-size:12.5px">${c[4]}</td></tr>`).join('')}</table>
   ${LAST.secs.some(x=>x.rev&&x.rev.length)?`<h3 style="font-family:Fredoka;color:#0C6115;margin:16px 0 6px">Mistakes</h3><table><tr><th>Question</th><th>Answer</th><th>Correct</th></tr>${LAST.secs.filter(x=>x.rev).flatMap(x=>x.rev).map(r=>`<tr><td>${esc(r.q)}</td><td style="color:#e0384b">${esc(r.your)}</td><td style="color:#17a34a">${esc(r.right)}</td></tr>`).join('')}</table>`:''}
   <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:26px"><div style="font-size:12px;color:#5d7366">Automatic marking · reviewed by the teacher</div><div style="text-align:center"><div class="sig">Diaa Magdy</div><div style="border-top:2px solid #0A2116;font-weight:800;font-size:13px;padding-top:3px">Teacher & CEO · Diaa Magdy</div></div></div></div>`;
  toPDF($('#repEl'),`LingoPlanet_${LAST.key}_${PROFILE.name.replace(/\s+/g,'_')}.pdf`).finally(()=>{b.disabled=false;b.textContent='📄 Download PDF';});}

/* ================= FINAL EXAM ================= */
function vFinal(){
  loadSprite(8);
  const done7=UNIT_LIST.every(n=>{const b=testBest(n);return b!==null&&b>=UNITS[n].test.pass;});
  if(!done7&&!isAdmin()){toast('🔒 انجح في كل الوحدات الأول');return vHome();}
  app.innerHTML=topBar(true)+`<main class="wrapc"><div class="sec"><div class="sec-h"><div class="ic">🎯</div><div><h2>Final Level Exam · Pre A1</h2><div class="ar">الاختبار النهائي الشامل — Listening · Vocabulary · Grammar · Reading · Writing</div></div></div>
   <div class="test-start"><h2 class="fred" style="margin:0;font-size:26px">Are you ready? 🎓</h2><div class="ar" style="color:#d6f0c6;font-weight:700;margin-top:4px">لو جبت ${FINAL.pass}% أو أكتر هتطلعلك شهادة اجتياز المستوى PDF باسمك.</div>
    <ul>${FINAL.sections.map(s=>`<li>${s.icon} ${s.title}</li>`).join('')}</ul>${PROFILE.final?`<div style="font-weight:900;margin-bottom:10px">🏅 Best: ${PROFILE.final.best}%</div>`:''}
    <button class="btn b-lime" style="font-size:17px" onclick="testRender('#finalArea',FINAL,'final','Final Level Exam')">▶ Start</button><img class="ch" src="img/chatty.png" alt=""></div><div id="finalArea"></div></div></main>`;
}

/* ================= CERTIFICATE ================= */
function certHTML(name,score,date,id){
  return `<div class="cert" id="certEl"><div class="c1"></div><div class="c2"></div><div class="frame"></div><div class="frame2"></div><img class="chat" src="img/chatty.png" alt="">
   <div class="in"><div class="lg"><img src="img/icon-192.png" style="border-radius:18px" alt=""><div><b>LINGO PLANET</b><small>DIAA MAGDY · ENGLISH COURSES</small></div></div>
    <h1>CERTIFICATE</h1><div class="of">OF ACHIEVEMENT</div><div class="pr">This certificate is proudly presented to</div><div class="nm">${esc(name)}</div>
    <div class="tx">for successfully completing <b>Pre A1 – Beginner Level</b> and passing the final level exam in Listening, Vocabulary, Grammar, Reading and Writing with a score of <b>${score}</b>.</div>
    <div class="foot"><div class="fcol"><div style="font-size:18px">${date}</div><div class="ln">Date</div></div><div class="seal">PRE A1<br>PASSED<br>★★★</div><div class="fcol"><div class="sig">Diaa Magdy</div><div class="ln">Teacher & CEO<br>Diaa Magdy</div></div></div>
    <div style="position:absolute;bottom:-34px;left:0;right:0;font-size:11px;color:#5d7366;font-weight:700">Certificate ID: ${id}</div></div></div>`;}
function vCert(){
  const f=PROFILE.final;const ok=f&&f.best>=FINAL.pass;
  if(!ok&&!isAdmin()){toast('🎓 الشهادة بعد النجاح في الاختبار النهائي');return vHome();}
  const d=new Date(ok?f.date:Date.now()).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});const id='LP-PA1-'+(Math.abs([...(PROFILE.email||'x')].reduce((a,c)=>a*31+c.charCodeAt(0)|0,7))%900000+100000);const score=ok?f.best+'%':'— % (sample)';
  app.innerHTML=topBar(true)+`<main class="wrapc"><div class="sec"><div class="sec-h"><div class="ic">🎓</div><div><h2>Level Certificate</h2><div class="ar">${ok?'مبروك! نزّل شهادتك PDF':'معاينة للمعلم — الطالب بيشوفها بعد النجاح'}</div></div></div>
   <div class="certwrap" id="cw"><div class="certprev" id="cp">${certHTML(PROFILE.name,score,d,id)}</div></div>
   <div class="row" style="justify-content:center;margin-top:16px"><button class="btn b-g" id="cdl">📄 Download PDF</button></div></div></main>`;
  const fit=()=>{const w=$('#cw');if(!w)return;const s=Math.min(1,w.clientWidth/1123);$('#cp').style.transform=`scale(${s})`;w.style.height=(794*s)+'px';};fit();addEventListener('resize',fit);
  $('#cdl').onclick=()=>{$('#certBox').innerHTML=certHTML(PROFILE.name,score,d,id);const b=$('#cdl');b.disabled=true;toPDF($('#certBox #certEl'),`LingoPlanet_PreA1_Certificate_${PROFILE.name.replace(/\s+/g,'_')}.pdf`,true).finally(()=>b.disabled=false);};
  if(ok) speakNow('Congratulations! You did it!');
}

/* ================= speech inventory (used to pre-record voices) ================= */
function collectSpeech(){
  const out=new Map();let cu=0;const add=(t,v)=>{t=speechText(t||'');if(!t)return;v=typeof v==='string'?v:'f';const k=audioKey(t,v);const id=cu+'|'+k;if(!out.has(id))out.set(id,{t,v,k,u:cu});};
  const words=s=>{(plain(s).match(/[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ']*|\d+/g)||[]).forEach(w=>add(/^\d+$/.test(w)?w:w.replace(/'+$/,'')));};
  const both=s=>{add(s);words(s);};
  for(let i=1;i<=100;i++){add(nWord(i));}
  ["Hi! I'm Chatty. Let's learn English together!",'Great job!','Try again!','Congratulations! You passed!','Good try! Practice and try again.','Congratulations! You did it!','blank'].forEach(add);
  UNIT_LIST.forEach(n=>{cu=n;const u=UNITS[n];add(`Welcome to unit ${n}! Tap any word to hear it.`);
    u.videos.forEach(v=>{v.lines.forEach(L=>{add(L[1],VOICE[v.sp[L[0]].g]);words(L[1]);});v.quiz.forEach(q=>{both(q.q);q.o.forEach(words);});});
    u.vocab.forEach(g=>g.items.forEach(([e,w,s])=>{add(w);both(s);}));
    u.talk.forEach(t=>t.list.forEach(q=>{both(q[0]);both(q[2]);}));
    u.grammar.blocks.forEach(b=>{if(b.en)words(b.en);(b.items||[]).forEach(x=>{if(x.eg)x.eg.forEach(both);if(Array.isArray(x)){if(b.type==='list')both(x);else{x.forEach(y=>typeof y==='string'&&/[a-z]{2}/i.test(y)&&!/[؀-ۿ]/.test(y)&&words(y));if(x[2]&&!/[؀-ۿ]/.test(x[2]))add(x[2]);if(b.type==='clocks')add(x[1]);}}});
      (b.rows||[]).forEach(r=>{add(r.filter(c=>/[a-z]{2}/i.test(c)).join('. '));r.forEach(words);});(b.parts||[]).forEach(p=>words(p[0]));});
    u.exercises.forEach(x=>{x.items.forEach(it=>{if(x.type==='ord'){add(ordSentence(it));it.c.forEach(words);}else{both(plain(it.q));it.o.forEach(words);if(x.speak&&/_{2,}/.test(it.q))add(plain(it.q.replace(/_{2,}/,it.o[it.a]).replace(/ \(.*\)$/,'').replace(/ — .*$/,'')));}});});
    if(u.numbers)[13,50,18,46,72,19,89,100].forEach(k=>add(nWord(k)));
    u.reading.lines.forEach(l=>{add(l[0],VOICE[u.reading.g]||'f');words(l[0]);});u.reading.keys.forEach(k=>add(k[1]));u.reading.quiz.forEach(q=>{both(q.q);q.o.forEach(words);});
    u.sounds.groups.forEach(g=>g.forEach&&g[4].forEach(x=>add(x[1])));u.sounds.quiz.items.forEach(i=>add(i[1]));words(u.sounds.tip[0]);
    u.games.pairs.forEach(p=>add(p[1]));u.games.spell.forEach(p=>add(p[1]));u.games.speed.forEach(p=>words(p[0]));
    [u.test].forEach(T0=>T0.sections.forEach(s=>{if(s.passage){add(s.passage.join(' '));s.passage.forEach(words);}(s.qs||[]).forEach(q=>{if(s.listen)add(q.audio,VOICE[q.g]);else{add(q.say||q.q);words(q.q);}q.o.forEach(words);});if(s.writing)words(s.prompt);}));
  });cu=8;[FINAL].forEach(T0=>T0.sections.forEach(s=>{if(s.passage){add(s.passage.join(' '));s.passage.forEach(words);}(s.qs||[]).forEach(q=>{if(s.listen)add(q.audio,VOICE[q.g]);else{add(q.say||q.q);words(q.q);}q.o.forEach(words);});if(s.writing)words(s.prompt);}));
  return [...out.values()];
}

/* ---------- start ---------- */
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal();});
API.init(render);
try{if('serviceWorker' in navigator&&location.protocol==='https:'&&!/claude/.test(location.hostname))navigator.serviceWorker.register('sw.js');}catch(e){}
