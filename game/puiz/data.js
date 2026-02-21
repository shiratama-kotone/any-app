// ============================================================
//  quiz-data.js — クイズデータファイル
//  quiz-creator.html で編集・エクスポートできます
// ============================================================

const quizzes = [
  {
    id: "general",
    title: "一般常識検定",
    description: "日本と世界に関する一般常識クイズです。",
    icon: "📚",
    color: "#4f9eff",
    questions: [
      {
        id: 1,
        type: "single",
        question: "日本の首都はどこですか？",
        choices: ["大阪", "東京", "京都", "名古屋"],
        answer: 1,
        explanation: "日本の首都は東京です。",
        score: 10
      },
      {
        id: 2,
        type: "single",
        question: "世界で最も面積が大きい国はどこですか？",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Flag_of_Russia.svg/320px-Flag_of_Russia.svg.png",
        choices: ["アメリカ", "中国", "カナダ", "ロシア"],
        answer: 3,
        explanation: "ロシアは約1,710万km²で世界最大です。",
        score: 10
      },
      {
        id: 3,
        type: "multiple",
        question: "次のうち、哺乳類をすべて選んでください。（複数選択）",
        choices: ["イルカ", "サメ", "クジラ", "マグロ", "アザラシ"],
        answer: [0, 2, 4],
        explanation: "イルカ、クジラ、アザラシは哺乳類です。",
        score: 15
      },
      {
        id: 4,
        type: "input",
        question: "日本で最も高い山の名前を入力してください。",
        answer: ["富士山", "ふじさん", "Mt.Fuji", "Fuji"],
        caseSensitive: false,
        explanation: "日本最高峰は富士山（標高3,776m）です。",
        score: 20
      }
    ]
  },
  {
    id: "science",
    title: "理科・サイエンス検定",
    description: "自然科学に関する問題です。",
    icon: "🔬",
    color: "#22c55e",
    questions: [
      {
        id: 1,
        type: "single",
        question: "水（H₂O）の沸点は何℃ですか？（1気圧）",
        choices: ["90℃", "95℃", "100℃", "110℃"],
        answer: 2,
        explanation: "水は1気圧で100℃で沸騰します。",
        score: 10
      },
      {
        id: 2,
        type: "input",
        question: "元素記号「Fe」は何の元素ですか？（カタカナで答えてください）",
        answer: ["鉄", "テツ", "てつ"],
        caseSensitive: false,
        explanation: "Feは鉄（Iron）の元素記号です。",
        score: 15
      },
      {
        id: 3,
        type: "multiple",
        question: "次のうち、惑星をすべて選んでください。",
        choices: ["地球", "月", "火星", "太陽", "金星", "冥王星"],
        answer: [0, 2, 4],
        explanation: "地球、火星、金星が惑星です。月は衛星、太陽は恒星、冥王星は準惑星です。",
        score: 20
      }
    ]
  },
  {
    id: "animals",
    title: "動物クイズ",
    description: "動物に関する知識を問います。",
    icon: "🐾",
    color: "#f97316",
    questions: [
      {
        id: 1,
        type: "single",
        question: "この動物は何ですか？",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/320px-Cat03.jpg",
        choices: ["犬", "猫", "うさぎ", "ハムスター"],
        answer: 1,
        explanation: "猫（ネコ）です。",
        score: 10
      },
      {
        id: 2,
        type: "input",
        question: "地球上で最も大きい動物の名前を答えてください。",
        answer: ["シロナガスクジラ", "しろながすくじら", "シロナガス鯨", "ブルーホエール"],
        caseSensitive: false,
        explanation: "シロナガスクジラ（体長約30m）が最大です。",
        score: 15
      }
    ]
  }
];
