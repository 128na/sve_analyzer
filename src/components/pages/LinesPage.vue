<template>
  <div>
    <b-card header="路線一覧" class="mb-3">
      <LinesTable :info="info" @row-clicked="handleClick" />
    </b-card>
    <LineDetail :line_detail="line_detail" />
  </div>
</template>
<script>
import cacheService from "../../services/cache";
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
  methods: {
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
    }
  }
};
</script>