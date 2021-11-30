<template>
  <div class="goods-tabs">
    <nav>
      <a
        href="javascript:"
        @click="activeComponentName = 'GoodsDetail'"
        :class="{ active: activeComponentName === 'GoodsDetail' }"
      >
        商品详情
      </a>
      <a
        href="javascript:"
        @click="activeComponentName = 'GoodsComment'"
        :class="{ active: activeComponentName === 'GoodsComment' }"
      >
        商品评价 <span>(500+)</span>
      </a>
    </nav>
    <!-- 切换内容的地方 -->
    <!-- 根据组件名称动态渲染组件 -->
    <component :is="activeComponentName"></component>
  </div>
</template>
<script>
import { ref } from "vue";
import GoodsDetail from "@/views/goods/components/GoodsDetail.vue";
import GoodsComment from "@/views/goods/components/GoodsComment.vue";
export default {
  name: "GoodsTab",
  setup() {
    const activeComponentName = ref("GoodsDetail");
    return {
      activeComponentName,
    };
  },
  components: {
    GoodsDetail,
    GoodsComment,
  },
};
</script>
<style lang="less" scoped>
.goods-tabs {
  min-height: 600px;
  background: #fff;
  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;
      > span {
        color: @priceColor;
        font-size: 16px;
        margin-left: 10px;
      }
      &:first-child {
        border-right: 1px solid #f5f5f5;
      }
      &.active {
        &::before {
          content: "";
          position: absolute;
          left: 40px;
          bottom: -1px;
          width: 72px;
          height: 2px;
          background: @xtxColor;
        }
      }
    }
  }
}
</style>
