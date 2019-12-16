// 路線一覧テーブル
<template>
  <div>
    <CustomTable
      :items="info.lines"
      :fields="fields"
      :players="info.players"
      :way_type_filter="true"
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
        { key: "id", sortable: true, label: "ID" },
        { key: "player", sortable: true, label: "会社名" },
        { key: "type", sortable: true, label: "種類" },
        { key: "name", sortable: true, label: "路線名" },
        { key: "stop_counts", sortable: true, label: "停車駅数" }
      ]
    };
  }
};
</script>
