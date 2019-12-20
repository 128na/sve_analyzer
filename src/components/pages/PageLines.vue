<template>
  <div>
    <b-card header="路線一覧" class="mb-3">
      <LinesTable :info="computed_info" @row-clicked="handleClick" />
    </b-card>
    <LineDetail :line_detail="line_detail" />
  </div>
</template>
<script>
import relationService from "../../services/relation";
export default {
  name: "LinesPage",
  props: ["info"],
  data() {
    return {
      line_detail: null
    };
  },
  computed: {
    computed_info() {
      return Object.assign({}, this.info, {
        players: this.info.players.map(p =>
          Object.assign({}, p, {
            type: relationService.getPlayerTypeName(p.type),
            name: relationService.getPlayerName(p)
          })
        ),
        lines: this.info.lines.map(l => {
          return {
            id: l.id,
            player: relationService.getPlayerNameById(
              this.info.players,
              l.player_id
            ),
            name: l.name,
            type: relationService.getWayTypeName(l.type),
            stop_counts: l.stops.length || 0
          };
        })
      });
    }
  },
  methods: {
    handleClick(id) {
      const line = relationService.getLineById(this.info.lines, id);
      const stations = relationService.getStationsByLine(
        this.info.stations,
        line
      );
      const player = relationService.getPlayerNameById(
        this.info.players,
        line.player_id
      );

      this.line_detail = {
        id,
        stations,
        player,
        name: line.name,
        type: line.type
      };
    }
  }
};
</script>