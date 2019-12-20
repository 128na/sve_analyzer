<template>
  <div>
    <p class="mb-4">Simutrans のセーブデータを解析し、駅一覧などを表示できます。</p>
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