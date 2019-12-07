<template>
  <div>
    <input type="file" @change="handleFileChange" />

    <p>status: {{ status }}</p>
    <p>file_name: {{ file_name }}</p>
    <p>file_size: {{ file_size }}</p>
    <p>file_type: {{ file_type }}</p>
    <p>version: {{ simutrans.version }}</p>
    <p>pak: {{ simutrans.pak }}</p>
  </div>
</template>
<script>
const STATUSES = {
  file_ready: "-",
  file_start: "ファイル読込：開始",
  file_progress: e => `読み込み中... ${e.loaded}bytes / ${e.total}bytes `,
  file_abort: "ファイル読込：中断",
  file_error: "ファイル読込：失敗",
  xml_start: "XMLパース：開始",
  xml_end: "XMLパース：完了"
};
const sveParser = {
  status: null,
  init() {},
  version: null,
  pak: null
};

export default {
  data() {
    return {
      status: "",
      file_name: "",
      file_size: "",
      file_type: "",
      simutrans: {},
      reader: new FileReader(),
      parser: new DOMParser()
    };
  },
  watch: {
    status(s) {
      console.log(s);
    }
  },
  created() {
    this.reader.onabort = e => {
      this.status = STATUSES.file_abort;
      console.warn(e);
    };
    this.reader.onerror = e => {
      this.status = STATUSES.file_error;
      console.warn(e);
    };
    this.reader.onloadstart = e => {
      this.status = STATUSES.file_start;
    };
    this.reader.onprogress = e => {
      this.status = STATUSES.file_progress(e);
    };
    this.reader.onload = e => {
      this.status = STATUSES.xml_start;
      const parser = new DOMParser();
      const xml = this.parser.parseFromString(e.target.result, "text/xml");
      this.status = STATUSES.xml_end;
      this.readSimutransInfo(xml);
    };
  },
  methods: {
    handleFileChange(e) {
      if (e.target.files[0]) {
        this.readFile(e.target.files[0]);
      }
    },
    readFile(file) {
      this.readFileInfo(file);
      this.readFileContent(file);
    },
    readFileInfo(file) {
      console.log(file);
      this.file_name = file.name;
      this.file_size = file.size;
      this.file_type = file.type;
    },
    readFileContent(file) {
      this.reader.readAsText(file);
    },
    readSimutransInfo(xml) {
      const res = xml.querySelector("Simutrans");
      this.simutrans.version = res.getAttribute("version");
      this.simutrans.pak = res.getAttribute("pak");
    }
  }
};
</script>
