<template>
  <div id="app">
    <FileReader />
  </div>
</template>

<script>
import FileReader from "./components/FileReader.vue";

export default {
  name: "app",
  components: {
    FileReader
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
