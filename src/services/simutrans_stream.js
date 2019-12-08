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
  async parse(file, onParseFragment, onStatusChange) {
    onStatusChange(STATUSES.parseSimutrans)
    onParseFragment('simutrans', await this.parseSimutrans(file));
    onStatusChange(STATUSES.parseMapInfo)
    onParseFragment('map', await this.parseMapInfo(file));
    onStatusChange(STATUSES.parseStations)
    onParseFragment('stations', await this.parseStations(file));
    onStatusChange(STATUSES.finished)
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

      let capture_station = false;
      let count = 0;
      let station = { coordinates: [] };

      parser.on('opentag', el => {
        if (el.name === 'haltestelle_t') {
          // console.log('capture_station on');
          capture_station = true;
          station = { coordinates: [] };
        }
      });
      parser.on('closetag', name => {
        if (name === 'haltestelle_t') {
          // console.log('capture_station off');
          capture_station = false;
          stations.push(station);
          count = 0;
        }
      });
      parser.on('text', text => {
        if (capture_station) {
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

      let capture_coordinate = false;
      let coordinate = [];

      parser.on('opentag', el => {
        if (capture_station && el.name === 'koord3d') {
          // console.log('capture_coordinate on');
          capture_coordinate = true;
          coordinate = [];
        }
      });
      parser.on('closetag', name => {
        if (capture_station && name === 'koord3d') {
          // console.log('capture_coordinate off');
          capture_coordinate = false;
          if (!(coordinate[0] === -1 && coordinate[1] === -1 && coordinate[2] === -1)) {
            station.coordinates.push(coordinate);
          }
        }
      });
      parser.on('text', text => {
        if (capture_station && capture_coordinate) {
          coordinate.push(parseInt(text, 10));
        }
      });
      parser.on('end', () => {
        resolved(stations);
      });
    });
  },
  /**
   * 各駅の座標一覧に駅情報をマージする
   */
  mergeStationInfo(stations, xml) {
    const width = xml.querySelector("einstellungen_t").childNodes.item(0).textContent;

    /**
     * 個々の要素はインデックスから算出する必要があるためフィルタせずに全ての座標をパースする
     */
    [...xml.querySelectorAll("planquadrat_t")]
      .map((n, index) => {
        const x = index % width;
        const y = Math.floor(index / width);
        // マス内の各高さで名前のついているもの
        [...n.querySelectorAll('grund_t')]
          .filter(ground_t => ground_t.childNodes.item(3).textContent)
          .map(ground_t => {
            const z = parseInt(ground_t.firstChild.textContent, 10);
            const coordinate = [x, y, z];

            const obj_t = ground_t.querySelector('obj_t');
            const player_id = parseInt(obj_t.childNodes.item(2).textContent, 10);
            const info = {
              name: ground_t.childNodes.item(3).textContent,
            };

            stations = this.mergeStationInfoBy(stations, coordinate, player_id, info);
          })
      });
    return stations;
  },
  mergeStationInfoBy(stations, coordinate, player_id, info) {
    return stations.map(s => {
      const has_coordinate = s.coordinates.findIndex(c => c[0] === coordinate[0] && c[1] === coordinate[1] && c[2] === coordinate[2]) !== -1;
      const match_player_id = s.player_id === player_id;
      if (has_coordinate && match_player_id) {
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