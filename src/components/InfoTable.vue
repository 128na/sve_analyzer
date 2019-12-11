<template>
  <div>
    <b-card-group>
      <b-card header="ファイル" class="mb-3">
        <dl>
          <dt>名前</dt>
          <dd>{{ file.name }}</dd>
          <dt>サイズ</dt>
          <dd>{{ sizeFromat(file.size) }}</dd>
          <dt>形式</dt>
          <dd>{{ file.type }}</dd>
        </dl>
      </b-card>
      <b-card header="セーブデータ" class="mb-3">
        <dl>
          <dt>Ver</dt>
          <dd>{{ info.simutrans.version }}</dd>
          <dt>Pak</dt>
          <dd>{{ info.simutrans.pak }}</dd>
        </dl>
      </b-card>
      <b-card header="マップ" class="mb-3">
        <dl>
          <dt>No</dt>
          <dd>{{ info.map.no }}</dd>
          <dt>横</dt>
          <dd>{{ info.map.width }}</dd>
          <dt>縦</dt>
          <dd>{{ info.map.depth }}</dd>
        </dl>
      </b-card>
    </b-card-group>
    <b-card header="会社一覧" class="mb-3">
      <b-table hover :items="players"></b-table>
    </b-card>
    <b-card header="駅一覧" class="mb-2">
      <StationsTable :info="info" />
    </b-card>
  </div>
</template>
<script>
import { sizeFromat } from "../helper";
import { PLAYER_TYPES } from "../const";
import StationsTable from "./tables/StationsTable.vue";
export default {
  props: ["file", "info"],
  components: { StationsTable },
  computed: {
    players() {
      return this.info.players.map(p =>
        Object.assign({}, p, { type: this.playerTypeText(p.type) })
      );
    },
    stations() {
      return this.info.stations.map(s => {
        return {
          id: s.id,
          player: this.getPlayer(s.player_id).name,
          name: s.name,
          tiles: s.coordinates.length
        };
      });
    }
  },
  methods: {
    sizeFromat(number) {
      return number > 0 ? sizeFromat(number) : "--";
    },
    playerTypeText(type) {
      return PLAYER_TYPES[type] || "??";
    },
    getPlayer(player_id) {
      return this.info.players.find(p => p.id === player_id);
    }
  }
};
</script>
<style lang="scss" scoped>
dl {
  display: grid;
  grid-template-columns: 4rem 1fr;
}
</style>