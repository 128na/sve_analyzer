<template>
  <footer class="bg-dark">
    <b-container class="footer">
      <small class="text-white">version {{ app_version }}</small>
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