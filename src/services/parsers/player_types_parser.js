export default {

  // プレイヤータイプ
  parse(parser, result) {
    result.player_types = [];
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
        result.player_types.push({ type: parseInt(text, 10) });
        if (result.player_types.length >= 16) {
          is_players = false;
        }
      }
    })
  },
}