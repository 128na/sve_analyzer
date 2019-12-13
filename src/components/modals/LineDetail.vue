<template>
  <b-modal id="line_detail" title="路線詳細" :hide-footer="true">
    <div v-if="line_detail">
      <dl>
        <dt>会社</dt>
        <dd>{{ line_detail.player.name}}</dd>
        <dt>路線名</dt>
        <dd>{{ line_detail.line.name}}</dd>
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
import { toastControl } from "../../mixins";
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
          name: s
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
    }
  }
};
</script>