<template>
  <div id="app">
    <Header />
    <b-container class="container my-4">
      <p class="mb-5">
        Simutrans のセーブデータを解析し、駅一覧などを表示できます。
        <br />対応形式 : xml、対応バージョン : 120.0~
        <br />時間目安：1280x640マス、約82万‬タイルで5分程度（PCスペックによります）
      </p>
      <div class="mb-5">
        <FileReader @updateFile="updateFile" @updateInfo="updateInfo" @select="setDefault" />
      </div>
      <div>
        <InfoTable :file="file" :info="info" />
      </div>
    </b-container>
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import FileReader from "./components/FileReader.vue";
import InfoTable from "./components/InfoTable.vue";
import "./scss/style.scss";

export default {
  name: "app",
  components: {
    Header,
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
    this.setMock();
    // this.setDefault();
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
    updateInfo({ data }) {
      this.info = data;
    }
  }
};
</script>