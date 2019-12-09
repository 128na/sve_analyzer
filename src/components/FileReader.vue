<template>
  <div>
    <input type="file" @change="handleFileChange" />
    <p>進捗：{{ status }}</p>
  </div>
</template>
<script>
import { STATUSES } from "../const";
import fileService from "../services/file";
import simutransService from "../services/simutrans_stream";
export default {
  data() {
    return {
      status: STATUSES.READY,
      xml: null
    };
  },
  watch: {
    status(s) {
      console.log(s);
    }
  },
  methods: {
    async handleFileChange(e) {
      await this.onStatusChange(STATUSES.START);
      this.$emit("select");
      const file = e.target.files[0];
      if (file) {
        this.$emit("update", {
          label: "file",
          data: fileService.getFileInfo(file)
        });
        const data = await simutransService.parse(file, this.onStatusChange);

        this.emitUpdate(data);

        await this.onStatusChange(STATUSES.FINISHED);
      }
    },
    emitUpdate(data) {
      this.$emit("update", { label: "simutrans", data: data.simutrans });
      this.$emit("update", { label: "map", data: data.map });
      this.$emit("update", { label: "stations", data: data.stations });
      this.$emit("update", { label: "players", data: data.players });
    },
    async onStatusChange(status) {
      this.status = status;
      await this.$nextTick();
    }
  }
};
</script>
