export default {
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
  parse(parser, result) {
    result.lines = [];
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
        result.lines.push(line);
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