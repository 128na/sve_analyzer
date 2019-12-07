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
      <p>x:{{ info.map.x }}</p>
      <p>y:{{ info.map.y }}</p>
    </div>
  </div>
</template>
<script>
import fileService from "../services/file";
import simutransService from "../services/simutrans";
export default {
  data() {
    return {
      status: "",
      info: {
        file: {},
        simutrans: {},
        map: {}
      },

      xml: null
    };
  },
  watch: {
    status(s) {
      // console.log(s);
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
      this.info.simutrans = simutransService.getSimutransInfo(xml);
      this.info.map = simutransService.getMapInfo(xml);
      // console.log(simutransService.getStations(xml));
      // console.log(simutransService.getRelations(xml));
      // console.log(simutransService.getPlayers(xml));
    },
    onStatusChange(status) {
      this.status = status;
    }
  }
};
</script>
