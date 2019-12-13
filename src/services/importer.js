export default {
  async importFrom(file) {
    const text = await this.getFileContent(file);
    const parsed = JSON.parse(text);

    this.validateStructure(parsed)

    return parsed;
  },
  validateStructure(obj) {
    if (obj && obj.file && obj.app && obj.info) {
      return;
    }
    throw new Error('invalid structure');
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