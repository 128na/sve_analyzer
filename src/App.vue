<template>
  <div id="app">
    <FileReader @updateInfo="updateInfo" @fileSelected="setDefault" />
    <InfoTable :info="info" />
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
      info: null
    };
  },
  created() {
    this.setDefault();
  },
  methods: {
    setDefault() {
      this.info = {
        file: {},
        simutrans: {},
        map: {},
        stations: [],
        lines: [],
        players: []
      };
    },
    updateInfo({ label, data }) {
      this.info[label] = data;
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
