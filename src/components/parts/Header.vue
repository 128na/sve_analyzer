<template>
  <header>
    <b-navbar toggleable="md" type="light" variant="white" class="global-menu">
      <b-container>
        <b-navbar-brand @click="handleClick('トップ')">{{ app_name }}</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item
              v-for="(label, name) in pages"
              :key="name"
              @click="handleClick(label)"
              :active="is_current(label)"
              class="pr-2"
            >{{label}}</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>
  </header>
</template>
<script>
import { PAGES } from "../../const";
export default {
  props: ["current_page"],
  computed: {
    app_name: () => process.env.VUE_APP_NAME,
    pages() {
      return PAGES;
    }
  },
  methods: {
    handleClick(page) {
      this.$emit("change_page", page);
    },
    is_current(page) {
      return page === this.current_page;
    }
  }
};
</script>
<style lang="scss" scoped>
.global-menu {
  border-top: solid 4px var(--primary);
  border-bottom: solid 2px var(--light);
}
.nav-link.active {
  font-weight: 900;
}
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 72;
}
</style>