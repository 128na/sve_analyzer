<template>
  <div class="page" v-if="is_ready">
    <LineFilter
      :show="show_line_filter"
      :info="info"
      :selected_lines="selected_lines"
      @select="select"
      @select_all="select_all"
      @close="showSlide('')"
    />
    <DiagramConfig
      :show="show_diagram_config"
      :info="info"
      :config="config"
      @close="showSlide('')"
    />
    <DiagramExport :show="show_diagram_export" @download="download" />
    <DiagramSVG :info="info" :config="config" :selected_lines="selected_lines" ref="diagram" />
    <div class="btn-box" v-if="is_ready">
      <span class="vertical secondary" @click="showSlide(slides.line_filter)">路線設定</span>
      <span class="vertical secondary" @click="showSlide(slides.diagram_config)">表示設定</span>
      <span class="vertical primary" @click="showSlide(slides.diagram_export)">エクスポート</span>
    </div>
  </div>
</template>
<script>
import { SLIDES } from "../../const";
import exportService from "../../services/exporter";
export default {
  name: "LineDiagram",
  props: ["info"],
  data() {
    return {
      config: {
        scale: 100,
        padding: 16,
        width: 0,
        height: 0,
        padding: 16,
        line: {
          stroke: "#000000",
          width: 1
        },
        stop: {
          stroke: "#aaaaaa",
          fill: "#ffffff",
          size: 5,
          width: 1
        },
        stop_label: {
          fill: "#000000",
          size: 16,
          dx: 10,
          dy: 0
        }
      },
      selected_lines: [],
      slide: null
    };
  },
  computed: {
    slides() {
      return SLIDES;
    },
    is_ready() {
      return this.info.map.width && this.info.map.depth;
    },
    show_line_filter() {
      return this.slide === this.slides.line_filter;
    },
    show_diagram_config() {
      return this.slide === this.slides.diagram_config;
    },
    show_diagram_export() {
      return this.slide === this.slides.diagram_export;
    }
  },
  methods: {
    select(line_id) {
      if (this.selected_lines.includes(line_id)) {
        this.selected_lines = this.selected_lines.filter(id => id !== line_id);
      } else {
        this.selected_lines.push(line_id);
      }
    },
    select_all(line_ids) {
      this.selected_lines = line_ids;
    },
    showSlide(name) {
      this.slide = name;
    },
    download({ type, name }) {
      const dom = this.$refs.diagram.$refs.svg;

      if (type === "svg") {
        return exportService.svgExporter(dom, name);
      }

      if (type === "png") {
        return exportService.pngExporter(dom, name);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.btn-box {
  position: absolute;
  top: 2rem;
  right: 0;
  width: 2rem;
  margin-top: 1px;
  display: flex;
  flex-direction: column;
}
.vertical {
  margin-top: -1px;
  padding: 4px;
  writing-mode: vertical-rl;
  border-top-left-radius: 0.25rem;
  border-bottom-left-radius: 0.25rem;
  user-select: none;
  cursor: pointer;
  background-color: var(--white);
  font-size: 0.875rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out,
    -webkit-box-shadow 0.15s ease-in-out;
  &.secondary {
    border-left: solid 1px var(--gray);
    border-bottom: solid 1px var(--gray);
    border-top: solid 1px var(--gray);
    color: var(--gray);
    &:hover {
      color: var(--white);
      background-color: var(--gray);
    }
  }
  &.primary {
    border-left: solid 1px var(--primary);
    border-bottom: solid 1px var(--primary);
    border-top: solid 1px var(--primary);
    color: var(--primary);
    &:hover {
      color: var(--white);
      background-color: var(--primary);
    }
  }
}
</style>