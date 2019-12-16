// 駅一覧テーブル
<template>
  <CustomTable :items="info.stations" :fields="fields" :players="info.players" />
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
  }
};
</script>
