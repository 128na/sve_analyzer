// 概要テーブル
<template>
  <div>
    <h4>概要</h4>
    <b-card-group>
      <b-card header="ファイル" class="mb-3">
        <dl>
          <dt>名前</dt>
          <dd>{{ file.name }}</dd>
          <dt>サイズ</dt>
          <dd>{{ sizeFromat(file.size) }}</dd>
          <dt>形式</dt>
          <dd>{{ file.type }}</dd>
        </dl>
      </b-card>
      <b-card header="セーブデータ" class="mb-3">
        <dl>
          <dt>Ver</dt>
          <dd>{{ info.simutrans.version }}</dd>
          <dt>Pak</dt>
          <dd>{{ info.simutrans.pak }}</dd>
        </dl>
      </b-card>
      <b-card header="マップ" class="mb-3">
        <dl>
          <dt>No</dt>
          <dd>{{ info.map.no }}</dd>
          <dt>横</dt>
          <dd>{{ info.map.width }}</dd>
          <dt>縦</dt>
          <dd>{{ info.map.depth }}</dd>
        </dl>
      </b-card>
    </b-card-group>
  </div>
</template>
<script>
import { sizeFromat } from "../../helper";
export default {
  props: ["file", "info"],
  methods: {
    sizeFromat(number) {
      return number > 0 ? sizeFromat(number) : "--";
    }
  }
};
</script>
<style lang="scss" scoped>
dl {
  display: grid;
  grid-template-columns: 4rem 1fr;
}
</style>