<template>
  <polygon v-if="line.closed" :points="points" :stroke="stroke" />
  <polyline v-else :points="points" :stroke="stroke" />
</template>
<script>
export default {
  props: ["line", "config"],
  computed: {
    points() {
      return this.line.stops
        .map(s =>
          [
            (s.coordinate[0] * this.config.scale) / 100,
            (s.coordinate[1] * this.config.scale) / 100
          ].join(",")
        )
        .join(" ");
    },
    stroke() {
      return this.line.color || "#000";
    }
  }
};
</script>