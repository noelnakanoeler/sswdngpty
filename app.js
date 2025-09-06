// ====== Simple i18n strings for UI labels ======
const UI = {
  en: {
    siteTitle: "Wedding Quiz",
    siteTag: "Choose Bride or Groom · 日本語 / English",
    langTitle: "✨ Language / 言語",
    startTitle: "✨ Start",
    startHelp: "Pick a side and your language.",
    level: "Level",
    mistakes: "Mistakes",
    next: "Next",
    result: "🎀 Result",
    prize: "You cleared all levels! 🎉 Show this screen for your prize!",
    fail: "Too many mistakes 💔 Please try again.",
    restart: "Restart",
    bride: "Bride",
    groom: "Groom",
    coming: "Coming soon ✦",
    levelNames: { easy:"Easy", medium:"Medium", hard:"Hard", superhard:"Super Hard" },
  },
  ja: {
    siteTitle: "ウェディングクイズ",
    siteTag: "花嫁・花婿を選んでください · English / 日本語",
    langTitle: "✨ 言語 / Language",
    startTitle: "✨ スタート",
    startHelp: "どちらのクイズに挑戦しますか？ 言語も選べます。",
    level: "レベル",
    mistakes: "ミス",
    next: "次へ",
    result: "🎀 結果",
    prize: "全レベルクリア！🎉 この画面を受付に見せてください。",
    fail: "ミスが多すぎます 💔 もう一度お試しください。",
    restart: "リスタート",
    bride: "花嫁",
    groom: "花婿",
    coming: "近日追加 ✦",
    levelNames: { easy:"かんたん", medium:"ふつう", hard:"むずかしい", superhard:"超むずかしい" },
  }
};

// ====== State ======
let DATA = null;
let lang = 'en';
let side = null; // 'bride' | 'groom'
const levels = ['easy','medium','hard','superhard'];
let levelIndex = 0;
let qIndex = 0;
let mistakes = 0;
const MAX_MISTAKES = 5;

// ====== Elements ======
const quizArea = document.getElementById('quizArea');
const resultArea = document.getElementById('resultArea');
const questionText = document.getElementById('questionText');
const answersBox = document.getElementById('answers');
const levelBadge = document.getElementById('levelBadge');
const mistakesBadge = document.getElementById('mistakesBadge');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');

const siteTitle = document.getElementById('siteTitle');
const siteTag = document.getElementById('siteTag');
const langTitle = document.getElementById('langTitle');
const startTitle= document.getElementById('startTitle');
const startHelp = document.getElementById('startHelp');
const resultTitle = document.getElementById('resultTitle');

const btnBride = document.getElementById('btnBride');
const btnGroom = document.getElementById('btnGroom');

// ====== Language toggle ======
document.querySelectorAll('.lang-toggle .btn').forEach(b=>{
  b.addEventListener('click', async ()=>{
    lang = b.getAttribute('data-lang') || 'en';
    await loadData();
    applyUILabels();
    if (side) render();
  });
});

// ====== Start buttons ======
btnBride.addEventListener('click', async ()=>{
  side = 'bride';
  await ensureDataThenStart();
});
btnGroom.addEventListener('click', async ()=>{
  side = 'groom';
  await ensureDataThenStart();
});

restartBtn.addEventListener('click', ()=>{
  resultArea.style.display = 'none';
  quizArea.style.display = 'none';
  side = null;
});

// ====== Data loading ======
async function loadData(){
  const file = `questions_${lang}.json`;
  const res = await fetch(file);
  if (!res.ok){
    console.error(`Failed to load ${file}`);
    return;
  }
  DATA = await res.json();
}

async function ensureDataThenStart(){
  if (!DATA) await loadData();
  levelIndex = 0; qIndex = 0; mistakes = 0;
  resultArea.style.display = 'none';
  quizArea.style.display = 'block';
  render();
}

// ====== UI labels ======
function applyUILabels(){
  const L = UI[lang] || UI.en;
  siteTitle.textContent = L.siteTitle;
  siteTag.textContent = L.siteTag;
  langTitle.textContent = L.langTitle;
  startTitle.textContent= L.startTitle;
  startHelp.textContent = L.startHelp;
  resultTitle.textContent = L.result;

  btnBride.textContent = L.bride;
  btnGroom.textContent = L.groom;
  nextBtn.textContent = L.next;

  // level + mistakes badges update during render()
}

// ====== Render ======
function getCurrentList(){
  const key = levels[levelIndex];
  return DATA?.[side]?.[key] || [];
}

function render(){
  const L = UI[lang] || UI.en;
  const levelKey = levels[levelIndex];
  const list = getCurrentList();

  levelBadge.textContent = `${L.level}: ${L.levelNames[levelKey]}`;
  mistakesBadge.textContent = `${L.mistakes}: ${mistakes} / ${MAX_MISTAKES}`;

  if (!list.length){
    questionText.textContent = 'No questions found.';
    answersBox.innerHTML = '';
    nextBtn.disabled = true;
    return;
  }

  const q = list[qIndex];
  questionText.textContent = q.q;
  answersBox.innerHTML = '';
  nextBtn.disabled = true;

  if (q.placeholder){
    const p = document.createElement('p');
    p.textContent = L.coming;
    answersBox.appendChild(p);
    nextBtn.disabled = false; // allow moving past placeholders
    return;
  }

  q.a.forEach((text, i)=>{
    const div = document.createElement('div');
    div.className = 'answer';
    div.textContent = text;
    div.addEventListener('click', ()=>{
      answersBox.querySelectorAll('.answer').forEach(a=>a.classList.remove('selected'));
      div.classList.add('selected');
      nextBtn.disabled = false;

      if (i !== q.correct){
        mistakes++;
        mistakesBadge.textContent = `${L.mistakes}: ${mistakes} / ${MAX_MISTAKES}`;
        if (mistakes >= MAX_MISTAKES) end(false);
      }
    });
    answersBox.appendChild(div);
  });
}

nextBtn.addEventListener('click', ()=>{
  const list = getCurrentList();
  qIndex++;
  if (qIndex >= list.length){
    // next level
    levelIndex++;
    if (levelIndex >= levels.length){
      end(true);
      return;
    }
    qIndex = 0;
  }
  render();
});

function end(success){
  const L = UI[lang] || UI.en;
  quizArea.style.display = 'none';
  resultArea.style.display = 'block';
  document.getElementById('resultText').textContent =
    success ? L.prize : L.fail;
}

// initial load
(async function init(){
  await loadData();
  applyUILabels();
})();
