<template>
  <circle :cx="cx" :cy="cy" :r="r" />
</template>
<script>
export default {
  props: ["stop", "config"],
  computed: {
    cx() {
      return (this.stop.coordinate[0] * this.config.scale) / 100;
    },
    cy() {
      return (this.stop.coordinate[1] * this.config.scale) / 100;
    },
    r() {
      return this.config.stop.size;
    }
  }
};
</script>