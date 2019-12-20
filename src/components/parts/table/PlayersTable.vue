// 会社一覧テーブル
<template>
  <div>
    <b-table hover :items="info.players" :fields="fields"></b-table>
  </div>
</template>
<script>
export default {
  props: ["info"],
  data() {
    return {
      fields: [
        { key: "id", sortable: true, label: "ID" },
        { key: "type", sortable: true, label: "種類" },
        { key: "name", sortable: true, label: "会社名" }
      ]
    };
  }
};
</script>
