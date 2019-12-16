<template>
  <div>
    <b-card header="路線一覧" class="mb-3">
      <LinesTable :info="computed_info" @row-clicked="handleClick" />
    </b-card>
    <LineDetail :line_detail="line_detail" />
  </div>
</template>
<script>
import cacheService from "../../services/cache";
import { PLAYER_TYPES, DEFAULT_PLAYER_NAMES, WAY_TYPES } from "../../const";
export default {
  name: "LinesPage",
  props: ["info"],
  data() {
    return {
      line_detail: null
    };
  },
  created() {
    cacheService.createStationsCache(this.info.stations);
  },
  computed: {
    computed_info() {
      return Object.assign({}, this.info, {
        players: this.info.players.map(p =>
          Object.assign({}, p, {
            type: this.getPlayerTypeText(p.type),
            name: this.getPlayerName(p.name)
          })
        ),
        lines: this.info.lines.map(l => {
          return {
            id: l.id,
            player: this.getPlayer(l.player_id).name,
            name: l.name,
            type: this.getWayType(l.type),
            stop_counts: l.stops.length || 0
          };
        })
      });
    }
  },
  methods: {
    getPlayerTypeText(type) {
      return PLAYER_TYPES[type] || "??";
    },
    getPlayerName(name) {
      return DEFAULT_PLAYER_NAMES[name] || name;
    },
    handleClick(id) {
      const line = this.getLine(id);
      const stations = this.getStations(line);
      const player = this.getPlayer(line.player_id);

      this.line_detail = { line, stations, player };
    },
    getLine(id) {
      return this.info.lines.find(l => l.id === id);
    },
    getStations(line) {
      return line.stops.map(s => cacheService.findStationNameByCoodrinate(s));
    },
    getPlayer(player_id) {
      return this.info.players.find(p => p.id === player_id) || {};
    },
    getWayType(type) {
      return WAY_TYPES[type] || "??";
    }
  }
};
</script>