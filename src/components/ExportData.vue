<template>
  <div>
    <b-button v-b-toggle.export variant="secondary" size="sm">エクスポート機能</b-button>
    <b-collapse id="export" class="mt-3">
      <b-form-group label="形式">
        <b-form-select v-model="selected_format" :options="formats" />
      </b-form-group>
      <b-button variant="primary" @click="handleClick">エクスポート</b-button>
    </b-collapse>
  </div>
</template>
<script>
import exportService from "../services/exporter";
export default {
  props: ["info"],
  data() {
    return {
      formats: exportService.getFormats(),
      selected_format: exportService.getFormats()[0].value
    };
  },
  methods: {
    handleClick() {
      const name = "download";
      const type = this.selected_format;
      const data = this.info;

      return exportService.download({ type, data, name });
    }
  }
};
</script>