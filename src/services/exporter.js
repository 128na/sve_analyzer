import { saveAs } from 'file-saver';
import Encoding from 'encoding-japanese';
import { escCSV } from "../helper";
import relationService from "./relation";
export default {
  getFormats() {
    return [
      { text: "JSON", value: "json" },
      { text: "CSV(Windows用)", value: "csv_sjis" },
      { text: "CSV(その他)", value: "csv" },
      { text: "テキスト", value: "txt" },
    ];
  },
  download({ type, data, name }) {
    data.app = { version: process.env.VUE_APP_VERSION };

    switch (type) {
      case 'json':
        return this.jsonExporter(data, name);
      case 'csv':
        return this.csvExporter(data, name);
      case 'csv_sjis':
        return this.csvSjisExporter(data, name);
      case 'txt':
      default:
        return this.textExporter(data, name);
    }
  },
  jsonExporter(data, name) {
    return saveAs(new Blob([JSON.stringify(data)]),
      `${name}.json`, { type: "data:application/json;charset=utf-8" });
  },
  csvExporter(data, name) {
    return saveAs(new Blob([this.toCSV(data)]),
      `${name}.csv`, { type: "data:text/csv;charset=utf-8" });
  },
  csvSjisExporter(data, name) {
    // sjis変換
    const unicode_arr = [...this.toCSV(data)].map(str => str.charCodeAt(0));
    const converted_arr = Encoding.convert(unicode_arr, 'SJIS', 'unicode');
    const sjis_arr = new Uint8Array(converted_arr);

    return saveAs(new Blob([sjis_arr]),
      `${name}.csv`, { type: "data:text/csv;charset=sjis" });
  },
  textExporter(data, name) {
    return saveAs(new Blob([this.toText(data)]),
      `${name}.txt`, { type: "text/plain;charset=utf-8" });
  },
  toCSV(data) {
    let rows = [];

    rows.push(['[アプリ情報]']);
    rows.push(['バージョン', escCSV(data.app.version)]);
    rows.push(['']);
    rows.push(['[ファイル情報]']);
    rows.push(['名前', escCSV(data.file.name)]);
    rows.push(['サイズ', escCSV(data.file.size)]);
    rows.push(['']);
    rows.push(['[マップ情報]']);
    rows.push(['マップ番号', escCSV(data.info.map.no)]);
    rows.push(['横', escCSV(data.info.map.width)]);
    rows.push(['縦', escCSV(data.info.map.depth)]);
    rows.push(['']);
    rows.push(['[Simutrans情報]']);
    rows.push(['バージョン', escCSV(data.info.simutrans.version)]);
    rows.push(['pak', escCSV(data.info.simutrans.pak)]);
    rows.push(['']);
    rows.push(['[会社情報]']);
    rows.push(['ID', '会社名', '種類']);
    rows = rows.concat(data.info.players.map(p => [
      escCSV(p.id),
      escCSV(relationService.getPlayerName(p)),
      escCSV(p.type)
    ]));
    rows.push(['']);
    rows.push(['[駅情報]']);
    rows.push(['ID', '会社名', '駅名', 'タイル数']);
    rows = rows.concat(data.info.stations.map(s => [
      escCSV(s.id),
      escCSV(relationService.getPlayerNameById(data.info.players, s.player_id)),
      escCSV(s.name),
      escCSV(s.coordinates.length)
    ]));
    rows.push(['']);
    rows.push(['[路線情報]']);
    rows.push(['ID', '会社名', '種類', '路線名', '停車駅数', '停車駅']);
    rows = rows.concat(
      data.info.lines.map(l => [
        escCSV(l.id),
        escCSV(relationService.getPlayerNameById(data.info.players, l.player_id)),
        escCSV(relationService.getWayTypeName(l.type)),
        escCSV(l.name),
        escCSV(l.stops.length)
      ]
        .concat(l.stops.map(s => s.station_id === null
          ? "[中継点]"
          : relationService.getStationNameById(data.info.stations, s.station_id)
        ))
      ));

    return rows.map(r => r.join(',')).join("\n");
  },
  toText(data) {
    let rows = [];

    rows.push('[アプリ情報]');
    rows.push('バージョン: ' + data.app.version);
    rows.push('');
    rows.push('[ファイル情報]');
    rows.push('名前: ' + data.file.name);
    rows.push('サイズ: ' + data.file.size);
    rows.push('');
    rows.push('[マップ情報]');
    rows.push('マップ番号: ' + data.info.map.no);
    rows.push('横: ' + data.info.map.width);
    rows.push('縦: ' + data.info.map.depth);
    rows.push('');
    rows.push('[Simutrans情報]');
    rows.push('バージョン: ' + data.info.simutrans.version);
    rows.push('pak: ' + data.info.simutrans.pak);
    rows.push('');
    rows.push('[会社情報]');
    rows = rows.concat(data.info.players.map(p => relationService.getPlayerName(p)));
    rows.push('');
    rows.push('[駅情報]');
    rows = rows.concat(data.info.stations.map(s => s.name));
    rows.push('');
    rows.push('[路線情報]');
    rows = rows.concat(
      data.info.lines.map(l => [
        l.name,
        l.stops.map(s => s.station_id === null
          ? "[中継点]"
          : relationService.getStationNameById(data.info.stations, s.station_id)
        ).join(', ')
      ].join("\n"))
    );

    return rows.join("\n");
  },
  svgExporter(dom, name) {
    const serializer = new XMLSerializer();
    const xml_str = serializer.serializeToString(dom);

    return saveAs(new Blob([xml_str]),
      `${name}.svg`, { type: "data:image/svg+xml;charset=utf-8" });
  },

};