// UI strings in English & Japanese
const LANG = {
  en: {
    chooseSideTitle: "Choose your side",
    start: "Start",
    pickHint: "Pick a language and a side first.",
    titleQuiz: side => side==="bride" ? "Bride Quiz 💖" : "Groom Quiz 🤵",
    subtitleQuiz: (lang,side) => `${side==="bride"?"Bride":"Groom"} · English`,
    levelsTitle: "Levels",
    levelsHelp: "Clear each level to unlock the next. Super Hard shows a prize screen!",
    levelNames: ["Easy","Middle","Hard","Super Hard"],
    locked: "Locked",
    startLevel: "Start",
    back: "Back",

    // runner
    questionOf: (i,total)=>`Question ${i} / ${total}`,
    selectChoice: "Choose an answer:",
    submit: "Submit",
    next: "Next",
    resultPass: "You passed this level! 🎉",
    resultFail: "Keep trying! You can retry this level.",
    tryAgain: "Try again",
    backToLevels: "Back to levels",

    // prize
    prizeTitle: "✨ YOU CLEARED SUPER HARD ✨",
    prizeLine1: "Show this screen at reception to claim your prize.",
    prizeLine2: "Congrats!!"
  },
  jp: {
    chooseSideTitle: "新郎新婦を選択",
    start: "スタート",
    pickHint: "言語と新郎/新婦を選んでください。",
    titleQuiz: side => side==="bride" ? "新婦クイズ 💖" : "新郎クイズ 🤵",
    subtitleQuiz: (lang,side) => `${side==="bride"?"新婦":"新郎"} · 日本語`,
    levelsTitle: "レベル",
    levelsHelp: "各レベルをクリアすると次が解放されます。最難関クリアで賞品画面！",
    levelNames: ["かんたん","ふつう","むずかしい","超むずかしい"],
    locked: "ロック中",
    startLevel: "開始",
    back: "戻る",

    // runner
    questionOf: (i,total)=>`問題 ${i} / ${total}`,
    selectChoice: "答えを選んでください：",
    submit: "送信",
    next: "次へ",
    resultPass: "クリア！🎉",
    resultFail: "もう一度チャレンジ！",
    tryAgain: "やり直す",
    backToLevels: "レベルに戻る",

    // prize
    prizeTitle: "✨ 最難関クリア ✨",
    prizeLine1: "受付でこの画面を見せて景品を受け取ってください。",
    prizeLine2: "おめでとう！"
  }
};
