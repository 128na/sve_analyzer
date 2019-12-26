<template>
  <slide-out :visible="show" @close="close" title="エクスポート" maskColor="#0000">
    <div class="mx-2 my-4">
      <b-form-group label="ファイル名">
        <b-form-input v-model="name" />
        <small>拡張子は自動で追加されます。</small>
      </b-form-group>
      <b-form-group>
        <b-button class="mr-2" variant="primary" size="sm" @click="handleClick('svg')">SVGエクスポート</b-button>
      </b-form-group>
      <b-form-group>
        <b-button class="mr-2" variant="primary" size="sm" @click="handleClick('png')">PNGエクスポート</b-button>
      </b-form-group>
    </div>
  </slide-out>
</template>
<script>
import { slideControl } from "../../../mixins";
export default {
  mixins: [slideControl],
  data() {
    return {
      name: "路線図"
    };
  },
  methods: {
    handleClick(type) {
      gtag("event", "diagram_export", { event_label: type });
      this.$emit("download", { type, name: this.name });
    }
  }
};
</script>
