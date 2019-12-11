<template>
  <div id="app">
    <Header />
    <b-container class="container my-4 main">
      <p class="mb-4">
        Simutrans のセーブデータを解析し、駅一覧などを表示できます。
        <small>
          <br />対応形式：xml、対応バージョン：120.0~
          <br />時間目安：1280x640マス、約82万‬タイルで5分程度（PCスペックによります）
        </small>
      </p>
      <div class="mb-4">
        <FileReader @update="update" />
      </div>
      <div class="mb-4">
        <IEportData :file="file" :info="info" @update="update" :can_export="analyzed" />
      </div>
      <div>
        <InfoTable :file="file" :info="info" v-show="analyzed" />
      </div>
    </b-container>
    <Footer />
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import IEportData from "./components/IEportData.vue";
import FileReader from "./components/FileReader.vue";
import InfoTable from "./components/InfoTable.vue";
import "./scss/style.scss";

export default {
  name: "app",
  components: {
    Header,
    Footer,
    InfoTable,
    FileReader,
    IEportData
  },
  data() {
    return {
      analyzed: false,
      file: null,
      info: null
    };
  },
  created() {
    // this.setMock();
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
    //表示テスト用モック
    setMock() {
      this.file = {
        name: "mock.sve",
        size: 1145141919,
        type: "xml"
      };
      this.info = {
        simutrans: {
          version: "121.9.9",
          pak: "pak-128 mock"
        },
        map: {
          width: 1024,
          depth: 768,
          no: 334
        },
        stations: [...Array(6)]
          .map((_, p) =>
            [...Array(20)].map((__, i) => {
              const id = p * 20 + i + 1;
              return {
                id: id,
                player_id: p,
                name: `テスト${p}-${i}駅`,
                coordinates: [[p, i, 0]]
              };
            })
          )
          .flat(),
        lines: [],
        players: [...Array(6)].map((_, p) => {
          return { id: p, name: `会社 ${p}`, type: 1 };
        }),
        lines: []
      };
    },
    updateFile(file) {
      this.file = file;
    },
    updateInfo(data = null) {
      if (data) {
        this.info = data;
        this.analyzed = true;
      } else {
        this.setDefault();
        this.analyzed = false;
      }
    },
    update(data = null) {
      if (data) {
        this.info = data.info;
        this.file = data.file;
        this.analyzed = true;
      } else {
        this.setDefault();
        this.analyzed = false;
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
  }
}
</style>