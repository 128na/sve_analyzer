<template>
  <div id="app">
    <Header />
    <transition name="fade" mode="out-in">
      <router-view :file="file" :info="info" @update="update" class="content"></router-view>
    </transition>
    <Footer />
  </div>
</template>

<script>
import PageStations from "./components/pages/PageStations";
import PageLines from "./components/pages/PageLines";
import PageLineDiagram from "./components/pages/PageLineDiagram";
import PageUsage from "./components/pages/PageUsage";
import "./scss/style.scss";
import { PAGES } from "./const";
export default {
  name: "app",
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
    update(data = null) {
      if (data) {
        this.info = data.info;
        this.file = data.file;
      } else {
        this.setDefault();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  margin-top: 5rem;
  margin-bottom: 3rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.075s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>