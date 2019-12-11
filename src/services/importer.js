import { resolve } from "any-promise";

export default {
  async importFrom(file) {
    const text = await this.getFileContent(file);
    return JSON.parse(text);
  },
  getFileContent(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = err => {
        console.log(err)
        reject(e);
      };
      reader.onload = e => {
        resolve(e.target.result);
      };
      reader.readAsText(file);
    });
  }
}