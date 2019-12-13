<template>
  <div>
    <b-card header="会社一覧" class="mb-3">
      <PlayersTable :info="info" />
    </b-card>
    <b-card header="駅一覧" class="mb-2">
      <StationsTable :info="info" />
    </b-card>
  </div>
</template>
<script>
export default {
  name: "StationsPage",
  props: ["info"]
};
</script>