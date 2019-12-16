const STEPS = {
  READY: "--",
  START: "開始",
  PARSE: "xmlパース中...",
  MERGE: "統合中...",
  RENDER: "描画中...",
  FINISHED: "完了",
};
const PLAYER_TYPES = [
  '未使用',
  '人間',
  'AI 貨物',
  'AI 旅客',
  'スクリプトAI',
];

const PAGES = {
  TOP: "トップ",
  STATIONS: "駅・会社一覧",
  LINES: "路線一覧"
};

const WAY_TYPES = {
  1: '自動車',
  2: '鉄道',
  3: '船舶',
  4: '航空',
  5: 'モノレール',
  6: '市電',
  7: 'リニア',
  8: 'ナローゲージ',
}

export { STEPS, PLAYER_TYPES, PAGES, WAY_TYPES };
