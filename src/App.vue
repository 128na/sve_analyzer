<template>
  <div id="app">
    <Header :current_page="current_page" @change_page="change_page" />
    <b-container class="my-4 main bg-white px-0">
      <transition-group name="fade">
        <PageTop
          class="content"
          v-show="is_top"
          :file="file"
          :info="info"
          @update="update"
          key="top"
        />
        <div class="content" v-if="!is_top" :is="component" :info="info" :key="component.name" />
      </transition-group>
    </b-container>
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
      info: null,
      current_page: PAGES.TOP
    };
  },
  created() {
    this.setDefault();
  },
  computed: {
    component() {
      switch (this.current_page) {
        case PAGES.STATIONS:
          return PageStations;
        case PAGES.LINES:
          return PageLines;
        case PAGES.LINE_DIAGRAM:
          return PageLineDiagram;
        case PAGES.USAGE:
          return PageUsage;
        default:
          return null;
      }
    },
    is_top() {
      return this.current_page === PAGES.TOP;
    }
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
    change_page(page) {
      this.current_page = page;
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
#app {
  display: flex;
  flex-direction: column;
  .main {
    flex: 1;
    position: relative;
    .content {
      position: absolute;
      left: 16px;
      right: 16px;
      margin-top: 64px;
      margin-bottom: 64px;
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>