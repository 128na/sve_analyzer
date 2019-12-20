export default {
  /**
   * 最初の駅を折り返し駅＝ユニークにする
   */
  shifting(stops) {
    const arr = [...stops];
    let count = 0;
    let is_unique = true;
    do {
      const rev = [...arr].reverse();
      const first = arr[0];
      is_unique = rev.findIndex(r => r.station_id === first.station_id) === arr.length - 1;
      if (is_unique) {
        return arr;
      }
      arr.unshift(arr.pop());
      count++;
    } while (!is_unique && count < arr.length);
    console.warn('max count reached');
    return arr;
  },
  /**
   * 最初の駅から最後のユニーク駅までを切り取る
   */
  triming(stops) {
    const arr = [...stops];
    let count = 0;
    let is_unique = true;
    do {
      const rev = [...arr].reverse();
      const last = rev[0];
      is_unique = arr.findIndex(a => a.station_id === last.station_id) === arr.length - 1;

      if (is_unique) {
        return arr;
      }
      arr.pop();
      count++;
    } while (!is_unique && count < 1024);
  },
  isClosed(stops) {
    const stations = stops.map(s => s.station_id);
    const uniqued = [...new Set(stations)];
    return JSON.stringify(stations) === JSON.stringify(uniqued);
  },
  toClosed(line) {
    line.closed = true;
  },
  toRenderLine(line) {
    line = Object.assign({}, line);
    if (this.isClosed(line.stops)) {
      this.toClosed(line);
    } else {
      line.stops = this.triming(this.shifting(line.stops));
    }
    return line;
  }
}