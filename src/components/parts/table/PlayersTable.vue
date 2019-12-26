// 会社一覧テーブル
<template>
  <div>
    <b-table hover :items="info.players" :fields="fields">
      <template v-slot:cell(color_1)="data">
        <span :style="color(data.item.color_1)">■</span>
        {{ data.item.color_1 }}
      </template>
      <template v-slot:cell(color_2)="data">
        <span :style="color(data.item.color_2)">■</span>
        {{ data.item.color_2 }}
      </template>
    </b-table>
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
        { key: "name", sortable: true, label: "会社名" },
        { key: "color_1", sortable: true, label: "基調色" },
        { key: "color_2", sortable: true, label: "補助色" }
      ]
    };
  },
  methods: {
    color(rgb) {
      return {
        color: rgb
      };
    }
  }
};
</script>
