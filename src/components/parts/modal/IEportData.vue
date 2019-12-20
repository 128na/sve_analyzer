<template>
  <div>
    <b-button v-b-modal.ieport variant="outline-secondary" size="sm">エクスポート・インポート機能</b-button>
    <b-modal id="ieport" title="エクスポート・インポート" :hide-footer="true">
      <p>
        <small>
          解析したデータの保存、読み込みができます。
          <br />JSON：データをそのまま保存します。インポートで再度読み込み可能です。
          <br />CSV：データをExcelなどで読み込める形式で保存します。
          <br />テキスト：データをテキストで保存します。
        </small>
      </p>
      <b-form-group label="エクスポート">
        <b-form-select v-model="format" :options="formats" :disabled="!can_export" />
      </b-form-group>
      <b-button variant="primary" @click="handleExport" :disabled="!can_export">エクスポート</b-button>
      <hr />
      <b-form-group label="インポート">
        <b-form-file
          v-model="import_file"
          placeholder="ファイルを選択、ドロップ"
          drop-placeholder="ドロップ"
          accept=".json"
          browse-text="選択"
        ></b-form-file>
      </b-form-group>
      <b-button variant="primary" @click="handleImport" :disabled="!import_file">インポート</b-button>
    </b-modal>
  </div>
</template>
<script>
import exportService from "../../../services/exporter";
import importService from "../../../services/importer";
import { toastControl } from "../../../mixins";
export default {
  props: ["file", "info", "can_export"],
  mixins: [toastControl],
  data() {
    return {
      formats: exportService.getFormats(),
      format: exportService.getFormats()[0].value,
      import_file: null
    };
  },
  methods: {
    handleExport() {
      const name = this.file.name;
      const type = this.format;
      const data = {
        file: this.file,
        info: this.info
      };

      exportService.download({ type, data, name });
      this.toast("エクスポートしました");
    },
    async handleImport() {
      await this.$emit("update");
      await this.$nextTick();
      const data = await importService.importFrom(this.import_file).catch(e => {
        this.toastDanger(`インポートに失敗しました：\n ${e.message}`);
      });
      await this.$nextTick();
      if (data) {
        await this.$emit("update", data);
        this.toast("インポートしました");
      }
    }
  }
};
</script>