<template>
  <header>
    <b-navbar toggleable="md" type="light" variant="white" class="global-menu">
      <b-container>
        <b-navbar-brand @click="handleClick('トップ')">{{ app_name }}</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item
              v-for="route in routes"
              :key="route.name"
              @click="handleClick(route.name)"
              :active="isCurrent(route.name)"
              class="pr-2"
            >{{route.name}}</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>
  </header>
</template>
<script>
import { PAGES } from "../../const";
import routes from "../../routes";
export default {
  data() {
    return {
      current_papage: null
    };
  },
  created() {
    this.current_papage = this.$route.name;
  },
  watch: {
    $route(to) {
      this.current_papage = to.name;
    }
  },
  computed: {
    app_name: () => process.env.VUE_APP_NAME,
    routes() {
      return routes;
    }
  },
  methods: {
    handleClick(name) {
      this.$router.push({ name }).catch(e => {});
    },
    isCurrent(name) {
      return name === this.current_papage;
    }
  }
};
</script>
<style lang="scss" scoped>
.global-menu {
  border-top: solid 4px var(--primary);
  border-bottom: solid 2px var(--light);
}
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 72;
}
.nav-link.active {
  font-weight: 900;
}
</style>