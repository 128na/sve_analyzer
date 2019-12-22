<template>
  <span>
    <slide-out :visible="show" @close="toggleShow" title="表示設定" maskColor="#0000">
      <div class="mx-2 my-4">
        <b-form-group class="mb-4 border-bottom" label="表示">
          <InputRange
            v-model.number="config.scale"
            :min="10"
            :max="1000"
            :step="10"
            append="%"
          >駅間距離倍率</InputRange>
          <InputRange v-model.number="config.padding" :max="64" append="px">余白</InputRange>
        </b-form-group>
        <b-form-group class="mb-4 border-bottom" label="路線">
          <InputRange v-model.number="config.line.width" append="px">幅</InputRange>
          <InputColor v-model="config.line.stroke">色</InputColor>
        </b-form-group>
        <b-form-group class="mb-4 border-bottom" label="停車駅名">
          <InputRange v-model.number="config.stop_label.size" :max="64" append="px">サイズ</InputRange>
          <InputRange v-model.number="config.stop_label.dx" :min="-64" :max="64" append="px">縦オフセット</InputRange>
          <InputRange v-model.number="config.stop_label.dy" :min="-64" :max="64" append="px">横オフセット</InputRange>
          <InputColor v-model="config.stop_label.fill">色</InputColor>
        </b-form-group>
        <b-form-group label="停車駅マーカー">
          <InputRange v-model.number="config.stop.size" append="px">サイズ</InputRange>
          <InputRange v-model.number="config.stop.width" append="px">線幅</InputRange>
          <InputColor v-model="config.stop.stroke">枠線色</InputColor>
          <InputColor v-model="config.stop.fill">枠内色</InputColor>
        </b-form-group>
      </div>
    </slide-out>
    <b-button class="mr-2" variant="secondary" size="sm" @click="toggleShow">表示設定</b-button>
  </span>
</template>
<script>
export default {
  props: ["info", "config"],
  data() {
    return {
      show: false
    };
  },
  methods: {
    toggleShow() {
      this.show = !this.show;
    }
  }
};
</script>
