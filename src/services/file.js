import { STATUSES } from '../const';

export default {
  getFileInfo(file) {
    return {
      name: file.name,
      size: file.size
    }
  },
}