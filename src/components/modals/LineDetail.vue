<template>
  <b-modal id="line_detail" title="路線詳細" :hide-footer="true">
    <div v-if="line_detail">
      <dl>
        <dt>会社</dt>
        <dd>{{ line_detail.player.name}}</dd>
        <dt>路線名</dt>
        <dd>{{ line_detail.line.name}}</dd>
      </dl>
      <h6>停車駅一覧</h6>
      <b-table :items="items" />
    </div>
  </b-modal>
</template>
<script>
export default {
  props: ["line_detail"],
  watch: {
    line_detail() {
      this.$bvModal.show("line_detail");
    }
  },
  computed: {
    items() {
      return this.line_detail.stations.map(s => {
        return {
          name: s
        };
      });
    }
  }
};
</script>