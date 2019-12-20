<template>
  <div>
    <b-modal id="diagram-config" title="表示設定" :hide-footer="true">
      <b-form-group class="mb-4 border-bottom" label="路線">
        <InputRange v-model="config.line.width">幅</InputRange>
        <InputColor v-model="config.line.stroke">色</InputColor>
      </b-form-group>
      <b-form-group class="mb-4 border-bottom" label="停車駅名">
        <InputRange v-model="config.station.size" max="64">サイズ</InputRange>
        <InputRange v-model="config.station.dx" min="-64" max="64">縦オフセット</InputRange>
        <InputRange v-model="config.station.dy" min="-64" max="64">横オフセット</InputRange>
        <InputColor v-model="config.station.fill">色</InputColor>
      </b-form-group>
      <b-form-group class="mb-4 border-bottom" label="停車駅マーカー">
        <InputRange v-model="config.stop.size">サイズ</InputRange>
        <InputRange v-model="config.stop.width">線幅</InputRange>
        <InputColor v-model="config.stop.stroke">枠線色</InputColor>
        <InputColor v-model="config.stop.fill">枠内色</InputColor>
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