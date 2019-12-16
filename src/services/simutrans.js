/**
 * @see https://github.com/maxogden/filereader-stream
 */
import fileReaderStream from 'filereader-stream';
/**
 * @see https://github.com/isaacs/sax-js
 */
import sax from 'sax';

import events from 'events';
/**
 * @see https://nodejs.org/api/events.html#events_eventemitter_defaultmaxlisteners
 */
events.EventEmitter.defaultMaxListeners = 334;

import zlib from 'zlib';
import bz2 from 'unbzip2-stream';

import Parsers from './parsers/parsers';
import { SUPPORTED_SAVEFORMATS } from '../const';
export default {
  async parse(file, type, onUpdateProgress) {
    const data = await this.parseContent(file, type, onUpdateProgress);

    if (data.simutrans === undefined) {
      throw new Error('解析できませんでした。');
    }

    this.mergeStationInfo(data);
    this.mergePlayerInfo(data);

    return {
      simutrans: data.simutrans,
      map: data.map,
      stations: data.stations,
      players: data.players,
      lines: data.lines,
    };
  },
  parseContent(file, type, onUpdateProgress) {
    return new Promise((resolved, reject) => {
      const data = {};
      let stream = fileReaderStream(file);

      if (type === SUPPORTED_SAVEFORMATS.xml_zipped) {
        stream = stream.pipe(zlib.Unzip());
      }
      if (type === SUPPORTED_SAVEFORMATS.xml_bzip2) {
        stream = stream.pipe(bz2());
      }

      const parser = this.createParser(resolved, reject, data, onUpdateProgress);

      Parsers.Simutrans.parse(parser, data);
      Parsers.MapInfo.parse(parser, data);
      Parsers.Stations.parse(parser, data);
      Parsers.StationNames.parse(parser, data);
      Parsers.PlayerTypes.parse(parser, data);
      Parsers.Players.parse(parser, data);
      Parsers.PlayerSettings.parse(parser, data);
      Parsers.HaltInfos.parse(parser, data);
      Parsers.Lines.parse(parser, data);

      stream.pipe(parser);
    });
  },
  createParser(resolved, reject, data, onUpdateProgress) {
    const parser = sax.createStream(false, {
      lowercase: true,
      trim: true,
      position: true
    });
    parser.on('error', err => {
      console.log(err);
      reject(err);
    });
    parser.on('end', () => {
      resolved(data);
    });
    parser.on('opentag', () => {
      if (parser._parser.line % 1000000 === 0) {
        onUpdateProgress(`${parseInt(parser._parser.line / 10000)}万行目解析中...`);
      }
    });

    parser.onopenTagName = (tag, cb) => {
      parser.on('opentag', el => {
        if (el.name === tag) {
          cb(el);
        }
      })
    };
    parser.oncloseTagName = (tag, cb) => {
      parser.on('closetag', name => {
        if (name === tag) {
          cb(name);
        }
      })
    };
    return parser;
  },

  // 駅情報に駅名を統合
  mergeStationInfo(data) {
    data.station_names.map(l => {
      this.mergeStationInfoBy(data, l.coordinate, { name: l.name });
    });
    data.stations = data.stations.map(s => {
      if (s.name === undefined) {
        s.name = "";
      }
      return s;
    })
  },
  mergeStationInfoBy(data, coordinate, info) {
    data.stations = data.stations.map(s => {
      const has_coordinate = s.coordinates.findIndex(c => c[0] === coordinate[0] && c[1] === coordinate[1] && c[2] === coordinate[2]) !== -1;
      if (has_coordinate) {
        return Object.assign({}, s, info);
      }
      return s;
    })
  },
  // プレイヤー情報に追加情報を統合
  mergePlayerInfo(data) {
    // プレイヤータイプを統合
    data.players = data.players.map((p, i) => Object.assign(
      { id: i }, p, data.player_types[i]));
    // マップ設定から取得できるプレイヤー情報を統合
    data.players = data.players.map((p, i) => Object.assign(
      { slot: data.player_settings.slot[i] }, p));
  },
}
