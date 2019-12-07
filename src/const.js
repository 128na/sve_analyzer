const STATUSES = {
  file_ready: "-",
  file_start: "ファイル読込：開始",
  file_progress: (loaded, total) => {
    const intl = new Intl.NumberFormat('ja', { maximumFractionDigits: 1 });
    return `ファイル読込：${intl.format(loaded / 10 ** 3)} / ${intl.format(total / 10 ** 3)} MB `;
  },
  file_abort: "ファイル読込：中断",
  file_error: "ファイル読込：失敗",
  xml_start: "XMLパース：開始",
  xml_end: "XMLパース：完了",
  simutrans: "基本情報取得",
  map: "マップ情報取得",
  station: "駅情報取得",
  relation: "路線情報取得",
  player: "会社情報取得",
  finished: "完了",
};
export { STATUSES };
