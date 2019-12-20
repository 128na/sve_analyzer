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
        { key: "id", sortable: true, label: "ID" },
        { key: "player", sortable: true, label: "会社名" },
        { key: "name", sortable: true, label: "駅名" },
        { key: "tile_counts", sortable: true, label: "タイル数" }
      ]
    };
  }
};
</script>
