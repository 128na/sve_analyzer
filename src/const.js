const STATUSES = {
  file_ready: "-",
  file_start: "ファイル読込：開始",
  file_progress: e => `読み込み中... ${e.loaded}bytes / ${e.total}bytes `,
  file_abort: "ファイル読込：中断",
  file_error: "ファイル読込：失敗",
  xml_start: "XMLパース：開始",
  xml_end: "XMLパース：完了"
};
export { STATUSES };
