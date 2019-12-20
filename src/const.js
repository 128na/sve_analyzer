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
  LINE_DIAGRAM: "路線図",
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

/**
 * プレーヤーカラー一覧
 */
const PLAYER_COLORS = {
  1: '#7396bd',
  2: '#a5a2a5',
  3: '#3975ce',
  4: '#c6b608',
  5: '#b54110',
  6: '#4a8e18',
  7: '#00ae9c',
  8: '#a545bd',
  9: '#9c6100',
  10: '#b53c8c',
  11: '#73964a',
  12: '#ad7952',
  13: '#2949bd',
  14: '#8c6dad',
  15: '#ad6142',
  16: '#63ae84',
  17: '#ff0000',
  18: '#00ff00',
  19: '#0041ff',
  20: '#ff8200',
  21: '#427108',
  22: '#ffff21',
  23: '#843829',
  24: '#8c4110',
  25: '#949200',
  26: '#84ae42',
  27: '#636163',
  28: '#736994',
};

export { STEPS, PLAYER_TYPES, PAGES, WAY_TYPES, DEFAULT_PLAYER_NAMES, SUPPORTED_SAVEFORMATS, PLAYER_COLORS };
