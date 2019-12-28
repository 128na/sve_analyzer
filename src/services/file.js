/**
 * @see https://github.com/maxogden/filereader-stream
*/
import fileReaderStream from 'filereader-stream';
/**
 * @see https://www.npmjs.com/package/file-type-stream
 */
import fileTypeStream from 'file-type-stream';
import { SAVEFORMATS, COMPRESS_FORMATS } from '../const.js';
import zlib from 'zlib';
import bz2 from 'unbzip2-stream';

const XML_HEADER = '<?xml version="1.0"?>';

export default {

  getFileInfo(file) {
    return {
      name: file.name,
      size: file.size
    }
  },
  async getFormat(file) {
    const compress_format = await this.getCompressFormat(file);
    console.log('compress_format', compress_format);
    const is_xml = await this.isXml(file, compress_format);
    console.log('is_xml', is_xml);

    switch (compress_format) {
      case COMPRESS_FORMATS.zipped:
        return is_xml ? SAVEFORMATS.xml_zipped : SAVEFORMATS.zipped;
      case COMPRESS_FORMATS.bzip2:
        return is_xml ? SAVEFORMATS.xml_bzip2 : SAVEFORMATS.bzip2;
      case COMPRESS_FORMATS.raw:
        return is_xml ? SAVEFORMATS.xml : SAVEFORMATS.binary;
    }
  },
  createStream(file, format = null, chunkSize = 1024 * 1024) {
    let stream = fileReaderStream(file, { chunkSize });

    if ([COMPRESS_FORMATS.zipped, SAVEFORMATS.xml_zipped, SAVEFORMATS.zipped].includes(format)) {
      return stream.pipe(zlib.Unzip());
    }
    if ([COMPRESS_FORMATS.bzip2, SAVEFORMATS.xml_bzip2, SAVEFORMATS.bzip2].includes(format)) {
      return stream.pipe(bz2());
    }
    console.log(stream);
    return stream;
  },
  getCompressFormat(file) {
    return new Promise((resolve, reject) => {
      const stream = this.createStream(file);

      stream.pipe(fileTypeStream(type => {
        if (type) {
          switch (type.mime) {
            case 'application/x-bzip2':
              resolve(COMPRESS_FORMATS.bzip2);
              break;
            case 'application/gzip':
              resolve(COMPRESS_FORMATS.zipped);
              break;
          }
        } else {
          resolve(COMPRESS_FORMATS.raw);
        }
        stream.destroy();
      }));
    });
  },
  isXml(file, format) {
    return new Promise((resolve, reject) => {
      const stream = this.createStream(file, format, 100);
      stream.on('data', chunk => {
        resolve(chunk.toString().includes(XML_HEADER));
        stream.destroy();
      }).on('error', err => { });
    });
  }
}