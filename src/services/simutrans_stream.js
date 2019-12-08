/**
 * @see https://github.com/maxogden/filereader-stream
 */
import fileReaderStream from 'filereader-stream';
/**
 * @see https://github.com/isaacs/sax-js
 */
import sax from 'sax';
import { STATUSES } from '../const';

export default {
  async parse(file, onParseData, onStatusChange) {
    if (typeof onParseData !== 'function') {
      throw "onParseData is not function!";
    }
    if (typeof onStatusChange !== 'function') {
      throw "onStatusChange is not function!";
    }

    onStatusChange(STATUSES.PARSE_SIMUTRANS)
    onParseData('simutrans', await this.parseSimutrans(file));

    onStatusChange(STATUSES.PARSE_MAP_INFO)
    const map = await this.parseMapInfo(file);
    onParseData('map', map);

    onStatusChange(STATUSES.PARSE_STATIONS)
    const stations = await this.parseStations(file);
    onStatusChange(STATUSES.PARSE_STATION_NAMES)
    const names = await this.parseStationNames(file, map.width);
    onStatusChange(STATUSES.MERGE_STATION_NAMES)
    onParseData('stations', this.mergeStationNames(stations, names));

    onStatusChange(STATUSES.FINISHED)
  },
  contentParser(file, parseAction) {
    return new Promise((resolved, reject) => {
      const stream = fileReaderStream(file);
      const parser = sax.createStream(false, {
        lowercase: true,
        trim: true,
        position: true,
      });
      parser.on('error', err => {
        console.log(err);
        reject(err);
      });
      parseAction({ stream, parser, resolved, reject });
      stream.pipe(parser);
    });
  },
  // Simutrans情報
  parseSimutrans(file) {
    return this.contentParser(file, ({ stream, parser, resolved }) => {
      parser.on('opentag', el => {
        if (el.name === 'simutrans') {
          resolved({
            version: el.attributes.version,
            pak: el.attributes.pak
          });
          stream.destroy();
        }
      });
    });
  },
  // マップ情報
  parseMapInfo(file) {
    return this.contentParser(file, ({ stream, parser, resolved }) => {
      let capture = false;
      let count = 0;
      const data = {};

      parser.on('opentag', el => {
        if (el.name === 'einstellungen_t') {
          // console.log('capture on');
          capture = true;
        }
      });
      parser.on('closetag', name => {
        if (name === 'einstellungen_t') {
          // console.log('capture off');
          capture = false;
        }
      });
      parser.on('text', text => {
        if (capture) {
          // console.log(count, text);
          switch (count) {
            case 0:
              data.width = parseInt(text, 10);
              break;
            case 1:
              data.no = parseInt(text, 10);
              break;
            case 13:
              data.depth = parseInt(text, 10);
              resolved(data);
              stream.destroy();
              break;
          }
          count++;
        }
      });
    });
  },
  // 駅情報
  parseStations(file) {
    return this.contentParser(file, ({ stream, parser, resolved }) => {
      const stations = [];

      let is_station = false;
      let count = 0;
      let station = { coordinates: [] };

      parser.on('opentag', el => {
        if (el.name === 'haltestelle_t') {
          // console.log('is_station on');
          is_station = true;
          station = { coordinates: [] };
        }
      });
      parser.on('closetag', name => {
        if (name === 'haltestelle_t') {
          // console.log('is_station off');
          is_station = false;
          stations.push(station);
          count = 0;
        }
      });
      parser.on('text', text => {
        if (is_station) {
          switch (count) {
            case 0:
              station.id = parseInt(text, 10);
              break;
            case 1:
              station.player_id = parseInt(text, 10);
              break;
          }
          count++;
        }
      });

      let is_coordinate = false;
      let coordinate = [];

      parser.on('opentag', el => {
        if (is_station && el.name === 'koord3d') {
          // console.log('is_coordinate on');
          is_coordinate = true;
          coordinate = [];
        }
      });
      parser.on('closetag', name => {
        if (is_station && name === 'koord3d') {
          // console.log('is_coordinate off');
          is_coordinate = false;
          if (!(coordinate[0] === -1 && coordinate[1] === -1 && coordinate[2] === -1)) {
            station.coordinates.push(coordinate);
          }
        }
      });
      parser.on('text', text => {
        if (is_station && is_coordinate) {
          coordinate.push(parseInt(text, 10));
        }
      });
      parser.on('end', () => {
        resolved(stations);
      });
    });
  },
  // 駅名
  parseStationNames(file, width) {
    const stations = [];
    let station = {};
    let x, y, z;
    return this.contentParser(file, ({ stream, parser, resolved }) => {
      let is_place = false;
      let place_count = 0;
      parser.on('opentag', el => {
        if (el.name === 'planquadrat_t') {
          is_place = true;
          x = place_count % width
          y = Math.floor(place_count / width)

          place_count++;
        }
      });
      parser.on('closetag', name => {
        if (name === 'planquadrat_t') {
          is_place = false;
          x = 0;
          y = 0;
        }
      });

      let is_ground = false;
      let ground_count = 0;
      let has_buiding = false
      parser.on('opentag', el => {
        if (is_place && el.name === 'grund_t') {
          is_ground = true;
          ground_count = 0;
        }
      });
      parser.on('closetag', name => {
        if (is_place && name === 'grund_t') {
          is_ground = false;
          if (has_buiding && station.name && station.coordinate) {
            stations.push(station);
          }
          station = {};
          has_buiding = false;
          z = 0;
        }
      });

      parser.on('opentag', el => {
        if (is_ground && el.name === 'gebaeude_t') {
          has_buiding = true;
        }
      });

      parser.on('cdata', text => {
        if (is_place && is_ground) {
          if (ground_count === 3) {
            station.name = text;
          }
        }
      });
      parser.on('text', text => {
        if (is_place && is_ground) {
          if (ground_count === 0) {
            z = parseInt(text, 10);
            station.coordinate = [x, y, z];
          }
          ground_count++;
        }
      });

      parser.on('end', () => {
        resolved(stations);
      });
    });
  },
  // 駅名を駅情報に統合
  mergeStationNames(stations, labels) {
    labels.map(l => {
      stations = this.mergeStationInfoBy(stations, l.coordinate, { name: l.name });
    });
    return stations;
  },
  mergeStationInfoBy(stations, coordinate, info) {
    return stations.map(s => {
      const has_coordinate = s.coordinates.findIndex(c => c[0] === coordinate[0] && c[1] === coordinate[1] && c[2] === coordinate[2]) !== -1;
      if (has_coordinate) {
        return Object.assign({}, s, info);
      }
      return s;
    })
  },
  getPlayers(xml) {
    const begin_player = [...xml.querySelector("einstellungen_t").childNodes].findIndex(n => n.textContent === 'ja');
    const players = [...Array(16)].map((_, i) => begin_player + 2 * (i + 1))
      .map(no => {
        return {
          // 0 non active, 1 user, 2:AI freight, 3:AI passenger ,4:scripted AI
          type: parseInt(xml.querySelector("einstellungen_t").childNodes.item(no).textContent, 10)
        }
      });
    [...xml.querySelectorAll("spieler_t")]
      .map((p, index) => {
        players[index].name = p.childNodes.item(p.childNodes.length - 2).textContent
      });
    return players;
  },
}