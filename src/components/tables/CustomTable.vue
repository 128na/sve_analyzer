// 会社、キーワード絞り込みが可能なテーブル
<template>
  <div>
    <div class="mb-2">
      <b-button v-b-toggle.filter variant="secondary" size="sm">フィルター</b-button>
      <b-collapse id="filter" class="mt-2">
        <b-form-group label="会社名">
          <b-form-checkbox-group v-model="selected_players" :options="computed_players"></b-form-checkbox-group>
        </b-form-group>
        <b-form-group label="キーワード">
          <b-form-input v-model="keyword" placeholder="キーワード"></b-form-input>
        </b-form-group>
        <p>該当：{{ filtered_items.length }}件</p>
      </b-collapse>
    </div>
    <b-pagination
      v-model="current"
      :total-rows="filtered_items.length"
      :per-page="per_page"
      aria-controls="custom-table"
      align="center"
    ></b-pagination>

    <b-table
      hover
      :items="filtered_items"
      :fields="fields"
      :per-page="per_page"
      :current-page="current"
      :sort-by.sync="sort_by"
      :sort-desc.sync="sort_desc"
      @row-clicked="item=>$emit('row-clicked',item)"
    ></b-table>
  </div>
</template>
<script>
export default {
  props: ["items", "fields", "players"],
  data() {
    return {
      per_page: 50,
      current: 1,
      sort_by: "id",
      sort_desc: false,
      selected_players: [],
      keyword: ""
    };
  },
  created() {
    this.selected_players = this.players.map(p => p.name);
  },
  computed: {
    filtered_items() {
      return this.items.filter(
        item =>
          this.selected_players.includes(item.player) &&
          Object.values(item)
            .join()
            .includes(this.keyword)
      );
    },
    computed_players() {
      return this.players.map(p => {
        return { text: p.name, value: p.name };
      });
    }
  }
};
</script>
<style lang="scss">
:focus {
  outline: none;
}
</style>