import { toKB } from "./helper"

const STATUSES = {
  READY: "-",
  START: "解析：開始",
  PARSE_SIMUTRANS: "解析：セーブデータ情報",
  PARSE_MAP_INFO: "解析：マップ情報",
  PARSE_STATIONS: "解析：駅座標情報",
  PARSE_STATION_NAMES: "解析：駅名情報",
  MERGE_STATION_NAMES: "統合：駅名情報",
  PARSE_PLAYERS: "解析：プレイヤー情報",
  PARSE_LINES: "解析：路線情報",
  FINISHED: "完了",
};
export { STATUSES };
