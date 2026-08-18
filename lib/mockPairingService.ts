import { PairingResult, DrinkCategory } from "@/types/pairing";

// お菓子別の詳細モックデータベース
const PAIRING_DATABASE: Record<string, Record<DrinkCategory, PairingResult>> = {
  canele: {
    all: {
      sweets: {
        name: "カヌレ (Canelé)",
        category: "フランス伝統菓子",
        flavorProfile: ["外側カリカリのカラメル", "ラム酒の芳醇な香り", "濃厚なカスタードの甘み"],
        description: "蜜蝋と銅型でじっくり焼き上げられた、香ばしい苦味とリッチな甘みのコントラストが特徴の焼き菓子。",
      },
      bestMatch: {
        drinkName: "深煎りマンデリンコーヒー",
        category: "coffee",
        categoryLabel: "珈琲",
        matchScore: 96,
        catchphrase: "芳醇なラム香と深煎りの重厚な苦味が溶け合う、大人のビターマリアージュ",
        flavorSynergy: {
          harmonyReason: "カヌレ外側の焦がしカラメルの苦味と、マンデリン特有のアーシーで重厚な苦味が美しく「同調」します。",
          scienceNotes: "内側のリッチなカスタード（乳脂肪分）を、コーヒーのキレのある苦味とオイル分が後口でさっぱりと流し、一口ごとに新鮮な美味しさが持続します。",
        },
        servingGuide: {
          temperature: "85℃ 〜 90℃（熱すぎず香りがふくよかに立つ温度）",
          strengthOrBrew: "中深煎り〜深煎りをやや濃いめにハンドドリップ",
          recommendedVessel: "厚手の陶器マグカップ（温もりを長くキープ）",
          specialTip: "カヌレを一口噛みしめ、カラメルの香ばしさとラムの余韻が残っているうちに温かい珈琲をひとくち含むのが黄金ルールです。",
        },
      },
      alternativePairings: [
        {
          drinkName: "アールグレイ（ストレート紅茶）",
          categoryLabel: "紅茶",
          matchScore: 89,
          shortReason: "ベルガモットの華やかな柑橘香がラム酒香とエレガントに調和。",
        },
        {
          drinkName: "ダークラム（ロック）",
          categoryLabel: "お酒",
          matchScore: 87,
          shortReason: "素材のラム酒と完全に共鳴する、贅沢な夜のナイトキャップペアリング。",
        },
      ],
    },
    coffee: {
      sweets: {
        name: "カヌレ (Canelé)",
        category: "フランス伝統菓子",
        flavorProfile: ["外側カリカリのカラメル", "ラム酒の芳醇な香り", "濃厚カスタード"],
        description: "香ばしい苦味とリッチな甘みのコントラストが特徴の焼き菓子。",
      },
      bestMatch: {
        drinkName: "深煎りマンデリン（フレンチロースト）",
        category: "coffee",
        categoryLabel: "珈琲",
        matchScore: 96,
        catchphrase: "焦がしカラメルと重厚なコクが織りなす極上の調和",
        flavorSynergy: {
          harmonyReason: "カラメルのほろ苦さと深煎り豆のスモーキーなコクがピタリと同調します。",
          scienceNotes: "乳脂肪分のコーティングをコーヒーのタンニンとカフェインが心地よくリフレッシュします。",
        },
        servingGuide: {
          temperature: "88℃",
          strengthOrBrew: "粗挽き・濃いめ抽出",
          recommendedVessel: "厚手のカフェマグ",
          specialTip: "カヌレを少しトースターでリベイクして温めると香りがさらに引き立ちます。",
        },
      },
      alternativePairings: [
        { drinkName: "カフェラテ（エスプレッソダブル）", categoryLabel: "珈琲", matchScore: 91, shortReason: "ミルクの甘みがカスタードと相乗効果を生み出します。" },
        { drinkName: "水出しコールドブリュー", categoryLabel: "珈琲", matchScore: 84, shortReason: "すっきりとしたクリアな苦味でキレよく楽しめます。" },
      ],
    },
    tea: {
      sweets: {
        name: "カヌレ (Canelé)",
        category: "フランス伝統菓子",
        flavorProfile: ["外側カリカリのカラメル", "ラム酒の芳醇な香り", "濃厚カスタード"],
        description: "香ばしい苦味とリッチな甘みのコントラストが特徴の焼き菓子。",
      },
      bestMatch: {
        drinkName: "ウバ（ハイグロウンセイロンティー）",
        category: "tea",
        categoryLabel: "紅茶",
        matchScore: 92,
        catchphrase: "メントールのような爽快な渋みとラム酒香の優雅な対比",
        flavorSynergy: {
          harmonyReason: "ウバ特有のキレのある渋み（タンニン）が濃厚なカスタードの甘さを引き締めます。",
          scienceNotes: "爽やかなサロメチール香がラム酒の甘い香りを立体的に際立たせます。",
        },
        servingGuide: {
          temperature: "95℃ 〜 沸騰直後の熱湯",
          strengthOrBrew: "ストレート（蒸らし時間3分）",
          recommendedVessel: "薄手のティーカップ",
          specialTip: "後半に少しだけミルクを足して味の変化を楽しむのもおすすめ。",
        },
      },
      alternativePairings: [
        { drinkName: "クラシック・アールグレイ", categoryLabel: "紅茶", matchScore: 90, shortReason: "ベルガモットの柑橘香が華やかさをプラス。" },
        { drinkName: "アッサム・セカンドフラッシュ", categoryLabel: "紅茶", matchScore: 88, shortReason: "モルティーな甘い香りとコクが同調。" },
      ],
    },
    green_tea: {
      sweets: {
        name: "カヌレ (Canelé)",
        category: "フランス伝統菓子",
        flavorProfile: ["外側カリカリのカラメル", "ラム酒の芳醇な香り", "濃厚カスタード"],
        description: "香ばしい苦味とリッチな甘みのコントラストが特徴の焼き菓子。",
      },
      bestMatch: {
        drinkName: "深炒り 棒ほうじ茶（加賀棒茶）",
        category: "green_tea",
        categoryLabel: "日本茶",
        matchScore: 90,
        catchphrase: "焙煎の香ばしさと焦がしカラメルが織りなす和洋の奇跡",
        flavorSynergy: {
          harmonyReason: "ほうじ茶のピラジン（焙煎香）が、カヌレのカラメル香と完璧にブリッジします。",
          scienceNotes: "カフェインが少なく優しい口当たりながら、香ばしさで後味をすっきりと整えます。",
        },
        servingGuide: {
          temperature: "90℃ 〜 95℃（高温で香りを一気に立たせる）",
          strengthOrBrew: "急須でしっかり30秒抽出",
          recommendedVessel: "湯呑みまたは磁器のカップ",
          specialTip: "焙じ立ての新鮮な茶葉を使うと、部屋中に香ばしさが満ちて極上の時間に。",
        },
      },
      alternativePairings: [
        { drinkName: "武夷岩茶（大紅袍）", categoryLabel: "中国茶", matchScore: 88, shortReason: "深いミネラル感と焙煎香がカスタードにマッチ。" },
        { drinkName: "かぶせ茶（ぬるめ抽出）", categoryLabel: "日本茶", matchScore: 82, shortReason: "濃厚な旨味が甘みと対比を生みます。" },
      ],
    },
    alcohol: {
      sweets: {
        name: "カヌレ (Canelé)",
        category: "フランス伝統菓子",
        flavorProfile: ["外側カリカリのカラメル", "ラム酒の芳醇な香り", "濃厚カスタード"],
        description: "香ばしい苦味とリッチな甘みのコントラストが特徴の焼き菓子。",
      },
      bestMatch: {
        drinkName: "長期熟成ダークラム（ディプロマティコ等）",
        category: "alcohol",
        categoryLabel: "お酒",
        matchScore: 95,
        catchphrase: "原材料同士の完全共鳴。贅を尽くした大人のナイトマリアージュ",
        flavorSynergy: {
          harmonyReason: "カヌレの香りづけに使われるダークラムと、同調率100%のマリアージュ。",
          scienceNotes: "ラム酒のアルコール感とオーク樽のバニラ香が、カスタードの甘味をリッチに昇華させます。",
        },
        servingGuide: {
          temperature: "常温（ストレート）または 大きめの丸氷でオン・ザ・ロック",
          strengthOrBrew: "ストレート / ロック",
          recommendedVessel: "スニフターグラス（チューリップ型の香りを集めるグラス）",
          specialTip: "少しグラスを回して手のひらの体温で温めると、バニラとトフィーの香りが爆発します。",
        },
      },
      alternativePairings: [
        { drinkName: "シングルモルト・ウイスキー（シェリー樽熟成）", categoryLabel: "お酒", matchScore: 91, shortReason: "ドライフルーツのような甘美な余韻が重なります。" },
        { drinkName: "トウニー・ポートワイン", categoryLabel: "お酒", matchScore: 89, shortReason: "ナッツのような熟成香と濃厚な甘みが相性抜群。" },
      ],
    },
  },

  dark_chocolate: {
    all: {
      sweets: {
        name: "ビターチョコレート (Dark Chocolate 70%+)",
        category: "チョコレート",
        flavorProfile: ["カカオの重厚な苦味", "ベリー系のほのかな酸味", "なめらかな口溶け"],
        description: "高カカオならではの力強いアロマと、カカオポリフェノールの心地よい収斂味が特徴。",
      },
      bestMatch: {
        drinkName: "フルボディ赤ワイン（カベルネ・ソーヴィニヨン）",
        category: "alcohol",
        categoryLabel: "お酒",
        matchScore: 97,
        catchphrase: "カカオの酸味とワインのタンニンが溶け合う至高のアンサンブル",
        flavorSynergy: {
          harmonyReason: "カカオのポリフェノールと赤ワインのタンニン（渋み）が重なり合い、深みのある芳醇な味わいを生み出します。",
          scienceNotes: "チョコレートの脂質（カカオバター）が舌を覆うのを、ワインの適度な酸とアルコールが心地よくリセットします。",
        },
        servingGuide: {
          temperature: "16℃ 〜 18℃（少し冷涼な室温）",
          strengthOrBrew: "グラスに注ぎ少し空気に触れさせる",
          recommendedVessel: "大ぶりのボルドー型ワイングラス",
          specialTip: "チョコを舌の上でゆっくり溶かしながら、ワインを少量含むと口の中で一体化します。",
        },
      },
      alternativePairings: [
        {
          drinkName: "エチオピア・イルガチェフェ（浅煎り珈琲）",
          categoryLabel: "珈琲",
          matchScore: 94,
          shortReason: "フローラルな果実香がハイカカオのフルーティーな酸味と同調。",
        },
        {
          drinkName: "キームン紅茶",
          categoryLabel: "紅茶",
          matchScore: 88,
          shortReason: "スモーキーで蘭のような香りがビター感と絶妙にマッチ。",
        },
      ],
    },
    coffee: {
      sweets: {
        name: "ビターチョコレート",
        category: "チョコレート",
        flavorProfile: ["カカオの重厚な苦味", "果実系の酸味", "滑らかな口溶け"],
        description: "カカオ70%以上の力強い香りと深み。",
      },
      bestMatch: {
        drinkName: "エチオピア・ナチュラル（浅〜中煎り）",
        category: "coffee",
        categoryLabel: "珈琲",
        matchScore: 95,
        catchphrase: "ベリーの果実感とカカオのフルーティーさが織りなす華麗な共鳴",
        flavorSynergy: {
          harmonyReason: "エチオピア豆特有のベリー系アロマと、良質なカカオの持つフルーツ酸が美しく響き合います。",
          scienceNotes: "浅煎りの明るい酸味が、高カカオの重厚な苦味を爽やかにドレスアップします。",
        },
        servingGuide: {
          temperature: "90℃",
          strengthOrBrew: "ペーパードリップでクリアに抽出",
          recommendedVessel: "ワイングラス型のコーヒーカップ",
          specialTip: "温度が少し下がってくると果実感が増し、さらにチョコとの相性が良くなります。",
        },
      },
      alternativePairings: [
        { drinkName: "エスプレッソ・ソロ", categoryLabel: "珈琲", matchScore: 92, shortReason: "濃厚な苦味の凝縮感を楽しむクラシックスタイル。" },
        { drinkName: "グアテマラ（中深煎り）", categoryLabel: "珈琲", matchScore: 89, shortReason: "ナッツとチョコのような甘いアロマが同調。" },
      ],
    },
    tea: {
      sweets: {
        name: "ビターチョコレート",
        category: "チョコレート",
        flavorProfile: ["カカオの重厚な苦味", "果実系の酸味"],
        description: "高カカオの力強い味わい。",
      },
      bestMatch: {
        drinkName: "中国紅茶・キームン（祁門紅茶）",
        category: "tea",
        categoryLabel: "紅茶",
        matchScore: 93,
        catchphrase: "燻製香と蘭の香りがビターチョコの奥深さを引き立てる",
        flavorSynergy: {
          harmonyReason: "キームン特有のスモーキーな香りと微かな酸味が、ハイカカオのビター感と完璧に調和します。",
          scienceNotes: "渋みが穏やかなため、チョコレートの繊細な風味を邪魔せず引き立てます。",
        },
        servingGuide: {
          temperature: "95℃",
          strengthOrBrew: "ストレート（蒸らし時間4分）",
          recommendedVessel: "白磁のティーカップ",
          specialTip: "ストレートのまま、香りを吸い込みながら味わってください。",
        },
      },
      alternativePairings: [
        { drinkName: "アールグレイ（ベルガモット）", categoryLabel: "紅茶", matchScore: 90, shortReason: "柑橘香がオランジェットのような風味を演出。" },
        { drinkName: "ルイボスティー", categoryLabel: "ハーブティー", matchScore: 84, shortReason: "ノンカフェインで夜のビターチョコタイムに最適。" },
      ],
    },
    green_tea: {
      sweets: {
        name: "ビターチョコレート",
        category: "チョコレート",
        flavorProfile: ["カカオの重厚な苦味", "果実系の酸味"],
        description: "高カカオの力強い味わい。",
      },
      bestMatch: {
        drinkName: "宇治抹茶（薄茶）",
        category: "green_tea",
        categoryLabel: "日本茶",
        matchScore: 94,
        catchphrase: "茶葉の旨味・苦味とカカオの苦味が紡ぐ大人のディープハーモニー",
        flavorSynergy: {
          harmonyReason: "抹茶の上品な苦味とテアニンの旨味が、カカオの苦味と美しく二重奏を奏でます。",
          scienceNotes: "緑茶カテキンとカカオポリフェノールの抗酸化成分同士が相乗し、すっきりとした後味を残します。",
        },
        servingGuide: {
          temperature: "70℃ 〜 80℃",
          strengthOrBrew: "茶筅でふんわり点てた薄茶",
          recommendedVessel: "抹茶碗",
          specialTip: "チョコの甘みが消える前に温かい抹茶を含むと、口の中で和洋のガナッシュが完成します。",
        },
      },
      alternativePairings: [
        { drinkName: "深蒸し煎茶（一煎目）", categoryLabel: "日本茶", matchScore: 88, shortReason: "濃厚なアミノ酸の旨味がチョコのコクを引き立てます。" },
        { drinkName: "凍頂烏龍茶", categoryLabel: "中国茶", matchScore: 86, shortReason: "花のような香りと爽やかな後口が好相性。" },
      ],
    },
    alcohol: {
      sweets: {
        name: "ビターチョコレート",
        category: "チョコレート",
        flavorProfile: ["カカオの重厚な苦味", "果実系の酸味"],
        description: "高カカオの力強い味わい。",
      },
      bestMatch: {
        drinkName: "フルボディ赤ワイン（カベルネ / シラー）",
        category: "alcohol",
        categoryLabel: "お酒",
        matchScore: 97,
        catchphrase: "世界が認める王道マリアージュ。深い余韻に酔いしれる夜",
        flavorSynergy: {
          harmonyReason: "カカオのポリフェノールとワインの力強いタンニンが同調し、芳醇な果実味が爆発します。",
          scienceNotes: "舌の上のカカオバターをアルコールと酸が洗い流し、次の一口をより美味しくします。",
        },
        servingGuide: {
          temperature: "16〜18℃",
          strengthOrBrew: "ストレート（大ぶりグラス）",
          recommendedVessel: "ボルドー型ワイングラス",
          specialTip: "チョコレートをひとかじりして口全体に広げてから、ワインを口に含んでください。",
        },
      },
      alternativePairings: [
        { drinkName: "アイラ・シングルモルト（ラフロイグ等）", categoryLabel: "お酒", matchScore: 93, shortReason: "強烈なピート香とビターチョコのスモーキーな共鳴。" },
        { drinkName: "ブランデー（コニャック XO）", categoryLabel: "お酒", matchScore: 91, shortReason: "熟成したブドウの甘美な香りがカカオを包み込みます。" },
      ],
    },
  },
};

// 汎用ジェネレーター（どんなお菓子名・画像でも適切なプロ風ペアリング結果を生成）
export function generatePairingMock(
  sweetsName: string,
  category: DrinkCategory = "all"
): PairingResult {
  const normalizedKey = sweetsName.toLowerCase();

  if (normalizedKey.includes("カヌレ") || normalizedKey.includes("canele")) {
    return PAIRING_DATABASE.canele[category] || PAIRING_DATABASE.canele.all;
  }
  if (normalizedKey.includes("チョコ") || normalizedKey.includes("choco")) {
    return PAIRING_DATABASE.dark_chocolate[category] || PAIRING_DATABASE.dark_chocolate.all;
  }
  if (normalizedKey.includes("チーズ") || normalizedKey.includes("cheese")) {
    return {
      sweets: {
        name: sweetsName || "濃厚バスクチーズケーキ",
        category: "生菓子・ケーキ",
        flavorProfile: ["香ばしい焦げ目のビター感", "クリームチーズの濃厚なコク", "ほのかな酸味"],
        description: "クリーミーな舌触りとカラメライズされた表面の風味が絶妙なバランスを保つスイーツ。",
      },
      bestMatch: {
        drinkName: category === "alcohol" ? "辛口白ワイン（シャルドネ樽熟成）" : category === "green_tea" ? "宇治玉露（低温抽出）" : category === "tea" ? "ダージリン・オータムナル" : "中深煎り コロンビアコーヒー",
        category: category === "alcohol" ? "alcohol" : category === "green_tea" ? "green_tea" : category === "tea" ? "tea" : "coffee",
        categoryLabel: category === "alcohol" ? "お酒" : category === "green_tea" ? "日本茶" : category === "tea" ? "紅茶" : "珈琲",
        matchScore: 95,
        catchphrase: "チーズの乳脂質を上品に包み込み、芳醇なコクを増幅させるマリアージュ",
        flavorSynergy: {
          harmonyReason: "チーズのまろやかな酸味・塩気と、飲み物の豊かなアロマが口の中で美しく調和します。",
          scienceNotes: "チーズの脂質が舌に薄い膜を作ることで、飲み物の持つ酸味や苦味が角の取れたまろやかな味わいに変化します。",
        },
        servingGuide: {
          temperature: category === "alcohol" ? "10℃ 〜 12℃" : "85℃",
          strengthOrBrew: "バランスの良いミディアム抽出",
          recommendedVessel: "広口のグラスまたは磁器カップ",
          specialTip: "チーズケーキの中心部（もっともとろける部分）を味わいながら合わせると最高です。",
        },
      },
      alternativePairings: [
        { drinkName: "アッサム・ミルクティー", categoryLabel: "紅茶", matchScore: 90, shortReason: "ミルク同士のコクが同調し、至福のミルキー体験に。" },
        { drinkName: "クラフト黒ビール（スタウト）", categoryLabel: "お酒", matchScore: 87, shortReason: "ロースト麦芽の香ばしさがチーズの焦げ目とマッチ。" },
      ],
    };
  }

  if (normalizedKey.includes("ポテト") || normalizedKey.includes("チップス") || normalizedKey.includes("スナック")) {
    return {
      sweets: {
        name: sweetsName || "ポテトチップス（うすしお味）",
        category: "スナック菓子",
        flavorProfile: ["じゃがいもの香ばしい旨味", "程よい塩味", "カリッとした油脂感"],
        description: "クリスピーな食感と塩気が後を引く、定番のソルティスナック。",
      },
      bestMatch: {
        drinkName: category === "alcohol" ? "ピルスナービール（またはハイボール）" : category === "tea" ? "ミントティー（すっきりハーブ）" : category === "green_tea" ? "冷煎茶（氷出し）" : "炭酸水割り コールドブリュー珈琲",
        category: category === "alcohol" ? "alcohol" : category === "green_tea" ? "green_tea" : category === "tea" ? "tea" : "coffee",
        categoryLabel: category === "alcohol" ? "お酒" : category === "green_tea" ? "日本茶" : category === "tea" ? "紅茶" : "珈琲",
        matchScore: 93,
        catchphrase: "塩気と油脂感をキレのある爽快感でリセットする無限ループペアリング",
        flavorSynergy: {
          harmonyReason: "スナックの塩味が飲み物の微かな甘みや麦のコクを引き立て、喉ごしの良さを加速させます。",
          scienceNotes: "口の中に残る油分（オレイン酸等）を、炭酸や爽快なカテキン・酸がすっきりとウォッシュバックします。",
        },
        servingGuide: {
          temperature: "4℃ 〜 6℃（しっかり冷やして）",
          strengthOrBrew: "キレのある強炭酸または急冷抽出",
          recommendedVessel: "薄づくりのタンブラーグラス",
          specialTip: "チップスを数枚楽しんだ後、喉を鳴らして飲む爽快感が醍醐味です。",
        },
      },
      alternativePairings: [
        { drinkName: "玄米茶（熱め）", categoryLabel: "日本茶", matchScore: 88, shortReason: "炒り米の香ばしさとポテトの香ばしさが同調。" },
        { drinkName: "ジンジャーエール（辛口）", categoryLabel: "その他", matchScore: 86, shortReason: "生姜の刺激がポテトの旨味をキリッと引き締め。" },
      ],
    };
  }

  // デフォルト（汎用お菓子）
  return {
    sweets: {
      name: sweetsName || "季節のスイーツ",
      category: "スイーツ・菓子",
      flavorProfile: ["豊かな甘み", "香ばしいアロマ", "心地よい後味"],
      description: "素材の美味しさが引き立つ、ティータイムにぴったりのお菓子。",
    },
    bestMatch: {
      drinkName: category === "coffee" ? "スペシャルティブレンド珈琲（中煎り）" : category === "tea" ? "ディンブラ（セイロン紅茶）" : category === "green_tea" ? "深蒸し掛川茶（煎茶）" : category === "alcohol" ? "スパークリングワイン（辛口）" : "エチオピア・ナチュラル珈琲",
      category: category === "all" ? "coffee" : category,
      categoryLabel: category === "tea" ? "紅茶" : category === "green_tea" ? "日本茶" : category === "alcohol" ? "お酒" : "珈琲",
      matchScore: 94,
      catchphrase: "素材の甘みと香りを最大限に引き出す、王道の黄金ペアリング",
      flavorSynergy: {
        harmonyReason: "お菓子の甘みを飲み物の心地よい苦味・酸味が支え、互いのフレーバーをより立体的に感じさせます。",
        scienceNotes: "味覚の対比効果により、甘みがくどくならず、飲み物の持つ繊細なアロマがより際立ちます。",
      },
      servingGuide: {
        temperature: category === "alcohol" ? "8℃ 〜 10℃" : "85℃ 〜 90℃",
        strengthOrBrew: "丁寧にドリップまたは蒸らした一杯",
        recommendedVessel: "お気に入りのマグカップまたはグラス",
        specialTip: "一口お菓子を味わったあと、余韻があるうちに飲み物を口に含んでください。",
      },
    },
    alternativePairings: [
      { drinkName: "アールグレイ紅茶", categoryLabel: "紅茶", matchScore: 89, shortReason: "爽やかなベルガモットの香りでリフレッシュ。" },
      { drinkName: "ほうじ茶ラテ", categoryLabel: "お茶", matchScore: 86, shortReason: "香ばしさとミルクのコクで心ほぐれるひとときに。" },
    ],
  };
}
