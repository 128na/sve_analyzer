<template>
  <b-modal id="line_detail" title="路線詳細" :hide-footer="true">
    <div v-if="line_detail">
      <dl>
        <dt>ID</dt>
        <dd>{{ line_detail.id }}</dd>
        <dt>会社</dt>
        <dd>{{ line_detail.player }}</dd>
        <dt>種類</dt>
        <dd>{{ getWayTypeName(line_detail.type) }}</dd>
        <dt>路線名</dt>
        <dd>{{ line_detail.name }}</dd>
        <dt>停車駅一覧</dt>
        <dd>
          <div class="text-right mb-2">
            <b-btn
              size="sm"
              variant="outline-secondary"
              v-clipboard:copy="stations_text"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
            >駅名一覧をコピー</b-btn>
          </div>
          <b-table :items="items" />
        </dd>
      </dl>
    </div>
  </b-modal>
</template>
<script>
import { toastControl } from "../../../mixins";
import { WAY_TYPES } from "../../../const";
export default {
  props: ["line_detail"],
  mixins: [toastControl],
  watch: {
    line_detail() {
      this.$bvModal.show("line_detail");
    }
  },
  computed: {
    items() {
      return this.line_detail.stations.map(s => {
        return {
          id: s.id || "",
          name: s.name || "[中継点]"
        };
      });
    },
    stations_text() {
      return this.line_detail.stations.join("\n");
    }
  },
  methods: {
    onCopy: function(e) {
      this.toast("クリップボードにコピーしました");
    },
    onError: function(e) {
      this.toastDanger("クリップボードにコピーできませんでした");
    },
    getWayTypeName(type) {
      return WAY_TYPES[type] || "?";
    }
  }
};
</script>