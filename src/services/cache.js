export default {
  cached_station: [],
  createStationsCache(stations) {
    this.cached_station = stations.map(s => {
      return {
        name: s.name,
        hash: s.coordinates.map(c => c.join(",")).join("/")
      }
    });
  },
  findStationNameByCoodrinate(coordinate) {
    const hash = coordinate.join(',');
    const cached = this.cached_station.find(s => s.hash.includes(hash));
    return cached ? cached.name : '';
  }
}