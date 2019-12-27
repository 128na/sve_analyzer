export default {

  // プレイヤー情報
  parse(parser, result) {
    result.players = [];
    let is_player = false;
    let is_line = false;
    let player = {};
    let text_count = 0;
    parser.onopenTagName('spieler_t', () => {
      is_player = true;
      text_count = 0;
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

    parser.on('text', text => {
      if (is_player && !is_line) {
        switch (text_count) {
          // player/simplay.h
          // class player_t の変数としては uint8 player_color_1, player_color_2;
          case 0:
            player.color_1 = parseInt(text, 10); // 基調色
            break;
          case 1:
            player.color_2 = parseInt(text, 10); // 補助色
            break;
        }
        text_count++;
      }
    });

  },
}
