<template>
  <text v-if="station.name" :x="x" :y="y" font-size="12px">{{ station.name }}</text>
</template>
<script>
export default {
  props: ["station"],
  computed: {
    x() {
      return this.station.coordinate[0];
    },
    y() {
      return this.station.coordinate[1];
    }
  }
};
</script>