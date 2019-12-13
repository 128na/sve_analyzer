// 駅一覧テーブル
<template>
  <CustomTable :items="stations" :fields="fields" :players="info.players" />
</template>
<script>
export default {
  props: ["info"],
  data() {
    return {
      fields: [
        { key: "id", sortable: true },
        { key: "player", sortable: true },
        { key: "name", sortable: true },
        { key: "tile_counts", sortable: true }
      ]
    };
  },
  computed: {
    stations() {
      return this.info.stations.map(s => {
        return {
          id: s.id,
          player: this.getPlayer(s.player_id).name,
          name: s.name,
          tile_counts: s.coordinates.length
        };
      });
    }
  },
  methods: {
    getPlayer(player_id) {
      return this.info.players.find(p => p.id === player_id) || {};
    }
  }
};
</script>
