export default {

  // 駅情報
  parse(parser, result) {
    result.stations = [];
    let is_station = false;
    let count = 0;
    let station = { coordinates: [] };

    let is_coordinate = false;
    let coordinate = [];

    parser.onopenTagName('haltestelle_t', () => {
      is_station = true;
      station = { coordinates: [] };
    });
    parser.oncloseTagName('haltestelle_t', () => {
      is_station = false;
      result.stations.push(station);
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
        is_coordinate = true;
        coordinate = [];
      }
    });
    parser.oncloseTagName('koord3d', () => {
      if (is_station) {
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
}