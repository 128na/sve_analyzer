<template>
  <div id="app">
    <h3>
      セーブデータから路線情報とかを取得するやつ
      <small>version 3.34</small>
    </h3>
    <FileReader @updateFile="updateFile" @updateInfo="updateInfo" @select="setDefault" />
    <InfoTable :file="file" :info="info" />
  </div>
</template>

<script>
import FileReader from "./components/FileReader.vue";
import InfoTable from "./components/InfoTable.vue";

export default {
  name: "app",
  components: {
    InfoTable,
    FileReader
  },
  data() {
    return {
      file: null,
      info: null
    };
  },
  created() {
    this.setDefault();
  },
  methods: {
    setDefault() {
      this.file = {
        name: "--",
        size: 0
      };
      this.info = {
        simutrans: {},
        map: {},
        stations: [],
        lines: [],
        players: [],
        lines: []
      };
    },
    updateFile(file) {
      this.file = file;
    },
    updateInfo({ data }) {
      this.info = data;
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
