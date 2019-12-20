<template>
  <text v-if="stop_label.name" :x="x" :y="y">{{ stop_label.name }}</text>
</template>
<script>
export default {
  props: ["stop_label", "config"],
  computed: {
    x() {
      return this.stop_label.coordinate[0] + Number(this.config.dx);
    },
    y() {
      return this.stop_label.coordinate[1] - Number(this.config.dy);
    }
  }
};
</script>
