<template>
  <div>
    <b-modal id="diagram-config" title="表示設定" :hide-footer="true">
      <b-form-group :label="`路線 線幅 : ${config.line.width} px`">
        <b-form-input type="range" step="0.1" min="0" max="10" v-model="config.line.width" />
      </b-form-group>
      <b-form-group :label="`停車駅名 文字 : ${config.station.size} px`">
        <b-form-input type="range" min="0" max="100" step="0.1" v-model="config.station.size" />
      </b-form-group>
      <b-form-group :label="`停車駅名 横オフセット : ${config.station.dx} px`">
        <b-form-input type="range" min="-10" max="10" step="0.1" v-model="config.station.dx" />
      </b-form-group>
      <b-form-group :label="`停車駅名 縦オフセット : ${config.station.dy} px`">
        <b-form-input type="range" min="-10" max="10" step="0.1" v-model="config.station.dy" />
      </b-form-group>
      <b-form-group :label="`停車駅マーカー サイズ : ${config.stop.size} px`">
        <b-form-input type="range" min="0" max="10" step="0.1" v-model="config.stop.size" />
      </b-form-group>
      <b-form-group :label="`停車駅マーカー 線幅 : ${config.stop.width} px`">
        <b-form-input type="range" step="0.1" min="0" max="10" v-model="config.stop.width" />
      </b-form-group>
    </b-modal>
  </div>
</template>
<script>
export default {
  props: ["info", "config"]
};
</script>
<style lang="scss">
#diagram-config .modal-dialog {
  margin-right: 1rem;
}
</style>