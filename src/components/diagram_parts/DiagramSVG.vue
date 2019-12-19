<template>
  <div>
    <svg
      width="100%"
      height="70vh"
      :viewBox="viewBox"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMin meet"
      ref="svg"
    >
      <g
        v-if="config.line.width"
        class="line-group"
        fill="none"
        stroke="black"
        :stroke-width="config.line.width"
      >
        <DiagramLine v-for="line in lines" :key="line.id" :line="line" :config="config.line" />
      </g>
      <g
        v-if="config.stop.width"
        class="stop-mark-group"
        fill="white"
        stroke="black"
        :stroke-width="config.stop.width"
      >
        <DiagramStopMark
          v-for="(stop,index) in stops"
          :key="index"
          :stop="stop"
          :config="config.stop"
        />
      </g>
      <g
        v-if="config.station.size"
        class="station-group"
        :font-family="font_family"
        :font-size="config.station.size"
      >
        <DiagramStopLabel
          v-for="(stop_label,index) in stop_labels"
          :key="index"
          :stop_label="stop_label"
          :config="config.station"
        />
      </g>
    </svg>
    <b-form-group class="mt-2">
      <b-button class="mr-2" variant="primary" size="sm" @click="download">SVGエクスポート</b-button>
    </b-form-group>
  </div>
</template>
<script>
import diagramService from "../../services/diagram";
import relationService from "../../services/relation";
import exportService from "../../services/exporter";

export default {
  props: ["info", "config", "selected_lines"],
  computed: {
    viewBox() {
      return `${-this.config.padding} ${-this.config.padding} ${this.info.map
        .width + this.config.padding} ${this.info.map.depth +
        this.config.padding}`;
    },
    lines() {
      return this.info.lines
        .filter(l => this.selected_lines.includes(l.id))
        .map(l => diagramService.toRenderLine(l));
    },
    stops() {
      return this.lines.map(l => l.stops).flat();
    },
    stop_labels() {
      const stop_labels = [];
      this.stops.map(stop => {
        if (
          stop_labels.findIndex(sl => sl.station_id === stop.station_id) === -1
        ) {
          stop_labels.push({
            station_id: stop.station_id,
            coordinate: stop.coordinate,
            name: relationService.getStationNameById(
              this.info.stations,
              stop.station_id
            )
          });
        }
      });
      return stop_labels;
    },
    font_family() {
      return "'Hiragino Kaku Gothic Pro','ヒラギノ角ゴ Pro W3','メイリオ',Meiryo,'ＭＳ Ｐゴシック',sans-serif'";
    }
  },
  methods: {
    download() {
      return exportService.svgExporter(this.$refs.svg, "line_diagram");
    }
  }
};
</script>
<style lang="scss" scoped>
svg {
  border: solid 1px var(--gray);
}
</style>