export default {
  // Simutrans情報
  parse(parser, result) {
    parser.onopenTagName('simutrans', el => {
      result.simutrans = {
        version: el.attributes.version,
        pak: el.attributes.pak
      };
    });
  },
}