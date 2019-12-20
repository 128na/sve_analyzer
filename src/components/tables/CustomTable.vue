// 会社、キーワード絞り込みが可能なテーブル
<template>
  <div>
    <div class="mb-2">
      <b-button v-b-toggle.filter variant="secondary" size="sm" class="mb-2">項目フィルター</b-button>
      <b-collapse id="filter">
        <b-form-group>
          <template v-slot:label>
            <b-form-checkbox inline :checked="select_all_player" @change="togglePlayers">
              <strong>会社名</strong>
            </b-form-checkbox>
          </template>
          <b-form-checkbox-group v-model="selected_players" :options="computed_players"></b-form-checkbox-group>
        </b-form-group>
        <b-form-group v-if="way_type_filter">
          <template v-slot:label>
            <b-form-checkbox inline :checked="select_all_way_type" @change="toggleWayTypes">
              <strong>種類</strong>
            </b-form-checkbox>
          </template>
          <b-form-checkbox-group v-model="selected_way_types" :options="computed_way_types"></b-form-checkbox-group>
        </b-form-group>
        <b-form-group label="キーワード">
          <b-form-input type="search" v-model="keyword" placeholder="キーワード"></b-form-input>
        </b-form-group>
      </b-collapse>
      <b-form-group>
        <span>{{ items.length }}件中、{{ filtered_items.length }} 件該当</span>
        <b-button
          v-show="selectable"
          variant="primary"
          size="sm"
          class="ml-2"
          @click="selectAll"
          :disabled="filtered_items.length===0"
        >全て追加</b-button>
        <b-button
          v-show="selectable"
          variant="danger"
          size="sm"
          class="ml-2"
          @click="deselectAll"
          :disabled="filtered_items.length===0"
        >全て解除</b-button>
      </b-form-group>
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
      :tbodyTrClass="trClass"
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
    },
    selectable: {
      type: Boolean,
      default: false
    },
    selected_items: {
      type: Array,
      default: () => []
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
    },
    select_all_player() {
      return this.selected_players.length === this.computed_players.length;
    },
    select_all_way_type() {
      return this.selected_way_types.length === this.computed_way_types.length;
    },
    filtered_items() {
      return this.items.filter(item => {
        if (this.isSelected(item)) {
          return true;
        }

        return (
          this.hasPlayer(item) && this.hasWayType(item) && this.hasKeyword(item)
        );
      });
    }
  },
  methods: {
    togglePlayers() {
      if (this.select_all_player) {
        this.selected_players = [];
      } else {
        this.selected_players = this.computed_players.map(p => p.value);
      }
    },
    toggleWayTypes() {
      if (this.select_all_way_type) {
        this.selected_way_types = [];
      } else {
        this.selected_way_types = this.computed_way_types.map(t => t.value);
      }
    },
    isSelected(item) {
      return this.selected_items.includes(item.id);
    },
    hasWayType(item) {
      if (this.way_type_filter) {
        return this.selected_way_types.includes(item.type);
      }
      return true;
    },
    hasPlayer(item) {
      return this.selected_players.includes(item.player);
    },
    hasKeyword(item) {
      return Object.values(item)
        .join()
        .includes(this.keyword);
    },
    trClass(item) {
      if (this.isSelected(item)) {
        return "bg-info";
      }
    },
    selectAll() {
      this.$emit("select_all", this.filtered_items);
    },
    deselectAll() {
      this.$emit("select_all", []);
    }
  }
};
</script>
<style lang="scss">
:focus {
  outline: none;
}
</style>