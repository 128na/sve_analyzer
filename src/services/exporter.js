import { saveAs } from 'file-saver';
import Encoding from 'encoding-japanese';
import { escCSV } from "../helper";
export default {
  getFormats() {
    return [
      { text: "JSON", value: "json" },
      { text: "CSV", value: "csv" },
      { text: "テキスト", value: "txt" },
    ];
  },
  download({ type, data, name }) {
    switch (type) {
      case 'json':
        return this.jsonExporter(data, name);
      case 'csv':
        return this.csvExporter(data, name);
      case 'txt':
      default:
        return this.textExporter(data, name);
    }
  },
  jsonExporter(data, name) {
    return saveAs(
      new Blob([JSON.stringify(data)]),
      `${name}.json`, { type: "data:application/json;charset=utf-8" });
  },
  csvExporter(data, name) {
    // sjis変換
    const unicode_arr = [...this.toCSV(data)].map(str => str.charCodeAt(0));
    const converted_arr = Encoding.convert(unicode_arr, 'SJIS', 'unicode');
    const sjis_arr = new Uint8Array(converted_arr);

    return saveAs(new Blob([sjis_arr]),
      `${name}.csv`, { type: "data:text/csv;charset=sjis" });
  },
  textExporter(data, name) {
    return saveAs(
      new Blob([this.toText(data)]),
      `${name}.txt`, { type: "text/plain;charset=utf-8" });
  },
  toCSV(data) {
    let rows = [];

    rows.push(['[Map Info]']);
    rows.push(['No', data.map.no]);
    rows.push(['width', data.map.width]);
    rows.push(['depth', data.map.depth]);
    rows.push(['[Simutrans Info]']);
    rows.push(['version', escCSV(data.simutrans.version)]);
    rows.push(['pak', escCSV(data.simutrans.pak)]);
    rows.push(['[Player Info]']);
    rows.push(['id', 'name', 'type']);
    rows = rows.concat(data.players.map(p => [p.id, escCSV(p.name), escCSV(p.type)]));
    rows.push(['[Station Info]']);
    rows.push(['id', 'name', 'player_id', 'tiles']);
    rows = rows.concat(data.stations.map(s => [s.id, escCSV(s.name), s.player_id, s.coordinates.length]));

    return rows.map(r => r.join(',')).join("\n");
  },
  toText(data) {
    let rows = [];

    rows.push('[Map Info]');
    rows.push('No: ' + data.map.no);
    rows.push('width: ' + data.map.width);
    rows.push('depth: ' + data.map.depth);
    rows.push('[Simutrans Info]');
    rows.push('version: ' + data.simutrans.version);
    rows.push('pak: ' + data.simutrans.pak);
    rows.push('[Player Info]');
    rows = rows.concat(data.players.map(p => p.name));
    rows.push('[Station Info]');
    rows = rows.concat(data.stations.map(s => s.name));

    return rows.join("\n");
  },
};