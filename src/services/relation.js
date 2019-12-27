import {
  PLAYER_TYPES,
  DEFAULT_PLAYER_NAMES,
  WAY_TYPES,
  PLAYER_COLOR
} from "../const";

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
  getPlayerColor(color_id, level = 4) {
    return PLAYER_COLOR[color_id + level] || PLAYER_COLOR[level];
  },
  getPlayerColor1ByPlayerId(players, player_id, level = 4) {
    return this.getPlayerColor(
      this.getPlayerById(players, player_id, level).color_1
    );
  },
  getPlayerColor2ByPlayerId(players, player_id, level = 4) {
    return this.getPlayerColor(
      this.getPlayerById(players, player_id, level).color_2
    );
  },

  // station
  getStationById(stations, station_id) {
    return stations.find(s => s.id === station_id) || {};
  },
  getStationNameById(stations, station_id) {
    return this.getStationById(stations, station_id).name || "";
  },
  getStationByCoodrinate(stations, coordinate) {
    return stations.find(s =>
      s.coordinates.some(c => c[0] === coordinate[0] && c[1] === coordinate[1] && c[2] === coordinate[2])
    ) || {};
  },
  getStationIdByCoodrinate(stations, coordinate) {
    return this.getStationByCoodrinate(stations, coordinate).id || null;
  },
  getStationsByLine(stations, line) {
    return line.stops.map(stop => this.getStationById(stations, stop.station_id));
  },

  // line
  getLineById(lines, id) {
    return lines.find(l => l.id === id);
  },

}