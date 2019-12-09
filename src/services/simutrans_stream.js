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
  async parse(file, onStatusChange) {
    if (typeof onStatusChange !== 'function') {
      throw "onStatusChange is not function!";
    }

    await onStatusChange(STATUSES.PARSE_START);
    await this.parseContent(file);
    await onStatusChange(STATUSES.PARSE_FINISHED);

    await onStatusChange(STATUSES.MERGE_START);
    this.mergeStationInfo();
    await onStatusChange(STATUSES.MERGE_FINISHED);

    return this.data;
  },
  data: {
    simutrans: {},
    map: {},
    stations: [],
    stations_names: [],
    players: [],
  },
  parseContent(file) {
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
      parser.on('end', () => {
        resolved(this.data);
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
      this.parseSimutrans(parser);
      this.parseMapInfo(parser);
      this.parseStations(parser);
      this.parseStationNames(parser);
      stream.pipe(parser);
    });
  },
  // Simutrans情報
  parseSimutrans(parser) {
    parser.onopenTagName('simutrans', el => {
      console.log('add simutrans');
      this.data.simutrans = {
        version: el.attributes.version,
        pak: el.attributes.pak
      };
    });
  },
  // マップ情報
  parseMapInfo(parser) {
    let capture = false;
    let count = 0;
    const data = {};

    parser.onopenTagName('einstellungen_t', () => {
      // console.log('capture on');
      capture = true;
    });
    parser.oncloseTagName('einstellungen_t', () => {
      // console.log('capture off');
      capture = false;
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
            console.log('add map');
            this.data.map = data;
            break;
        }
        count++;
      }
    });
  },
  // 駅情報
  parseStations(parser) {
    let is_station = false;
    let count = 0;
    let station = { coordinates: [] };

    let is_coordinate = false;
    let coordinate = [];

    parser.onopenTagName('haltestelle_t', () => {
      // console.log('is_station on');
      is_station = true;
      station = { coordinates: [] };
    });
    parser.oncloseTagName('haltestelle_t', () => {
      // console.log('is_station off');
      is_station = false;
      console.log('add station');
      this.data.stations.push(station);
      count = 0;
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

    parser.onopenTagName('koord3d', () => {
      if (is_station) {
        // console.log('is_coordinate on');
        is_coordinate = true;
        coordinate = [];
      }
    });
    parser.oncloseTagName('koord3d', () => {
      if (is_station) {
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
  },
  // 駅名
  parseStationNames(parser) {
    let station = {};
    let x, y, z;

    let is_place = false;
    let place_count = 0;
    parser.on('opentag', el => {
      if (el.name === 'planquadrat_t') {
        is_place = true;
        x = place_count % this.data.map.width
        y = Math.floor(place_count / this.data.map.width)

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
          console.log('add station name');
          this.data.stations_names.push(station);
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
  },
  // 駅名を駅情報に統合
  mergeStationInfo() {
    this.data.stations_names.map(l => {
      this.mergeStationInfoBy(l.coordinate, { name: l.name });
    });
    this.data.stations_names = [];
  },
  mergeStationInfoBy(coordinate, info) {
    this.data.stations = this.data.stations.map(s => {
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