// ============================================================
//  data.js — クイズデータファイル
//  Generated: 2026/2/23 8:02:40
// ============================================================

const quizzes = [
  {
    "id": "general",
    "title": "一般常識検定",
    "description": "日本と世界に関する一般常識クイズです。",
    "icon": "📚",
    "color": "#4f9eff",
    "questions": [
      {
        "id": 1,
        "type": "single",
        "question": "日本の首都はどこですか？",
        "answer": 1,
        "explanation": "日本の首都は東京です。",
        "score": 10,
        "choices": [
          "大阪",
          "東京",
          "京都",
          "名古屋"
        ]
      },
      {
        "id": 2,
        "type": "single",
        "question": "世界で最も面積が大きい国はどこですか？",
        "answer": 3,
        "explanation": "ロシアは約1,710万km²で世界最大です。",
        "score": 10,
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Flag_of_Russia.svg/320px-Flag_of_Russia.svg.png",
        "choices": [
          "アメリカ",
          "中国",
          "カナダ",
          "ロシア"
        ]
      },
      {
        "id": 3,
        "type": "multiple",
        "question": "次のうち、哺乳類をすべて選んでください。（複数選択）",
        "answer": [
          0,
          2,
          4
        ],
        "explanation": "イルカ、クジラ、アザラシは哺乳類です。",
        "score": 15,
        "choices": [
          "イルカ",
          "サメ",
          "クジラ",
          "マグロ",
          "アザラシ"
        ]
      },
      {
        "id": 4,
        "type": "input",
        "question": "日本で最も高い山の名前を入力してください。",
        "answer": [
          "富士山",
          "ふじさん",
          "Mt.Fuji",
          "Fuji"
        ],
        "explanation": "日本最高峰は富士山（標高3,776m）です。",
        "score": 20,
        "caseSensitive": false
      }
    ]
  },
  {
    "id": "science",
    "title": "理科・サイエンス検定",
    "description": "自然科学に関する問題です。",
    "icon": "🔬",
    "color": "#22c55e",
    "questions": [
      {
        "id": 1,
        "type": "single",
        "question": "水（H₂O）の沸点は何℃ですか？（1気圧）",
        "answer": 2,
        "explanation": "水は1気圧で100℃で沸騰します。",
        "score": 10,
        "choices": [
          "90℃",
          "95℃",
          "100℃",
          "110℃"
        ]
      },
      {
        "id": 2,
        "type": "input",
        "question": "元素記号「Fe」は何の元素ですか？（カタカナで答えてください）",
        "answer": [
          "鉄",
          "テツ",
          "てつ"
        ],
        "explanation": "Feは鉄（Iron）の元素記号です。",
        "score": 15,
        "caseSensitive": false
      },
      {
        "id": 3,
        "type": "multiple",
        "question": "次のうち、惑星をすべて選んでください。",
        "answer": [
          0,
          2,
          4
        ],
        "explanation": "地球、火星、金星が惑星です。月は衛星、太陽は恒星、冥王星は準惑星です。",
        "score": 20,
        "choices": [
          "地球",
          "月",
          "火星",
          "太陽",
          "金星",
          "冥王星"
        ]
      }
    ]
  },
  {
    "id": "animals",
    "title": "動物クイズ",
    "description": "動物に関する知識を問います。",
    "icon": "🐾",
    "color": "#f97316",
    "questions": [
      {
        "id": 1,
        "type": "single",
        "question": "この動物は何ですか？",
        "answer": 1,
        "explanation": "猫（ネコ）です。",
        "score": 10,
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/320px-Cat03.jpg",
        "choices": [
          "犬",
          "猫",
          "うさぎ",
          "ハムスター"
        ]
      },
      {
        "id": 2,
        "type": "input",
        "question": "地球上で最も大きい動物の名前を答えてください。",
        "answer": [
          "シロナガスクジラ",
          "しろながすくじら",
          "シロナガス鯨",
          "ブルーホエール"
        ],
        "explanation": "シロナガスクジラ（体長約30m）が最大です。",
        "score": 15,
        "caseSensitive": false
      }
    ]
  },
  {
    "id": "quiz_1771796625856",
    "title": "ゆゆゆ検定",
    "description": "ゆゆゆのことをどれだけ理解できてるかな？",
    "icon": "🩷",
    "color": "#ffc1e0",
    "questions": [
      {
        "id": 1,
        "type": "single",
        "question": "ゆゆゆの誕生日は？",
        "answer": 2,
        "explanation": "ゆゆゆは12/26(クリスマスの次の日)に生まれました。\n遅いですね。",
        "score": 101000,
        "choices": [
          "8/31",
          "4/1",
          "12/26",
          "8/27",
          "9/9",
          "1/25",
          "2/10",
          "4/30",
          "1/27",
          "1/8"
        ]
      },
      {
        "id": 2,
        "type": "multiple",
        "question": "ゆゆゆの推しは？(複数選択)",
        "answer": [
          1,
          5,
          6,
          8
        ],
        "explanation": "ゆゆゆの推しは、瑞希・えむ・ミク・テトですね。\n覚えておきましょう。",
        "score": 101000,
        "choices": [
          "KAITO",
          "重音テト",
          "東雲絵名",
          "日野森志歩",
          "DECO*27",
          "初音ミク",
          "鳳えむ",
          "宵崎奏",
          "暁山瑞希",
          "朝比奈まふゆ"
        ]
      },
      {
        "id": 3,
        "type": "single",
        "question": "ゆゆゆは朝型？夜型？",
        "answer": 1,
        "explanation": "ゆゆゆはよく夜ふかししてますね。\n寝ましょう。",
        "score": 101000,
        "choices": [
          "朝型",
          "夜型"
        ]
      },
      {
        "id": 4,
        "type": "multiple",
        "question": "ゆゆゆが深夜テンションになるとどうなる？(複数選択)\n",
        "answer": [
          1,
          2,
          4,
          5,
          8,
          9
        ],
        "explanation": "これだけ見たらただの変人ですね。\nいますぐ輪廻！！(深夜テンション)",
        "score": 101000,
        "choices": [
          "寝る",
          "誤字が増える",
          "下ネタをものすごい言うようになる",
          "頭がよくなる",
          "病みやすくなる",
          "素が出る",
          "連投が増える",
          "長文送り出す",
          "　お　は　よ　う　せ　か　い　",
          "意味不明なことを言い出す"
        ]
      },
      {
        "id": 5,
        "type": "multiple",
        "question": "ゆゆゆが削除したことあるアプリは？(複数選択)",
        "answer": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9
        ],
        "explanation": "ゆゆゆは謎にアプリをすぐ消す習性があるんですよね。\nやっぱ変人だなぁ…",
        "score": 101000,
        "choices": [
          "Chatwork",
          "Youtube",
          "TikTok",
          "Instagram",
          "Facebook",
          "X(旧Twitter)",
          "LINE",
          "Discord",
          "Roblox",
          "pixiv"
        ]
      },
      {
        "id": 6,
        "type": "single",
        "question": "私が好きな色は？",
        "answer": 0,
        "explanation": "こんなむずい問題だれが分かるん。\nちなみに#ffc1e0は色んなとこにつかわれてます。",
        "score": 101000,
        "choices": [
          "#ffc1e0",
          "#9370db",
          "#ff6b6b",
          "#4ecdc4",
          "#ffe66d",
          "#1a535c",
          "#ff9f1c",
          "#2ec4b6",
          "#5a189a",
          "#00b4d8"
        ]
      },
      {
        "id": 7,
        "type": "single",
        "question": "ゆゆゆが一番よく使ってるSNS",
        "answer": 4,
        "explanation": "まあこれは…一つしかなかったよね。\nちゃとわ以外ほぼ使ってないね",
        "score": 101000,
        "choices": [
          "LIVE VOOM",
          "TikTok",
          "Instagram",
          "Facebook",
          "Chatwork",
          "ニコニコ動画",
          "X(旧Twitter)",
          "LINE",
          "Discord",
          "Youtube"
        ]
      },
      {
        "id": 8,
        "type": "multiple",
        "question": "ゆゆゆがよくやってそうな行動(複数選択)",
        "answer": [
          2,
          7
        ],
        "explanation": "これはChatGPTに選択肢考えてもらった\n選択肢考えるのめんどいよね",
        "score": 101000,
        "choices": [
          "深夜に長文ポエム投稿",
          "ネットで謎の暗号やコードいじる",
          "音ゲーやりまくる",
          "アイコン頻繁に変える",
          "ネッ友と通話でだらだら",
          "匿名掲示板徘徊",
          "寝落ち通話",
          "病みツイすぐ消し",
          "勉強配信を「見るだけ」",
          "スマホカスタムしまくる"
        ]
      },
      {
        "id": 9,
        "type": "multiple",
        "question": "ゆゆゆの性格(複数選択)",
        "answer": [
          0,
          3,
          4,
          6,
          7,
          8
        ],
        "explanation": "ただの変人で草\n何が起こったらこうなるんだろ",
        "score": 101000,
        "choices": [
          "人見知り",
          "静か",
          "陽キャ",
          "陰キャ",
          "気分の上下激しい",
          "テンション一定",
          "すぐ病む",
          "自由人",
          "めんどくさがり",
          "完璧主義者"
        ]
      },
      {
        "id": 10,
        "type": "multiple",
        "question": "ゆゆゆが元気無いときにやりがちなこと",
        "answer": [
          0,
          1,
          2,
          3,
          4,
          7
        ],
        "explanation": "自慰！？\nまあそっか",
        "score": 101000,
        "choices": [
          "自慰",
          "暗めボカロ聞きまくる",
          "意味深な文章を投稿する",
          "眠いって繰り返す",
          "ネッ友に甘えだす",
          "かわいい画像をあつめる",
          "プロフを変える",
          "夜活発になりすぎる",
          "推しに癒される",
          "ネタにする"
        ]
      }
    ]
  }
];
