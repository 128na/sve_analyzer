/**
 * @see https://github.com/maxogden/filereader-stream
 */
import fileReaderStream from 'filereader-stream';
/**
 * @see https://github.com/isaacs/sax-js
 */
import sax from 'sax';

export default {
  async parse(file) {
    this.init();

    // リスナ数上限があるので適度に分けてみる
    await this.parseContentPhase1(file);
    await this.parseContentPhase2(file);

    return this.data;
  },
  merge() {
    this.mergeStationInfo();
    this.mergePlayerInfo();

    return {
      simutrans: this.data.simutrans,
      map: this.data.map,
      stations: this.data.stations,
      players: this.data.players,
    };
  },
  data: null,
  init() {
    this.data = {
      simutrans: {},
      map: {},
      stations: [],
      stations_names: [],
      player_types: [],
      players: [],
    }
  },
  createParser(resolved, reject) {
    const parser = sax.createStream(false, {
      lowercase: true,
      trim: true,
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
    return parser;
  },
  parseContentPhase1(file) {
    return new Promise((resolved, reject) => {
      const stream = fileReaderStream(file);
      const parser = this.createParser(resolved, reject);

      this.parseSimutrans(parser);
      this.parseMapInfo(parser);
      this.parseStations(parser);
      this.parseStationNames(parser);
      stream.pipe(parser);
    });
  },
  parseContentPhase2(file) {
    return new Promise((resolved, reject) => {
      const stream = fileReaderStream(file);
      const parser = this.createParser(resolved, reject);

      this.parsePlayerTypes(parser);
      this.parsePlayers(parser);
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
          console.log('add named bulding');
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
  // 駅情報に駅名を統合
  mergeStationInfo() {
    this.data.stations_names.map(l => {
      this.mergeStationInfoBy(l.coordinate, { name: l.name });
    });
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
  // プレイヤータイプ
  parsePlayerTypes(parser) {
    let is_setting = false;
    let is_players = false;
    let is_player = false;
    parser.onopenTagName('einstellungen_t', () => {
      is_setting = true;
    });
    parser.oncloseTagName('einstellungen_t', () => {
      is_setting = false;
    });
    parser.on('cdata', text => {
      if (is_setting && text === 'ja') {
        is_players = true;
      }
    });
    parser.onopenTagName('i8', () => {
      if (is_players) {
        is_player = true;
      }
    });
    parser.oncloseTagName('i8', () => {
      if (is_players) {
        is_player = false;
      }
    });

    parser.on('text', text => {
      if (is_players && is_player) {
        console.log('add player type');
        this.data.player_types.push({ type: parseInt(text, 10) });
        if (this.data.player_types.length >= 16) {
          is_players = false;
        }
      }
    })
  },
  // プレイヤー情報
  parsePlayers(parser) {
    let is_player = false;
    let is_line = false;
    let player = {};
    parser.onopenTagName('spieler_t', () => {
      is_player = true;
    });
    parser.oncloseTagName('spieler_t', () => {
      is_player = false;
      this.data.players.push(player);
      player = {};
    });
    parser.onopenTagName('simline_t', () => {
      is_line = true;
    });
    parser.oncloseTagName('simline_t', () => {
      is_line = false;
    });

    parser.on('cdata', text => {
      if (is_player && !is_line) {
        player.name = text;
      }
    });


  },
  // プレイヤー情報にプレイヤータイプを統合
  mergePlayerInfo() {
    this.data.players = this.data.players.map((p, i) => Object.assign(
      { id: i }, p, this.data.player_types[i]));
  },
}