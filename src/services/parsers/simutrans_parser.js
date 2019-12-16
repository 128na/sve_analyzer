export default {
  // Simutrans情報
  parse(parser, result) {
    parser.onopenTagName('simutrans', el => {
      console.log('add simutrans');
      result.simutrans = {
        version: el.attributes.version,
        pak: el.attributes.pak
      };
    });
  },
}