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
  async parse(file, type) {
    const data = await this.parseContent(file, type);
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
  createParser(resolved, reject, data) {
    const parser = sax.createStream(false, {
      lowercase: true,
      trim: true,
    });
    parser.on('error', err => {
      console.log(err);
      reject(err);
    });
    parser.on('end', () => {
      resolved(data);
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
  parseContent(file, type) {
    return new Promise((resolved, reject) => {
      const data = {};
      let stream = fileReaderStream(file);

      if (type === SUPPORTED_SAVEFORMATS.xml_zipped) {
        stream = stream.pipe(zlib.Unzip());
      }
      if (type === SUPPORTED_SAVEFORMATS.xml_bzip2) {
        stream = stream.pipe(bz2());
      }

      const parser = this.createParser(resolved, reject, data, type);

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
