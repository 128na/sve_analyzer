<template>
  <div>
    <b-modal id="line-filter" title="路線選択" size="lg" :hide-footer="true">
      <CustomTable
        :items="computed_info.lines"
        :fields="fields"
        :players="computed_info.players"
        :way_type_filter="true"
        :selectable="true"
        :selected_items="selected_lines"
        @row-clicked="handleClick"
        @select_all="handleSelectAll"
      />
    </b-modal>
  </div>
</template>
<script>
import relationService from "../../services/relation";
export default {
  props: ["info", "selected_lines"],
  data() {
    return {
      fields: [
        { key: "player", sortable: true, label: "会社名" },
        { key: "type", sortable: true, label: "種類" },
        { key: "name", sortable: true, label: "路線名" }
      ]
    };
  },
  computed: {
    computed_info() {
      return Object.assign({}, this.info, {
        players: this.info.players.map(p =>
          Object.assign({}, p, {
            type: relationService.getPlayerTypeName(p.type),
            name: relationService.getPlayerName(p)
          })
        ),
        lines: this.info.lines.map(l => {
          return {
            id: l.id,
            player: relationService.getPlayerNameById(
              this.info.players,
              l.player_id
            ),
            name: l.name,
            type: relationService.getWayTypeName(l.type),
            stop_counts: l.stops.length || 0
          };
        })
      });
    }
  },
  methods: {
    handleClick(line) {
      this.$emit("select", line.id);
    },
    handleSelectAll(lines) {
      this.$emit("select_all", lines.map(i => i.id));
    }
  }
};
</script>
<style lang="scss">
#line-filter .modal-dialog {
  margin-right: 1rem;
}
</style>