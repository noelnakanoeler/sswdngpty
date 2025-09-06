// UI strings in English & Japanese
const LANG = {
  en: {
    chooseSideTitle: "Choose your side",
    start: "Start",
    pickHint: "Pick a language and a side first.",
    titleQuiz: side => (side==="bride" ? "Bride Quiz / 新婦クイズ 💖" : "Groom Quiz / 新郎クイズ 🤵"),
    subtitleQuiz: () => `English / 英語`,
    levelsTitle: "Levels",
    levelsHelp: "Clear each level to unlock the next. You may make at most 5 mistakes total.",
    levelNames: ["Easy","Middle","Hard","Super Hard"],
    locked: "Locked",
    startLevel: "Start",
    back: "Back",
    mistakesLeft: n => `Mistakes left: ${n}`,
    // runner
    questionOf: (i,total)=>`Question ${i} / ${total}`,
    selectChoice: "Choose an answer:",
    submit: "Submit",
    next: "Next",
    resultPass: "You passed this level! 🎉",
    resultFail: "Keep trying! You can retry this level.",
    backToLevels: "Back to levels",
    // prize
    prizeTitle: "✨ YOU CLEARED SUPER HARD ✨",
    prizeLine1: "Show this screen at reception to claim your prize.",
    prizeLine2: "Congrats!!",
    // game over
    goLine1: "You reached 5 mistakes. The run is over.",
    goLine2: "Tap Restart to try again from Easy.",
    restart: "Restart"
  },
  jp: {
    chooseSideTitle: "新郎新婦を選択",
    start: "スタート",
    pickHint: "言語と新郎/新婦を選んでください。",
    titleQuiz: side => (side==="bride" ? "新婦クイズ / Bride Quiz 💖" : "新郎クイズ / Groom Quiz 🤵"),
    subtitleQuiz: () => `日本語 / Japanese`,
    levelsTitle: "レベル",
    levelsHelp: "各レベルをクリアすると次が解放。全体でミスは5回までです。",
    levelNames: ["かんたん","ふつう","むずかしい","超むずかしい"],
    locked: "ロック中",
    startLevel: "開始",
    back: "戻る",
    mistakesLeft: n => `残りミス：${n}`,
    // runner
    questionOf: (i,total)=>`問題 ${i} / ${total}`,
    selectChoice: "答えを選んでください：",
    submit: "送信",
    next: "次へ",
    resultPass: "クリア！🎉",
    resultFail: "もう一度チャレンジ！",
    backToLevels: "レベルに戻る",
    // prize
    prizeTitle: "✨ 最難関クリア ✨",
    prizeLine1: "受付でこの画面を見せて景品を受け取ってください。",
    prizeLine2: "おめでとう！",
    // game over
    goLine1: "ミスが5回に達しました。今回はここまでです。",
    goLine2: "「Restart」を押して最初から再挑戦してください。",
    restart: "Restart"
  }
};
