<template>
  <div class="ref-goods" v-for="item in topCategory?.children" :key="item.id">
    <div class="head">
      <h3>- {{ item.name }} -</h3>
      <p class="tag">温暖柔软，品质之选</p>
      <XtxMore />
    </div>
    <div class="body">
      <GoodsItem :goods="sub" v-for="sub in item.goods" :key="sub.id" />
    </div>
  </div>
</template>

<script>
import GoodsItem from "@/views/category/components/GoodsItem";
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import { ref } from "vue";
import { getTopCategoryById } from "@/api/category";
export default {
  name: "CommandGoods",
  components: { GoodsItem },
  setup() {
    const route = useRoute();
    const { topCategory, getData } = useTopCategory();
    getData(route.params.id);
    return {
      topCategory,
    };
  },
};
function useTopCategory() {
  const topCategory = ref(null);
  const getData = (id) => {
    getTopCategoryById(id).then((res) => {
      topCategory.value = res.result;
    });
  };
  // 当路由发生变化后重新获取路由id数据
  onBeforeRouteUpdate((to) => getData(to.params.id));
  return { topCategory, getData };
}
</script>
<style lang="less" scoped>
.ref-goods {
  background-color: #fff;
  margin-top: 20px;
  position: relative;
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .head {
    .xtx-more {
      position: absolute;
      top: 20px;
      right: 20px;
    }
    .tag {
      text-align: center;
      color: #999;
      font-size: 20px;
      position: relative;
      top: -20px;
    }
  }
  .body {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0 65px 30px;
  }
}
</style>
