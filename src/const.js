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
const PLAYER_COLOR = {
  '0': '#7396bd',
  '8': '#a5a2a5',
  '16': '#3975ce',
  '24': '#c6b608',
  '32': '#b54110',
  '40': '#4a8e18',
  '48': '#00ae9c',
  '56': '#a545bd',
  '64': '#9c6100',
  '72': '#b53c8c',
  '80': '#73964a',
  '88': '#ad7952',
  '96': '#2949bd',
  '104': '#8c6dad',
  '112': '#ad6142',
  '120': '#63ae84',
  '-128': '#ff0000',
  '-120': '#00ff00',
  '-112': '#0041ff',
  '-104': '#ff8200',
  '-96': '#427108',
  '-88': '#ffff21',
  '-80': '#843829',
  '-72': '#8c4110',
  '-64': '#949200',
  '-56': '#84ae42',
  '-48': '#636163',
  '-40': '#736994',
};

const SLIDES = {
  line_filter: "line_filter",
  diagram_config: "diagram_config",
  diagram_export: "diagram_export",
};

export { STEPS, PLAYER_TYPES, PAGES, WAY_TYPES, DEFAULT_PLAYER_NAMES, SUPPORTED_SAVEFORMATS, PLAYER_COLOR, SLIDES };
