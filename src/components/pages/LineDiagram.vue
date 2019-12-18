<template>
  <div>
    <div class="mb-2">
      <b-btn variant="primary" size="sm" @click="download">SVGエクスポート</b-btn>
    </div>
    <svg
      width="100%"
      :viewBox="viewBox"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMin meet"
      ref="svg"
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
import exportService from "../../services/exporter";
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
    },
    download() {
      const serializer = new XMLSerializer();
      const xml_str = serializer.serializeToString(this.$refs.svg);
      return exportService.svgExporter(xml_str, "line_diagram");
    }
  }
};
</script>