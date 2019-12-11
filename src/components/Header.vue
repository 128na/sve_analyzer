<template>
  <div>
    <b-navbar toggleable="sm" type="light" variant="white" class="global-menu">
      <b-container>
        <b-navbar-brand href="#">{{ app_name }}</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item href="https://github.com/128na/sve_analyzer" target="_blank">GitHub</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>
  </div>
</template>
<script>
export default {
  computed: {
    app_name: () => process.env.VUE_APP_NAME,
    app_version: () => process.env.VUE_APP_VERSION
  }
};
</script>
<style lang="scss" scoped>
.global-menu {
  border-top: solid 4px var(--primary);
  border-bottom: solid 2px var(--light);
}
</style>