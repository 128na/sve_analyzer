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
      const type = await fileService.getFormat(file);

      performance.clearMarks();
      performance.mark("start");
      this.working = true;
      this.updateStep(STEPS.START, true);
      this.$emit("update");
      const data = {
        file: Object.assign({ type }, fileService.getFileInfo(file)),
        info: null
      };

      performance.mark("parse");
      this.updateStep(STEPS.PARSE);
      data.info = await simutransService
        .parse(file, type, this.updateStep)
        .catch(e => this.toastDanger(e.message));

      performance.mark("render");
      this.updateStep(STEPS.RENDER);
      this.$emit("update", data);
      this.updateStep(STEPS.FINISHED, data.info);
      this.working = false;
      performance.mark("finish");

      const marks = performance.getEntriesByType("mark");
      console.log(
        "time",
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
