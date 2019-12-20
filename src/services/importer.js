import validation from './validation';
export default {
  async importFrom(file) {
    const text = await this.getFileContent(file);
    const parsed = JSON.parse(text);

    validation.validate(parsed);

    return parsed;
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