// Helpers
const $ = sel => document.querySelector(sel);
const params = new URLSearchParams(location.search);
function setActive(container, attr, value){
  container.querySelectorAll('button').forEach(b=>{
    b.classList.toggle('active', b.getAttribute(attr)===value);
  });
}

// Landing page logic
function initLanding(){
  const langRow = $('#langRow');
  const sideRow = $('#sideRow');
  const startBtn = $('#startBtn');
  const hint = $('#hint');
  const chooseSideTitle = $('#chooseSideTitle');

  let lang = null; // 'en' | 'jp'
  let side = null; // 'bride' | 'groom'

  // click handlers
  langRow.addEventListener('click', e=>{
    const b = e.target.closest('button[data-lang]'); if(!b) return;
    lang = b.dataset.lang;
    setActive(langRow,'data-lang',lang);
    // live translate the side title + UI hints
    chooseSideTitle.textContent = LANG[lang].chooseSideTitle;
    startBtn.textContent = LANG[lang].start;
    hint.textContent = LANG[lang].pickHint;
    updateStart();
  });

  sideRow.addEventListener('click', e=>{
    const b = e.target.closest('button[data-side]'); if(!b) return;
    side = b.dataset.side;
    setActive(sideRow,'data-side',side);
    updateStart();
  });

  function updateStart(){
    const ready = !!(lang && side);
    startBtn.disabled = !ready;
    if(!lang){ hint.textContent = 'Pick a language / 言語を選択'; }
    else if(!side){ hint.textContent = LANG[lang].chooseSideTitle; }
    else { hint.textContent = ''; }
  }

  startBtn.addEventListener('click', ()=>{
    if(!(lang && side)) return;
    // go to quiz with URL params (no backend needed)
    location.href = `quiz.html?lang=${lang}&side=${side}`;
  });
}

// Quiz levels page logic (scaffold)
function initQuiz(){
  const lang = params.get('lang') || 'en';
  const side = params.get('side') || 'bride';
  const t = LANG[lang] || LANG.en;

  $('#quizTitle').textContent = t.titleQuiz(side);
  $('#quizSubtitle').textContent = t.subtitleQuiz(lang, side);
  $('#levelsTitle').textContent = t.levelsTitle;
  $('#levelsHelp').textContent = t.levelsHelp;

  const levelNames = t.levelNames;
  const grid = $('#levelsGrid');

  // For Step 1, only Easy is unlocked. We'll wire real progression next.
  const unlocked = [true, false, false, false];

  grid.innerHTML = '';
  levelNames.forEach((name, idx)=>{
    const card = document.createElement('div');
    card.className = 'level-card';
    card.innerHTML = `
      <h3>${name}</h3>
      <div class="row">
        ${unlocked[idx]
          ? `<button class="btn start" data-level="${idx}">${t.startLevel}</button>`
          : `<span class="lock">🔒 ${t.locked}</span>`
        }
      </div>
    `;
    grid.appendChild(card);
  });

  grid.addEventListener('click', async (e)=>{
    const btn = e.target.closest('button.start'); if(!btn) return;
    const level = Number(btn.dataset.level);

    // Step 1 placeholder: we’ll load quizzes/* JSON & run the engine in Step 2
    alert(`${t.levelNames[level]} — coming next!`);

    // (Preview of next step)
    // const file = `${side}_${lang}.json`; // e.g., bride_en.json
    // const data = await fetch(`quizzes/${file}`).then(r=>r.json());
    // startQuiz(data.levels[level], {lang, side, level});
  });

  $('#backBtn').textContent = t.back;
  $('#backBtn').addEventListener('click', ()=> history.back());
}

// boot
document.addEventListener('DOMContentLoaded', ()=>{
  const page = document.body.dataset.page;
  if(page === 'landing') initLanding();
  if(page === 'quiz') initQuiz();
});
