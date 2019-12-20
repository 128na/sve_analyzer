<template>
  <text v-if="stop_label.name" :x="x" :y="y">{{ stop_label.name }}</text>
</template>
<script>
export default {
  props: ["stop_label", "config"],
  computed: {
    x() {
      return (
        (this.stop_label.coordinate[0] * this.config.scale) / 100 +
        Number(this.config.stop_label.dx)
      );
    },
    y() {
      return (
        (this.stop_label.coordinate[1] * this.config.scale) / 100 -
        Number(this.config.stop_label.dy)
      );
    }
  }
};
</script>
