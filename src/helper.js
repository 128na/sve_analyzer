const toKB = function (number) {
  const intl = new Intl.NumberFormat('ja', { maximumFractionDigits: 1 });
  return intl.format(number / 10 ** 3);
}
export { toKB };
