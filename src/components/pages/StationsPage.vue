<template>
  <div>
    <b-card header="会社一覧" class="mb-3">
      <PlayersTable :info="computed_info" />
    </b-card>
    <b-card header="駅一覧" class="mb-2">
      <StationsTable :info="computed_info" />
    </b-card>
  </div>
</template>
<script>
import { PLAYER_TYPES, DEFAULT_PLAYER_NAMES } from "../../const";
export default {
  name: "StationsPage",
  props: ["info"],
  computed: {
    computed_info() {
      return Object.assign({}, this.info, {
        players: this.info.players.map(p =>
          Object.assign({}, p, {
            type: this.getPlayerTypeText(p.type),
            name: this.getPlayerName(p.name)
          })
        ),
        stations: this.info.stations.map(s => {
          return {
            id: s.id,
            player: this.getPlayer(s.player_id).name,
            name: s.name,
            tile_counts: s.coordinates.length
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
    getPlayer(player_id) {
      return this.info.players.find(p => p.id === player_id) || {};
    }
  }
};
</script>