<template>
  <div class="box">box</div>
  <router-view />
</template>
<script>
export default {
  name: "App",
  setup() {},
};
</script>

<style lang="less" scoped>
.box {
  color: @xtxColor;
}
</style>
