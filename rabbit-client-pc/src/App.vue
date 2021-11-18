<template>
  <LayoutTemplate>
    <router-view />
  </LayoutTemplate>
</template>
<script>
import LayoutTemplate from "./views/LayoutTemplate.vue";
export default {
  components: { LayoutTemplate },
  name: "App",
  setup() {},
};
</script>

<style lang="less" scoped>
.box {
  color: @xtxColor;
}
</style>
