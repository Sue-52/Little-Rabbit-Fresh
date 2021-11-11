<template>
  <AppTopNav />
  <AppHeader />
  <!-- 占位符 -->
  <slot />
  <AppFooter />
</template>

<script>
import AppTopNav from "@/components/AppTopNav.vue";
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";
export default {
  components: { AppTopNav, AppHeader, AppFooter },
};
</script>

<style></style>
