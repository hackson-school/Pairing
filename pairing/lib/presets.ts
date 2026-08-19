import { SweetsPreset, PairingResult, DrinkCategory } from "@/types/pairing";

export const SWEETS_PRESETS: SweetsPreset[] = [
  {
    id: "canele",
    name: "カヌレ",
    emoji: "🧁",
    category: "フランス伝統菓子",
    defaultDescription: "外側のカリッとした焦がしカラメルと、内側のモチッとしたラム酒香る濃厚カスタード生地",
  },
  {
    id: "dark_chocolate",
    name: "ビターチョコレート",
    emoji: "🍫",
    category: "チョコレート",
    defaultDescription: "カカオ70%以上のほろ苦さと果実のような酸味、なめらかなカカオバターの口溶け",
  },
  {
    id: "cheesecake",
    name: "バスクチーズケーキ",
    emoji: "🧀",
    category: "ケーキ",
    defaultDescription: "高温で焼き上げた香ばしい焦げ目と、中心部のとろける濃厚クリーミーなクリームチーズ",
  },
  {
    id: "shortcake",
    name: "苺のショートケーキ",
    emoji: "🍰",
    category: "生ケーキ",
    defaultDescription: "軽やかな生クリームのコクと、ふんわりスポンジ、甘酸っぱいフレッシュ苺のハーモニー",
  },
  {
    id: "potato_chips",
    name: "ポテトチップス（うすしお）",
    emoji: "🥔",
    category: "スナック菓子",
    defaultDescription: "カリッと香ばしいじゃがいもの旨味と、程よい塩気・油脂感",
  },
  {
    id: "yokan",
    name: "練り羊羹",
    emoji: "🍵",
    category: "和菓子",
    defaultDescription: "小豆の凝縮された上品な甘みと、寒天によるなめらかでずっしりとした舌触り",
  },
  {
    id: "macaron",
    name: "ピスタチオのマカロン",
    emoji: "🫛",
    category: "洋菓子",
    defaultDescription: "サクッとしたアーモンド生地に、香ばしく濃厚なピスタチオガナッシュの芳醇な香り",
  },
  {
    id: "cream_puff",
    name: "シュークリーム",
    emoji: "🥮",
    category: "洋菓子",
    defaultDescription: "香ばしいシュー皮に、バニラビーンズが香るたっぷりのとろ〜りカスタードクリーム",
  },
];

export const DRINK_CATEGORY_OPTIONS: { id: DrinkCategory; label: string; icon: string }[] = [
  { id: "all", label: "おまかせ（全ジャンル）", icon: "✨" },
  { id: "coffee", label: "珈琲（コーヒー）", icon: "☕" },
  { id: "tea", label: "紅茶・ハーブティー", icon: "🫖" },
  { id: "green_tea", label: "日本茶・中国茶", icon: "🍵" },
  { id: "alcohol", label: "お酒（ワイン・洋酒等）", icon: "🍷" },
];
