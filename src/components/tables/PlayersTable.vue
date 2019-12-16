// 会社一覧テーブル
<template>
  <div>
    <b-table hover :items="info.players"></b-table>
  </div>
</template>
<script>
export default {
  props: ["info"]
};
</script>
