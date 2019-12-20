<template>
  <div>
    <b-form-group>
      <b-button class="mr-2" v-b-modal.line-filter variant="secondary" size="sm">路線選択</b-button>
      <b-button class="mr-2" v-b-modal.diagram-config variant="secondary" size="sm">表示設定</b-button>
    </b-form-group>
    <ModalDiagramConfig :info="info" :config="config" />
    <ModalLineFilter
      :info="info"
      :selected_lines="selected_lines"
      @select="select"
      @select_all="select_all"
    />
    <DiagramSVG v-if="is_ready" :info="info" :config="config" :selected_lines="selected_lines" />
  </div>
</template>
<script>
export default {
  name: "LineDiagram",
  props: ["info"],
  data() {
    return {
      config: {
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
        station: {
          fill: "#000000",
          size: 16,
          dx: 10,
          dy: 0
        }
      },
      selected_lines: []
    };
  },
  computed: {
    is_ready() {
      return this.info.map.width && this.info.map.depth;
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
    }
  }
};
</script>