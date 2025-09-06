// helpers
const $ = s => document.querySelector(s);
const params = new URLSearchParams(location.search);
const STORAGE_KEY = (side,lang)=>`wq_progress_${side}_${lang}`;

// config
const QUESTIONS_PER_LEVEL = 3;
const PASS_NEEDED = 2; // need >=2 correct out of 3

/* ---------------- LANDING ---------------- */
function initLanding(){
  const langRow = $('#langRow');
  const sideRow = $('#sideRow');
  const startBtn = $('#startBtn');
  const hint = $('#hint');
  const chooseSideTitle = $('#chooseSideTitle');

  let lang=null, side=null;

  langRow.addEventListener('click', e=>{
    const b = e.target.closest('button[data-lang]'); if(!b) return;
    lang = b.dataset.lang;
    langRow.querySelectorAll('button').forEach(x=>x.classList.toggle('active', x===b));
    chooseSideTitle.textContent = LANG[lang].chooseSideTitle;
    startBtn.textContent = LANG[lang].start;
    hint.textContent = LANG[lang].pickHint;
    update();
  });

  sideRow.addEventListener('click', e=>{
    const b = e.target.closest('button[data-side]'); if(!b) return;
    side = b.dataset.side;
    sideRow.querySelectorAll('button').forEach(x=>x.classList.toggle('active', x===b));
    update();
  });

  function update(){
    startBtn.disabled = !(lang && side);
    if(!lang) hint.textContent = 'Pick a language / 言語を選択';
    else if(!side) hint.textContent = LANG[lang].chooseSideTitle;
    else hint.textContent = '';
  }

  startBtn.addEventListener('click', ()=>{
    if(!(lang&&side)) return;
    location.href = `quiz.html?lang=${lang}&side=${side}`;
  });
}

/* ---------------- QUIZ (levels + runner) ---------------- */
async function initQuiz(){
  const lang = params.get('lang') || 'en';
  const side = params.get('side') || 'bride';
  const t = LANG[lang] || LANG.en;

  $('#quizTitle').textContent = t.titleQuiz(side);
  $('#quizSubtitle').textContent = t.subtitleQuiz(lang, side);
  $('#levelsTitle').textContent = t.levelsTitle;
  $('#levelsHelp').textContent = t.levelsHelp;
  $('#backBtn').textContent = t.back;

  const file = `quizzes/${side}_${lang}.json`;
  let quizData;
  try{
    quizData = await fetch(file).then(r=>r.json());
  }catch(_){
    quizData = {levels:[]};
  }

  ensureDemoQuestions(quizData, lang); // placeholder questions so you can test

  const prog = loadProgress(side,lang, quizData.levels.length);
  renderLevels(quizData, prog, t, side, lang);

  $('#backBtn').addEventListener('click', ()=> history.back());
}

function ensureDemoQuestions(data, lang){
  const demo = (q,a0,a1,a2,ans)=>({ q, choices:[a0,a1,a2], answer:ans });
  const fallback = {
    en: [
      demo("Which color is on our invite?", "Yellow", "Blue", "Green", 0),
      demo("What time is the party?", "11:00", "12:30", "15:00", 1),
      demo("Where do we say ‘thank you’?", "Everywhere!", "Only at the end", "Nowhere", 0)
    ],
    jp: [
      demo("招待状の色は？", "黄色", "青", "緑", 0),
      demo("パーティ開始は？", "11:00", "12:30", "15:00", 1),
      demo("『ありがとう』はどこで言う？", "どこでも！", "最後だけ", "言わない", 0)
    ]
  };
  if(!data.levels || !data.levels.length){
    data.levels = [
      {name:"Easy", questions:[...fallback[lang]]},
      {name:"Middle", questions:[...fallback[lang]]},
      {name:"Hard", questions:[...fallback[lang]]},
      {name:"Super Hard", questions:[...fallback[lang]]}
    ];
  }else{
    data.levels.forEach(l=>{
      if(!l.questions || l.questions.length===0){
        l.questions = [...fallback[lang]];
      }
    });
  }
}

function loadProgress(side,lang, nLevels){
  const raw = localStorage.getItem(STORAGE_KEY(side,lang));
  const base = { cleared:Array(nLevels).fill(false) };
  if(!raw) return base;
  try{
    const o = JSON.parse(raw);
    if(!o.cleared || o.cleared.length!==nLevels) return base;
    return o;
  }catch{ return base; }
}
function saveProgress(side,lang, prog){
  localStorage.setItem(STORAGE_KEY(side,lang), JSON.stringify(prog));
}

function renderLevels(quizData, prog, t, side, lang){
  const grid = $('#levelsGrid');
  const names = t.levelNames;
  grid.innerHTML = '';
  const unlocked = quizData.levels.map((_,i)=> i===0 || prog.cleared[i-1]);

  quizData.levels.forEach((lvl, i)=>{
    const card = document.createElement('div');
    card.className = 'level-card';
    const title = names[i] || lvl.name || `Level ${i+1}`;
    const cleared = !!prog.cleared[i];

    card.innerHTML = `
      <h3>${title} ${cleared? '✅' : ''}</h3>
      <div class="row">
        ${
          unlocked[i]
            ? `<button class="btn start" data-i="${i}">${t.startLevel}</button>`
            : `<span class="lock">🔒 ${t.locked}</span>`
        }
      </div>
    `;
    grid.appendChild(card);
  });

  grid.onclick = e=>{
    const btn = e.target.closest('button.start'); if(!btn) return;
    const i = Number(btn.dataset.i);
    startLevel(i, quizData.levels[i], {side,lang}, t, prog, quizData);
  };
}

/* ---------------- RUN A LEVEL ---------------- */
function startLevel(i, levelData, ctx, t, prog, quizData){
  $('#prize').style.display='none';
  const runner = $('#runner');
  runner.style.display='block';

  const qCounter = $('#qCounter');
  const qLevelName = $('#qLevelName');
  const qText = $('#qText');
  const qChoices = $('#qChoices');
  const submitBtn = $('#submitBtn');
  const skipBtn = $('#skipBtn');
  const qResult = $('#qResult');

  let idx = 0;
  let correct = 0;
  const total = Math.min(QUESTIONS_PER_LEVEL, levelData.questions.length);

  qLevelName.textContent = (t.levelNames[i] || levelData.name);

  function render(){
    const item = levelData.questions[idx];
    qCounter.textContent = t.questionOf(idx+1, total);
    qText.textContent = item.q;
    qChoices.innerHTML = '';
    item.choices.forEach((c,ci)=>{
      const b = document.createElement('button');
      b.type='button';
      b.className='choice';
      b.textContent=c;
      b.onclick = ()=>{
        qChoices.querySelectorAll('.choice').forEach(x=>x.classList.remove('selected'));
        b.classList.add('selected');
      };
      qChoices.appendChild(b);
    });
    submitBtn.textContent = (idx===total-1)? t.submit : t.next;
    skipBtn.textContent = t.backToLevels;
    qResult.style.display='none';
  }

  submitBtn.onclick = ()=>{
    const picked = Array.from(qChoices.children).find(x=>x.classList.contains('selected'));
    if(!picked){ alert(t.selectChoice); return; }
    const sel = Array.from(qChoices.children).indexOf(picked);
    if(sel === levelData.questions[idx].answer) correct++;

    idx++;
    if(idx>=total){
      const passed = correct >= PASS_NEEDED;
      qResult.style.display='block';
      qResult.textContent = passed ? t.resultPass : t.resultFail;

      submitBtn.onclick = ()=>{
        runner.style.display='none';
        if(passed){
          prog.cleared[i] = true;
          saveProgress(ctx.side, ctx.lang, prog);

          const last = (i === quizData.levels.length-1);
          renderLevels(quizData, prog, t, ctx.side, ctx.lang);
          if(last){
            showPrize(t);
          }
        }
      };
      submitBtn.textContent = t.backToLevels;
      skipBtn.style.display='none';
    }else{
      render();
    }
  };

  skipBtn.onclick = ()=>{ runner.style.display='none'; };
  render();
}

function showPrize(t){
  const box = $('#prize');
  $('#prizeTitle').textContent = t.prizeTitle;
  $('#prizeLine1').textContent = t.prizeLine1;
  $('#prizeLine2').textContent = t.prizeLine2;
  box.style.display = 'block';
}

/* ---------------- BOOT ---------------- */
document.addEventListener('DOMContentLoaded', ()=>{
  const page = document.body.dataset.page;
  if(page==='landing') initLanding();
  if(page==='quiz') initQuiz();
});
