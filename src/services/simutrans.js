import sax from 'sax';

import events from 'events';
/**
 * @see https://nodejs.org/api/events.html#events_eventemitter_defaultmaxlisteners
 */
events.EventEmitter.defaultMaxListeners = 334;

import Parsers from './parsers/parsers';
import { SAVEFORMATS, COMPRESS_FORMATS } from '../const';
import { jpNumberFromat } from '../helper';

import fileService from './file';
import relationService from './relation';
export default {
  async parse(file, type, onUpdateProgress) {
    const data = await this.parseContent(file, type, onUpdateProgress);

    if (data.simutrans === undefined) {
      throw new Error('解析できませんでした。');
    }

    this.mergeStationInfo(data);
    this.mergePlayerInfo(data);
    this.mergeStationIdToLines(data);

    return {
      simutrans: data.simutrans,
      map: data.map,
      stations: data.stations,
      players: data.players,
      lines: data.lines,
    };
  },
  parseContent(file, format, onUpdateProgress) {
    return new Promise((resolved, reject) => {
      const data = {};
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

      fileService.createStream(file, format).pipe(parser);
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
        onUpdateProgress(`${jpNumberFromat(parser._parser.line)}行目解析中...`);
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

  // 路線の停車座標に駅IDを追加する
  mergeStationIdToLines(data) {
    data.lines.map(line => {
      line.stops = line.stops.map(stop => {
        return {
          station_id: relationService.getStationIdByCoodrinate(data.stations, stop),
          coordinate: stop
        };
      });
      return line;
    })
  },

}
