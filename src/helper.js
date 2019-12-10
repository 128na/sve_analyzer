const prefixes = ['B', 'KB', 'MB', 'GB', 'TB'];
const sizeFromat = function (number) {
  const order = parseInt(Math.log10(number) / 3, 10);
  const intl = new Intl.NumberFormat('ja', { maximumFractionDigits: 1 });
  return `${intl.format(number / 2 ** (10 * order))} ${prefixes[order]}`;
};
const escCSV = function (txt = '') {
  txt = txt.replace("\"", "\"\"");
  txt = txt.replace("\\", "\\\\");
  return `"${txt}"`;
};

export { sizeFromat, escCSV };
