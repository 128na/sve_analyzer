<template>
  <div>
    <input type="file" @change="handleFileChange" />

    <p>status: {{ status }}</p>
    <div>
      <strong>ファイル情報</strong>
      <p>名前：{{ info.file.name }}</p>
      <p>サイズ：{{ info.file.size }}</p>
    </div>
    <div>
      <strong>セーブデータ情報</strong>
      <p>バージョン：{{ info.simutrans.version }}</p>
      <p>pak:{{ info.simutrans.pak }}</p>
    </div>
    <div>
      <strong>マップ情報</strong>
      <p>No：{{ info.map.no }}</p>
      <p>横:{{ info.map.width }}</p>
      <p>縦:{{ info.map.depth }}</p>
    </div>
  </div>
</template>
<script>
import { STATUSES } from "../const";
import fileService from "../services/file";
import simutransService from "../services/simutrans";
export default {
  data() {
    return {
      status: "",
      info: {
        file: {},
        simutrans: {},
        map: {},
        stations: {},
        lines: {},
        players: {}
      },

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
      const file = e.target.files[0];
      if (file) {
        this.info.file = fileService.getFileInfo(file);
        fileService.parseToXML(file, this.onParsed, this.onStatusChange);
      }
    },
    onParsed(xml) {
      this.onStatusChange(STATUSES.simutrans);
      this.info.simutrans = simutransService.getSimutransInfo(xml);

      this.onStatusChange(STATUSES.map);
      this.info.map = simutransService.getMapInfo(xml);

      this.onStatusChange(STATUSES.station);
      this.info.stations = simutransService.getStations(xml);
      this.onStatusChange(STATUSES.relation);
      // simutransService.getRelations(xml);
      this.onStatusChange(STATUSES.player);
      // simutransService.getPlayers(xml);
      this.onStatusChange(STATUSES.finished);
    },
    onStatusChange(status) {
      this.status = status;
    }
  }
};
</script>
