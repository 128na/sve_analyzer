export default {
  // マップ情報
  parse(parser, result) {
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
            result.map = data;
            break;
        }
        count++;
      }
    });
  },
}