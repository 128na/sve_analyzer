import Ajv from 'ajv';
import schema from '../schema.json';

export default {
  async importFrom(file) {
    const text = await this.getFileContent(file);
    const parsed = JSON.parse(text);

    this.validateStructure(parsed)

    return parsed;
  },
  validateStructure(obj) {
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(schema);
    const valid = validate(obj);

    if (!valid) {
      throw new Error(validate.errors.map(e => e.message).join("\n"));
    }
  },
  getFileContent(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = err => {
        reject(e);
      };
      reader.onload = e => {
        resolve(e.target.result);
      };
      reader.readAsText(file);
    });
  }
}