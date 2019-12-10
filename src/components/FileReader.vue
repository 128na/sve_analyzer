<template>
  <div>
    <div class="form-group">
      <b-form-file
        v-model="file"
        placeholder="ファイルを選択、ドロップ"
        drop-placeholder="ドロップ"
        accept=".sve"
        browse-text="選択"
      ></b-form-file>
    </div>
    <p>
      進捗：
      <span>{{ step }}</span>
    </p>
  </div>
</template>
<script>
import { STEPS } from "../const";
import fileService from "../services/file";
import simutransService from "../services/simutrans";
export default {
  data() {
    return {
      file: null,
      step: null
    };
  },
  watch: {
    file(file) {
      if (file) {
        this.handleFileChange(file);
      }
    },
    step(step) {
      document.title = `Sve Analyzer [${step}]`;
    }
  },
  created() {
    this.step = STEPS.READY;
  },
  methods: {
    async handleFileChange(file) {
      console.time("app");
      this.$emit("begin");
      this.$emit("updateFile", fileService.getFileInfo(file));

      console.time("parse");
      this.step = STEPS.PARSE;
      await simutransService.parse(file);
      console.timeEnd("parse");

      console.time("merge");
      this.step = STEPS.MERGE;
      const data = simutransService.merge();
      this.step = STEPS.RENDER;
      simutransService.init();
      console.timeEnd("merge");

      console.log(data);
      this.$emit("updateInfo", { data });
      this.$emit("end");
      this.step = STEPS.FINISHED;
      console.timeEnd("app");
    }
  }
};
</script>
