<template>
  <div>
    <div class="form-group">
      <b-form-file
        v-model="file"
        placeholder="ファイルを選択、ドロップ"
        drop-placeholder="ドロップ"
        accept=".sve"
        browse-text="選択"
        :disabled="!can_select"
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
      document.title = `${process.env.VUE_APP_NAME} [${step}]`;
    }
  },
  created() {
    this.step = STEPS.READY;
  },
  computed: {
    can_select() {
      return [STEPS.READY, STEPS.FINISHED].includes(this.step);
    }
  },
  methods: {
    async handleFileChange(file) {
      performance.clearMarks();
      performance.mark("start");
      this.step = STEPS.START;
      this.$emit("update");
      const data = {
        file: fileService.getFileInfo(file),
        info: null
      };

      performance.mark("parse");
      this.step = STEPS.PARSE;
      await simutransService.parse(file);

      performance.mark("merge");
      this.step = STEPS.MERGE;
      data.info = simutransService.merge();
      this.step = STEPS.RENDER;
      simutransService.init();

      console.log(data);

      performance.mark("render");
      this.$emit("update", data);
      this.$emit("end");
      this.step = STEPS.FINISHED;
      performance.mark("finish");

      const marks = performance.getEntriesByType("mark");
      console.log(
        marks.map((m, i) => {
          return {
            name: m.name,
            duration:
              i < marks.length - 1
                ? marks[i + 1].startTime - m.startTime
                : m.startTime - marks[0].startTime
          };
        })
      );
    }
  }
};
</script>
