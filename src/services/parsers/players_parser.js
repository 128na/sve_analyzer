export default {

  // プレイヤー情報
  parse(parser, result) {
    result.players = [];
    let is_player = false;
    let is_line = false;
    let player = {};
    parser.onopenTagName('spieler_t', () => {
      is_player = true;
    });
    parser.oncloseTagName('spieler_t', () => {
      is_player = false;
      result.players.push(player);
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
}