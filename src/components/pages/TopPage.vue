<template>
  <div>
    <p class="mb-4">
      Simutrans のセーブデータを解析し、駅一覧などを表示できます。
      <small>
        <br />対応形式：xml, xml_zipped, xml_bzip2
        <br />対応バージョン：120.0~
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
      <SummaryTable :file="file" :info="info" v-show="analyzed" />
    </div>
  </div>
</template>
<script>
export default {
  name: "TopPage",
  props: ["file", "info"],
  data() {
    return {
      analyzed: false
    };
  },
  methods: {
    update(data) {
      if (data) {
        this.analyzed = true;
      } else {
        this.analyzed = false;
      }
      this.$emit("update", data);
    }
  }
};
</script>