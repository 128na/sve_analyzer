/**
 * @see https://github.com/epoberezkin/ajv
 */
import Ajv from 'ajv';
import schema from './schema';

export default {
  validate(obj) {
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(schema.get(obj.app.version));
    const valid = validate(obj);

    if (!valid) {
      throw new Error(validate.errors.map(e => e.message).join("\n"));
    }
  },
}