export default {
  // 駅名
  parse(parser, result) {
    result.station_names = [];
    let station = {};
    let x, y, z;

    let is_place = false;
    let place_count = 0;
    parser.on('opentag', el => {
      if (el.name === 'planquadrat_t') {
        is_place = true;
        x = place_count % result.map.width
        y = Math.floor(place_count / result.map.width)

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
          result.station_names.push(station);
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
}