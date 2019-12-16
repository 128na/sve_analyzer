export default {
  // -----------------------
  // 駅情報 ... 統計情報をとるならこちら
  parse(parser, result) {
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

          if (x != -1 && y != -1 && z != -1) {
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

}