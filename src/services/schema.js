import schema_v1 from '../schemas/v1.json';

export default {
  get(version) {
    // console.log('app version : ', version);

    return schema_v1;
  }
}