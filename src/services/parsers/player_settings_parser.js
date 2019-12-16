export default {

  parse(parser, result) {
    let is_einstellungen = false;
    let count_einstellungen = 0;
    let count_einstellungen_slot = 0;
    const playerIdToSlot = [];
    result.player_settings = {};

    parser.onopenTagName('einstellungen_t', () => {
      is_einstellungen = true;
    });
    parser.oncloseTagName('einstellungen_t', () => {
      is_einstellungen = false;
      result.player_settings.slot = playerIdToSlot;
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
            if (parseInt(text, 10) == 1) {
              playerIdToSlot.push(count_einstellungen_slot);
            }
            count_einstellungen_slot++;
            break;
        }
        count_einstellungen++;
      }
    });
  },
}