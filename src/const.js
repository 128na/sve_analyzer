const STEPS = {
  READY: "--",
  START: "開始",
  PARSE: "解析...",
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
  LINES: "路線一覧",
  USAGE: "使い方"
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
};

// 会社名未指定の時のデフォルト名称
const DEFAULT_PLAYER_NAMES = {
  'player -1': 'プレイヤー会社',
  'player 0': '公共事業',
  'player 1': 'Napik 128 AS',
  'player 2': 'Trikky Transport',
  'player 3': 'Meyer Moving Co.',
  'player 4': 'Spedition VM',
  'player 5': 'H - Trans GmbH',
  'player 6': 'PSK & Co KG',
  'player 7': 'プレイヤー 7',
  'player 8': 'プレイヤー 8',
  'player 9': 'プレイヤー 9',
  'player 10': 'プレイヤー 10',
  'player 11': 'プレイヤー 11',
  'player 12': 'プレイヤー 12',
  'player 13': 'プレイヤー 13',
};

const SUPPORTED_SAVEFORMATS = {
  xml: 'xml',
  xml_zipped: 'xml_zipped',
  xml_bzip2: 'xml_bzip2',
};

export { STEPS, PLAYER_TYPES, PAGES, WAY_TYPES, DEFAULT_PLAYER_NAMES, SUPPORTED_SAVEFORMATS };
