import { STATUSES } from '../const';

export default {
  getFileInfo(file) {
    return {
      name: file.name,
      size: file.size
    }
  },
  parseToXML(file, onParsed, onStatusChange = null) {
    onStatusChange = onStatusChange || function () { };
    const reader = new FileReader()
    reader.onabort = e => {
      console.warn(e);
      onStatusChange(STATUSES.file_abort);
    };
    reader.onerror = e => {
      console.warn(e);
      onStatusChange(STATUSES.file_error);
    };
    reader.onloadstart = e => {
      onStatusChange(STATUSES.file_start);
    };
    reader.onprogress = e => {
      onStatusChange(STATUSES.file_progress(e));
    };
    reader.onload = e => {
      onStatusChange(STATUSES.xml_start);
      const parser = new DOMParser();
      const xml = parser.parseFromString(e.target.result, "text/xml");
      onStatusChange(STATUSES.xml_end);
      onParsed(xml);
    };

    reader.readAsText(file);
  },
}