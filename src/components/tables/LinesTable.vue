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
        { key: "id", sortable: true },
        { key: "player", sortable: true },
        { key: "type", sortable: true },
        { key: "name", sortable: true },
        { key: "stop_counts", sortable: true }
      ]
    };
  }
};
</script>
