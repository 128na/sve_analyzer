<template>
  <circle :cx="cx" :cy="cy" :r="r" />
</template>
<script>
export default {
  props: ["stop", "config"],
  computed: {
    cx() {
      return this.stop.coordinate[0];
    },
    cy() {
      return this.stop.coordinate[1];
    },
    r() {
      return this.config.size;
    }
  }
};
</script>