<template>
  <polygon v-if="line.closed" :points="points" />
  <polyline v-else :points="points" />
</template>
<script>
export default {
  props: ["line", "config"],
  computed: {
    points() {
      return this.line.stops
        .map(s => [s.coordinate[0], s.coordinate[1]].join(","))
        .join(" ");
    }
  }
};
</script>