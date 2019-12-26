<template>
  <b-container class="page">
    <div class="page-content">
      <b-card header="会社一覧" class="mb-3">
        <PlayersTable :info="computed_info" />
      </b-card>
      <b-card header="駅一覧" class="mb-2">
        <StationsTable :info="computed_info" />
      </b-card>
    </div>
  </b-container>
</template>
<script>
import relationService from "../../services/relation";
export default {
  name: "StationsPage",
  props: ["info"],
  computed: {
    computed_info() {
      return Object.assign({}, this.info, {
        players: this.info.players.map(p =>
          Object.assign({}, p, {
            type: relationService.getPlayerTypeName(p.type),
            name: relationService.getPlayerName(p),
            color_1: this.getColor(p.color_1),
            color_2: this.getColor(p.color_2)
          })
        ),
        stations: this.info.stations.map(s => {
          return {
            id: s.id,
            player: relationService.getPlayerNameById(
              this.info.players,
              s.player_id
            ),
            name: s.name,
            tile_counts: s.coordinates.length
          };
        })
      });
    }
  },
  methods: {
    getColor(color_id) {
      return relationService.getPlayerColor(color_id);
    }
  }
};
</script>