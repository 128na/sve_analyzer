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

export default {
  async parse(file) {
    this.init();

    await this.parseContent(file);

    return this.data;
  },
  merge() {
    this.mergeStationInfo();
    this.mergePlayerInfo();

    console.log(this.data);
    return {
      simutrans: this.data.simutrans,
      map: this.data.map,
      stations: this.data.stations,
      players: this.data.players,
      lines: this.data.lines,
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
      lines: [],
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
  parseContent(file) {
    return new Promise((resolved, reject) => {
      const stream = fileReaderStream(file);
      const parser = this.createParser(resolved, reject);

      this.parseSimutrans(parser);
      this.parseMapInfo(parser);
      this.parseStations(parser);
      this.parseStationNames(parser);
      this.parsePlayerTypes(parser);
      this.parsePlayers(parser);
      this.parsePlayerSettings(parser);
      this.parseHaltInfos(parser);
      this.parseLines(parser);
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
  parsePlayerSettings (parser) {
    let is_einstellungen = false;
    let count_einstellungen = 0;
    let count_einstellungen_slot = 0;
    const playerIdToSlot = [];
    this.data.player_settings = {};
    
    parser.onopenTagName('einstellungen_t', () => {
        is_einstellungen = true;
    });
    parser.oncloseTagName('einstellungen_t', () => {
        is_einstellungen = false;
        this.data.player_settings.slot = playerIdToSlot;
    });
    parser.on('text', text => {
        if (is_einstellungen) {
          // console.log(count, text);
          let act = false;
          switch (count_einstellungen) {
            case 70:
            case 72:
            case 74:
            case 76:
            case 78:
            case 80:
            case 82:
            case 84:
            case 86:
            case 88:
            case 90:
            case 92:
            case 94:
            case 96:
            case 98:
            case 100:
            if(parseInt(text, 10) == 1) {
              playerIdToSlot.push(count_einstellungen_slot);
            }
            count_einstellungen_slot++;
            break;
          }
          count_einstellungen++;
        }
    });
  },
  // プレイヤー情報に追加情報を統合
  mergePlayerInfo() {
    // プレイヤータイプを統合
    this.data.players = this.data.players.map((p, i) => Object.assign(
      { id: i }, p, this.data.player_types[i]));
    // マップ設定から取得できるプレイヤー情報を統合
    this.data.players = this.data.players.map((p, i) => Object.assign(
      { slot: this.data.player_settings.slot[i] }, p));
    console.log(this.data.players);
  },
  
  // -----------------------
  // 駅情報 ... 統計情報をとるならこちら
  parseHaltInfos (parser) {
    let halt = {};
    let x, y, z;
    
    let is_halt = false;
    let text_count = 0;
    let is_koord3d = false;
    let koord3d_count = 0;
    let text_koord3d_count = 0;
    
    // 各駅
    let halt_count = 0;
    parser.on('opentag', el => {
        if (el.name === 'haltestelle_t') {
          is_halt = true;
          text_count = 0;
          koord3d_count = 0;
          halt.ground = [];
        }
    });
    parser.on('closetag', name => {
        if (name === 'haltestelle_t') {
          is_halt = false;
          halt_count++;
          halt = {}
        }
    });
    
    
    // ground
      parser.on('opentag', el => {
        if (is_halt) {
          if (el.name === 'koord3d') {
            is_koord3d = true;
            text_koord3d_count = 0;
          }
        }
      });
      parser.on('closetag', name => {
        if (is_halt) {
          if (name === 'koord3d') {
            is_koord3d = false;
            koord3d_count++;
            x = -1;
            y = -1;
            z = -1;
          }
        }
      });
      parser.on('text', text => {
        if (is_halt && is_koord3d) {
          if (text_koord3d_count === 0) {
            x = parseInt(text, 10);
          }
          else if (text_koord3d_count === 1) {
            y = parseInt(text, 10);
          }
          else if (text_koord3d_count === 2) {
            z = parseInt(text, 10);
            
            if ( x != -1 && y != -1 && z != -1 ) {
              // [-1, -1, -1] は除外 おそらくスペーサー
              halt.ground.push([x, y, z]);
              if (koord3d_count === 0) {
                halt.coordinate = [x, y, z];
              }
            }
          }
          text_koord3d_count++;
        }
      });
      
      // owner
      parser.on('text', text => {
        if (is_halt && !is_koord3d) {
          if (text_count === 0) {
            halt.no = parseInt(text, 10);
          }
          else if (text_count === 1) {
            halt.owner = parseInt(text, 10);
          }
          text_count++;
        }
      });
    },
    
  
  // -----------------------
  // 路線情報
  /*lines:[
  {
    id:(int)路線ID,
    player_id:(int)会社ID,
    name:(str)路線名,
    type:(str?int?)鉄道とかの種別
    stops: [[x,y,z], ...],
  },
  ...
  ]*/
  parseLines(parser) {
    let line = {};
    let x, y, z;
    
    
    let text_count = 0;
    let is_koord3d = false;
    let koord3d_count = 0;
    let text_koord3d_count = 0;
    
    // 会社ごと
    let is_player = false;
    let player_count = 0;
    let player_name;
    
    parser.on('opentag', el => {
        if (el.name === 'spieler_t') {
          is_player = true;
          text_count = 0;
          koord3d_count = 0;
        }
    });
    parser.on('closetag', name => {
        if (name === 'spieler_t') {
          is_player = false;
          player_count++;
        }
    });
    
    // 路線ごと
    /*
  <simlinemgmt_t>
   <i32>その会社の路線数</i32>
   <i32>↓の路線のタイプ</i32>
   <simline_t>
    <![CDATA[路線名]]>
    <i16>路線のId</i16>
    <fahrplan_t>
    ...
    </fahrplan_t>
    ...
   </simline_t>
   <i32>↓の路線のタイプ</i32>
   <simline_t>
   </simline_t>
   ...
  </simlinemgmt_t>
    */
    let is_line = false;
    let line_count = 0;
    let test_count_line = 0;
    parser.on('opentag', el => {
        if (el.name === 'simline_t') {
          is_line = true;
          test_count_line = 0;
          koord3d_count = 0;
          line = {}
          line.player_id = player_count;
          line.type = parseInt(latest_text, 10);
          line.stops = [];
        }
    });
    parser.on('closetag', name => {
        if (name === 'simline_t') {
          is_line = false;
          this.data.lines.push(line);
          line_count++;
          line = {};
        }
    });
    // 路線名
    parser.on('cdata', text => {
        if (is_line) {
          line.name = text;
        }
    });
    
    
    let is_linemgmt = false;
    parser.on('opentag', el => {
        if (el.name === 'simlinemgmt_t') {
          is_linemgmt = true;
        }
    });
    parser.on('closetag', name => {
        if (name === 'simlinemgmt_t') {
          is_linemgmt = false;
        }
    });
    // 路線タイプが付与対象lineの取得もと<simline_t>の直前の要素にいる都合
    let latest_text;
    parser.on('text', text => {
        if (!is_line && is_linemgmt) {
          latest_text = text;
        }
        if (is_line && is_linemgmt) {
          latest_text = text;
          if (test_count_line == 0) {
            line.id = parseInt(latest_text, 10);
          }
          test_count_line++;
        }
    });
    
    // 駅
    let is_stop = false;
    let stop_count = 0;
    let text_count_stop = 0;
    parser.on('opentag', el => {
        if (el.name === 'fahrplan_t') {
          is_stop = true;
          text_count_stop = 0;
          koord3d_count = 0;
          line.stops = [];
        }
    });
    parser.on('closetag', name => {
        if (name === 'fahrplan_t') {
          is_stop = false;
          stop_count++;
        }
    });
    // koord3d
    parser.on('opentag', el => {
        if (is_stop) {
          if (el.name === 'koord3d') {
            is_koord3d = true;
            text_koord3d_count = 0;
          }
        }
    });
    parser.on('closetag', name => {
        if (is_stop) {
          if (name === 'koord3d') {
            is_koord3d = false;
            koord3d_count++;
            x = -1;
            y = -1;
            z = -1;
          }
        }
    });
    parser.on('text', text => {
        if (is_stop && is_koord3d) {
          if (text_koord3d_count === 0) {
            x = parseInt(text, 10);
          }
          else if (text_koord3d_count === 1) {
            y = parseInt(text, 10);
          }
          else if (text_koord3d_count === 2) {
            z = parseInt(text, 10);
            
            line.stops.push([x, y, z]);
              
          }
          text_koord3d_count++;
        }
    });
    
  },
  

}
