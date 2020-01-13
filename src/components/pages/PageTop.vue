<template>
  <b-container>
    <p class="mb-4">Simutrans のセーブデータを解析し、駅一覧などを表示できます。</p>
    <div class="mb-4">
      <FileReader @update="update" :analyzing="analyzing" />
    </div>
    <div class="mb-4">
      <IEportData :file="file" :info="info" @update="update" :can_export="analyzed" />
    </div>
    <div>
      <SummaryTable :file="file" :info="info" v-show="analyzed" />
    </div>
  </b-container>
</template>
<script>
import { toastControl } from "../../mixins";
export default {
  name: "TopPage",
  props: ["file", "info"],
  mixins: [toastControl],
  data() {
    return {
      analyzing: false
    };
  },
  computed: {
    analyzed() {
      return this.info.simutrans.version;
    }
  },
  methods: {
    update(data) {
      if (data) {
        this.analyzing = false;
      } else {
        this.analyzing = true;
      }
      this.$emit("update", data);
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.analyzing) {
      next();
    } else {
      this.toastWarn("解析中はページを切替できません");
    }
  }
};
</script>