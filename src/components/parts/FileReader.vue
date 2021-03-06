<template>
  <div>
    <div class="form-group">
      <b-form-file
        v-model="file"
        placeholder="ファイルを選択、ドロップ"
        drop-placeholder="ドロップ"
        accept=".sve"
        browse-text="選択"
        :disabled="analyzing"
      ></b-form-file>
      <small>対応セーブフォーマット：xml, xml_zipped, xml_bzip2</small>
    </div>
  </div>
</template>
<script>
import { STEPS, SAVEFORMATS } from "../../const";
import fileService from "../../services/file";
import simutransService from "../../services/simutrans";
import { toastControl } from "../../mixins";
export default {
  props: ["analyzing"],
  mixins: [toastControl],
  data() {
    return {
      file: null
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
      gtag("event", "analyze");

      performance.clearMarks();
      performance.mark("start");
      this.updateStep(STEPS.START, true);
      this.$emit("update");
      const type = await fileService.getFormat(file);

      console.log("format: ", type);

      if (
        [SAVEFORMATS.binary, SAVEFORMATS.zipped, SAVEFORMATS.bzip2].includes(
          type
        )
      ) {
        throw new Error("未対応のフォーマットです");
      }

      const data = {
        file: Object.assign({ type }, fileService.getFileInfo(file)),
        info: null
      };

      performance.mark("parse");
      this.updateStep(STEPS.PARSE);
      data.info = await simutransService
        .parse(file, type, this.updateStep)
        .catch(e => this.toastDanger(e.message));

      // console.log(data);

      performance.mark("render");
      this.updateStep(STEPS.RENDER);
      this.$emit("update", data);
      this.updateStep(STEPS.FINISHED, data.info);
      performance.mark("finish");

      const marks = performance.getEntriesByType("mark");
      console.log(
        ...marks.map((m, i) => {
          return {
            name: m.name,
            duration_sec:
              (i < marks.length - 1
                ? marks[i + 1].startTime - m.startTime
                : m.startTime - marks[0].startTime) / 1000
          };
        })
      );
    }
  }
};
</script>
