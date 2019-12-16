// 会社、キーワード絞り込みが可能なテーブル
<template>
  <div>
    <div class="mb-2">
      <b-button v-b-toggle.filter variant="secondary" size="sm" class="mb-2">項目フィルター</b-button>
      <b-collapse id="filter">
        <b-form-group label="会社名">
          <b-form-checkbox-group v-model="selected_players" :options="computed_players"></b-form-checkbox-group>
        </b-form-group>
        <b-form-group label="種類">
          <b-form-checkbox-group
            v-if="way_type_filter"
            v-model="selected_way_types"
            :options="computed_way_types"
          ></b-form-checkbox-group>
        </b-form-group>
        <b-form-group label="キーワード">
          <b-form-input v-model="keyword" placeholder="キーワード"></b-form-input>
        </b-form-group>
      </b-collapse>
      <p>{{ items.length }}件中、{{ filtered_items.length }} 件該当</p>
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
import { WAY_TYPES } from "../../const";
export default {
  props: {
    items: {
      type: Array,
      default: () => []
    },
    fields: {
      type: Array,
      default: () => []
    },
    players: {
      type: Array,
      default: () => []
    },
    way_type_filter: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      per_page: 50,
      current: 1,
      sort_by: "id",
      sort_desc: false,
      selected_players: [],
      selected_way_types: [],
      keyword: ""
    };
  },
  computed: {
    filtered_items() {
      return this.items
        .filter(item =>
          this.way_type_filter
            ? this.selected_way_types.includes(item.type)
            : true
        )
        .filter(
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
    },
    computed_way_types() {
      return Object.values(WAY_TYPES).map(w => {
        return {
          value: w,
          text: w
        };
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