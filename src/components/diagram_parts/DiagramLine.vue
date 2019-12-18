<template>
  <polyline :points="points" fill="none" stroke="black" />
</template>
<script>
export default {
  props: ["line"],
  computed: {
    points() {
      return this.line.stops
        .map(s => [s.coordinate[0], s.coordinate[1]].join(","))
        .join(" ");
    }
  }
};
</script>