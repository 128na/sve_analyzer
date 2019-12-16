import fileReaderStream from 'filereader-stream';
/**
 * @see https://www.npmjs.com/package/file-type-stream
 */
import fileTypeStream from 'file-type-stream';
import { SUPPORTED_SAVEFORMATS } from '../const.js';
export default {

  getFileInfo(file) {
    return {
      name: file.name,
      size: file.size
    }
  },
  getFormat(file) {
    return new Promise((resolve, reject) => {
      const stream = fileReaderStream(file);

      stream.pipe(fileTypeStream(type => {
        if (type) {
          switch (type.mime) {
            case 'application/x-bzip2':
              resolve(SUPPORTED_SAVEFORMATS.xml_bzip2);
              break;
            case 'application/gzip':
              resolve(SUPPORTED_SAVEFORMATS.xml_zipped);
              break;
          }
        } else {
          resolve(SUPPORTED_SAVEFORMATS.xml);
        }
        stream.destroy();
      }));
    });
  }
}