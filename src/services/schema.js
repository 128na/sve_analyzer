import schema_v1 from '../schemas/v1.json';
import schema_v1_2 from '../schemas/v1.2.json';

export default {
  get(version) {
    if (version >= '1.2') {
      return schema_v1_2;
    }

    return schema_v1;
  }
}