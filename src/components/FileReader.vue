<template>
  <div>
    <input type="file" @change="handleFileChange" />
    <p>進捗：{{ step }}</p>
  </div>
</template>
<script>
import { STEPS } from "../const";
import fileService from "../services/file";
import simutransService from "../services/simutrans";
export default {
  data() {
    return {
      step: STEPS.READY
    };
  },
  methods: {
    async handleFileChange(e) {
      console.time("app");
      this.$emit("select");
      const file = e.target.files[0];
      if (file) {
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
        this.step = STEPS.FINISHED;
        console.timeEnd("app");
      }
    }
  }
};
</script>
