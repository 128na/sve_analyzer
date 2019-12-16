<template>
  <div>
    <div class="form-group">
      <b-form-file
        v-model="file"
        placeholder="ファイルを選択、ドロップ"
        drop-placeholder="ドロップ"
        accept=".sve"
        browse-text="選択"
        :disabled="working"
      ></b-form-file>
    </div>
  </div>
</template>
<script>
import { STEPS } from "../const";
import fileService from "../services/file";
import simutransService from "../services/simutrans";
import { toastControl } from "../mixins";
export default {
  mixins: [toastControl],
  data() {
    return {
      file: null,
      working: false
    };
  },
  watch: {
    file(file) {
      if (file) {
        this.handleFileChange(file);
      }
    }
  },
  created() {
    this.updateStep(STEPS.READY);
  },
  methods: {
    updateStep(step, show_toast = false) {
      document.title = `${process.env.VUE_APP_NAME} [${step}]`;
      if (show_toast) {
        this.toast(step);
      }
    },
    async handleFileChange(file) {
      const type = await fileService.getMimeType(file).catch(() => "xml");
      console.log(type);
      return;

      performance.clearMarks();
      performance.mark("start");
      this.working = true;
      this.updateStep(STEPS.START, true);
      this.$emit("update");
      const data = {
        file: fileService.getFileInfo(file),
        info: null
      };

      performance.mark("parse");
      this.updateStep(STEPS.PARSE);
      await simutransService.parse(file);

      performance.mark("merge");
      this.updateStep(STEPS.MERGE);
      data.info = simutransService.merge();
      this.updateStep(STEPS.RENDER);
      simutransService.init();

      console.log(data);

      performance.mark("render");
      this.$emit("update", data);
      this.$emit("end");
      this.updateStep(STEPS.FINISHED, true);
      this.working = false;
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
