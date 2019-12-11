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
    data.app = { version: process.env.VUE_APP_VERSION };

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
    return saveAs(new Blob([JSON.stringify(data)]),
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
    return saveAs(new Blob([this.toText(data)]),
      `${name}.txt`, { type: "text/plain;charset=utf-8" });
  },
  toCSV(data) {
    let rows = [];

    rows.push(['[App Info]']);
    rows.push(['version', escCSV(data.app.version)]);
    rows.push(['']);
    rows.push(['[File Info]']);
    rows.push(['name', escCSV(data.file.name)]);
    rows.push(['size', escCSV(data.file.size)]);
    rows.push(['']);
    rows.push(['[Map Info]']);
    rows.push(['No', escCSV(data.info.map.no)]);
    rows.push(['width', escCSV(data.info.map.width)]);
    rows.push(['depth', escCSV(data.info.map.depth)]);
    rows.push(['']);
    rows.push(['[Simutrans Info]']);
    rows.push(['version', escCSV(data.info.simutrans.version)]);
    rows.push(['pak', escCSV(data.info.simutrans.pak)]);
    rows.push(['']);
    rows.push(['[Player Info]']);
    rows.push(['id', 'name', 'type']);
    rows = rows.concat(data.info.players.map(p => [escCSV(p.id), escCSV(p.name), escCSV(p.type)]));
    rows.push(['']);
    rows.push(['[Station Info]']);
    rows.push(['id', 'name', 'player_id', 'tiles']);
    rows = rows.concat(data.info.stations.map(s => [escCSV(s.id), escCSV(s.name), escCSV(s.player_id), escCSV(s.coordinates.length)]));

    return rows.map(r => r.join(',')).join("\n");
  },
  toText(data) {
    let rows = [];

    rows.push('[App Info]');
    rows.push('version: ' + data.app.version);
    rows.push('');
    rows.push('[File Info]');
    rows.push('name: ' + data.file.name);
    rows.push('size: ' + data.file.size);
    rows.push('');
    rows.push('[Map Info]');
    rows.push('No: ' + data.info.map.no);
    rows.push('width: ' + data.info.map.width);
    rows.push('depth: ' + data.info.map.depth);
    rows.push('');
    rows.push('[Simutrans Info]');
    rows.push('version: ' + data.info.simutrans.version);
    rows.push('pak: ' + data.info.simutrans.pak);
    rows.push('');
    rows.push('[Player Info]');
    rows = rows.concat(data.info.players.map(p => p.name));
    rows.push('');
    rows.push('[Station Info]');
    rows = rows.concat(data.info.stations.map(s => s.name));

    return rows.join("\n");
  },
};