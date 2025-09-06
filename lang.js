// All interface strings live here so you can tweak wording easily.
const LANG = {
  en: {
    chooseSideTitle: "Choose your side",
    start: "Start",
    pickHint: "Pick a language and a side first.",
    titleQuiz: side => side==="bride" ? "Bride Quiz 💖" : "Groom Quiz 🤵",
    subtitleQuiz: (lang,side) => `${side==="bride"?"Bride":"Groom"} · ${lang==="en"?"English":"日本語"}`,
    levelsTitle: "Levels",
    levelsHelp: "Clear each level to unlock the next. Super Hard shows a prize screen!",
    levelNames: ["Easy","Middle","Hard","Super Hard"],
    locked: "Locked",
    startLevel: "Start",
    back: "Back"
  },
  jp: {
    chooseSideTitle: "新郎新婦を選択",
    start: "スタート",
    pickHint: "言語と新郎/新婦を選んでください。",
    titleQuiz: side => side==="bride" ? "新婦クイズ 💖" : "新郎クイズ 🤵",
    subtitleQuiz: (lang,side) => `${side==="bride"?"新婦":"新郎"} · ${lang==="en"?"English":"日本語"}`,
    levelsTitle: "レベル",
    levelsHelp: "各レベルをクリアすると次が解放されます。最難関クリアで賞品画面！",
    levelNames: ["かんたん","ふつう","むずかしい","超むずかしい"],
    locked: "ロック中",
    startLevel: "開始",
    back: "戻る"
  }
};
