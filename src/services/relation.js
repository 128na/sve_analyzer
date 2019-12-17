import { PLAYER_TYPES, DEFAULT_PLAYER_NAMES, WAY_TYPES } from "../const";
export default {
  // way type
  getWayTypeName(type) {
    return WAY_TYPES[type] || "??";
  },

  // player
  getPlayerName(player) {
    return DEFAULT_PLAYER_NAMES[player.name] || player.name;
  },
  getPlayerById(players, player_id) {
    return players.find(p => p.id === player_id) || {};
  },
  getPlayerNameById(players, player_id) {
    return this.getPlayerName(this.getPlayerById(players, player_id));
  },
  getPlayerTypeName(type) {
    return PLAYER_TYPES[type] || "??";
  },


  // station
  getStationNameById(stations, station_id) {
    return stations.find(s => s.id === station_id).name || "";
  },
  getStationByCoodrinate(stations, coordinate) {
    return stations.find(s =>
      s.coordinates.some(c => c[0] === coordinate[0] && c[1] === coordinate[1] && c[2] === coordinate[2])
    );
  },
  getStationIdByCoodrinate(stations, coordinate) {
    return this.getStationByCoodrinate(stations, coordinate).id;
  },
  getStationsByLine(stations, line) {
    return line.stops.map(stop => this.getStationByCoodrinate(stations, stop.coordinate))
  },

  // line
  getLineById(lines, id) {
    return lines.find(l => l.id === id);
  },

}