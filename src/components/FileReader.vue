<template>
  <div>
    <input type="file" @change="handleFileChange" />
    <p>status: {{ status }}</p>
  </div>
</template>
<script>
import { STATUSES } from "../const";
import fileService from "../services/file";
import simutransService from "../services/simutrans_stream";
export default {
  data() {
    return {
      status: STATUSES.ready,
      xml: null
    };
  },
  watch: {
    status(s) {
      console.log(s);
    }
  },
  methods: {
    handleFileChange(e) {
      this.onStatusChange(STATUSES.start);
      this.$emit("fileSelected");
      const file = e.target.files[0];
      if (file) {
        this.$emit("updateInfo", {
          label: "file",
          data: fileService.getFileInfo(file)
        });
        simutransService.parse(file, this.onParseFragment, this.onStatusChange);
      }
    },
    onParseFragment(label, data) {
      this.$emit("updateInfo", { label, data });
    },
    onStatusChange(status) {
      this.status = status;
    }
  }
};
</script>
