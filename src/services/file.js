import fileReaderStream from 'filereader-stream';
/**
 * @see https://www.npmjs.com/package/file-type-stream
 */
import fileTypeStream from 'file-type-stream';
export default {

  getFileInfo(file) {
    return {
      name: file.name,
      size: file.size
    }
  },
  getMimeType(file) {

    return new Promise((resolve, reject) => {
      const stream = fileReaderStream(file);

      stream.pipe(fileTypeStream(type => {
        if (type) {
          resolve(type.ext);
        } else {
          reject();
        }
        stream.destroy();
      }));
    });
  }
}