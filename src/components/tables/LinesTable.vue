// 路線一覧テーブル
<template>
  <div>
    <CustomTable
      :items="lines"
      :fields="fields"
      :players="info.players"
      @row-clicked="item=>$emit('row-clicked',item.id)"
    />
  </div>
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
        { key: "stop_counts", sortable: true }
      ]
    };
  },
  computed: {
    lines() {
      return this.info.lines.map(l => {
        return {
          id: l.id,
          player: this.getPlayer(l.player_id).name,
          name: l.name,
          stop_counts: l.stops.length || 0
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
