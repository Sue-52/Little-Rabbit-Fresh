<template>
  <AppTopNav />
  <AppHeader />
  <AppHeaderSticky />
  <!-- 占位符 -->
  <slot />
  <AppFooter />
</template>

<script>
import AppHeaderSticky from "@/components/AppHeaderSticky.vue";
import AppTopNav from "@/components/AppTopNav.vue";
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";
import { useStore } from "vuex";
export default {
  components: { AppTopNav, AppHeader, AppFooter, AppHeaderSticky },
  setup() {
    const store = useStore();
    store.dispatch("category/getCategories");
  },
};
</script>

<style></style>
