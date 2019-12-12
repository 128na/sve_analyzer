// 会社一覧テーブル
<template>
  <div>
    <b-table hover :items="players"></b-table>
  </div>
</template>
<script>
import { PLAYER_TYPES } from "../../const";
export default {
  props: ["info"],
  computed: {
    players() {
      return this.info.players.map(p =>
        Object.assign({}, p, { type: this.playerTypeText(p.type) })
      );
    }
  },
  methods: {
    playerTypeText(type) {
      return PLAYER_TYPES[type] || "??";
    }
  }
};
</script>
