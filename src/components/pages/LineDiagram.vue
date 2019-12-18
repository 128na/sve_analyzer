<template>
  <div>
    <p>路線図</p>
    <svg
      width="100%"
      height="80vh"
      :viewBox="viewBox"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMin meet"
    >
      <DiagramLine v-for="line in info.lines" :key="`line_${line.id}`" :line="line" />
      <DiagramStation
        v-for="station in info.stations"
        :key="`station_${station.id}`"
        :station="station"
      />
    </svg>
  </div>
</template>
<script>
export default {
  name: "LineDiagram",
  props: ["info"],
  computed: {
    viewBox() {
      return `0 0 ${this.info.map.width} ${this.info.map.depth}`;
    }
  },
  methods: {
    points(line) {
      return line.stops
        .map(s => `${s.coordinate[0]},${s.coordinate[1]}`)
        .join(" ");
    }
  }
};
</script>