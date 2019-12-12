<template>
  <footer class="bg-dark">
    <b-container class>
      <small>
        <span class="text-white mr-2">version {{ app_version }}</span>
        <a href="https://github.com/128na/sve_analyzer" target="_blank" class="text-white">GitHub</a>
      </small>
    </b-container>
  </footer>
</template>
<script>
export default {
  computed: {
    app_version: () => process.env.VUE_APP_VERSION
  }
};
</script>
<style lang="scss" scoped>
footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 72;
}
</style>