<template>
  <div class="xtx-bread-item">
    <!-- 用于渲染每一个具体的面包屑选项 -->
    <RouterLink v-if="path" :to="path"><slot /></RouterLink>
    <span v-else><slot /></span>
  </div>
</template>
<script>
export default {
  name: "XtxBreadItem",
  props: ["path"],
};
</script>
<style lang="less" scoped>
.xtx-bread-item {
  a {
    color: #666;
    transition: all 0.4s;
    &:hover {
      color: @xtxColor;
    }
  }
}
</style>
