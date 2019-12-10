<template>
  <div>
    <div class="mb-2">
      <b-button v-b-toggle.collapse-1 variant="secondary" size="sm">フィルター</b-button>
      <b-collapse id="collapse-1" class="mt-2">
        <b-form-group label="会社名">
          <b-form-checkbox-group v-model="selected_players" :options="players"></b-form-checkbox-group>
        </b-form-group>
        <b-form-group label="キーワード">
          <b-form-input v-model="keyword" placeholder="駅名"></b-form-input>
        </b-form-group>
        <p>合計 {{ stations.length }}駅</p>
      </b-collapse>
    </div>

    <b-table
      hover
      :items="stations"
      :fields="fields"
      :sort-by.sync="sort_by"
      :sort-desc.sync="sort_desc"
    ></b-table>
  </div>
</template>
<script>
export default {
  props: ["info"],
  data() {
    return {
      sort_by: "id",
      sort_desc: false,
      fields: [
        { key: "id", sortable: true },
        { key: "player", sortable: true },
        { key: "name", sortable: true },
        { key: "tiles", sortable: true }
      ],
      selected_players: [],
      keyword: ""
    };
  },
  created() {
    this.selected_players = this.players.map(p => p.value);
  },
  computed: {
    searched_stations() {
      return this.info.stations.filter(
        s =>
          this.selected_players.includes(s.player_id) &&
          s.name.includes(this.keyword)
      );
    },
    stations() {
      return this.searched_stations.map(s => {
        return {
          id: s.id,
          player: this.getPlayer(s.player_id).name,
          name: s.name,
          tiles: s.coordinates.length
        };
      });
    },
    players() {
      return this.info.players.map(p => {
        return { text: p.name, value: p.id };
      });
    }
  },
  methods: {
    getPlayer(player_id) {
      return this.info.players.find(p => p.id === player_id) || {};
    }
  }
};
</script>
<style lang="scss">
:focus {
  outline: none;
}
</style>