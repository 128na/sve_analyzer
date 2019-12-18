const si_prefixes = ['', 'K', 'M', 'G', 'T'];
const siNumberFromat = function (number) {
  const order = parseInt(Math.log10(number) / 3, 10);
  const intl = new Intl.NumberFormat('ja', { maximumFractionDigits: 1 });
  return `${intl.format(number / 2 ** (10 * order))} ${si_prefixes[order]}`;
};

const jp_prefixes = ['', '万', '億', '兆'];
const jpNumberFromat = function (number) {
  const order = parseInt(Math.log10(number) / 4, 10);
  const intl = new Intl.NumberFormat('ja', { maximumFractionDigits: 1 });
  return `${intl.format(number / (10 ** (4 * order)))}${jp_prefixes[order]}`;
};

const escCSV = function (txt = '') {
  if (typeof txt === 'number') {
    return txt;
  }

  txt = txt.replace("\"", "\"\"");
  txt = txt.replace("\\", "\\\\");
  return `"${txt}"`;
};

export { siNumberFromat, jpNumberFromat, escCSV };
