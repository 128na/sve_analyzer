<template>
  <div v-if="is_ready">
    <b-form-group>
      <LineFilter
        :info="info"
        :selected_lines="selected_lines"
        @select="select"
        @select_all="select_all"
      />
      <DiagramConfig :info="info" :config="config" />
    </b-form-group>
    <DiagramSVG :info="info" :config="config" :selected_lines="selected_lines" />
  </div>
  <div v-else>(´・ω・`)</div>
</template>
<script>
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