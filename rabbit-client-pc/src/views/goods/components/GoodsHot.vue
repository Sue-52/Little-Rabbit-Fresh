<template>
  <div class="goods-hot" v-if="hotGoods">
    <h3>{{ typeName }}</h3>
    <GoodsItem
      v-for="item in hotGoods"
      :key="item.id"
      :goods="item"
    ></GoodsItem>
  </div>
</template>
<script>
import { getGoodsHotApi } from "@/api/goods";
import GoodsItem from "@/views/category/components/GoodsItem";
import { ref } from "vue";
import { useRoute, onBeforeRouteUpdate } from "vue-router";
export default {
  name: "GoodsHot",
  components: { GoodsItem },
  props: {
    type: {
      type: Number,
      default: 1,
    },
  },
  setup(props) {
    const { hotGoods, typeName } = useHotGoods(props.type);
    // console.log(hotGoods);
    return {
      hotGoods,
      typeName,
    };
  },
};
function useHotGoods(type) {
  const route = useRoute();
  const hotGoods = ref();
  const names = { 1: "24小时热销榜", 2: "周热销榜", 3: "总热销榜" };
  const getData = (id) => {
    getGoodsHotApi({ id, type }).then((res) => {
      hotGoods.value = res.result;
    });
  };
  getData(route.params.id);
  // 当路由切换后自动改变数据
  onBeforeRouteUpdate((to) => getData(to.params.id));
  return {
    hotGoods,
    typeName: names[type],
  };
}
</script>
<style scoped lang="less">
.goods-hot {
  h3 {
    height: 70px;
    background: @helpColor;
    color: #fff;
    font-size: 18px;
    line-height: 70px;
    padding-left: 25px;
    margin-bottom: 10px;
    font-weight: normal;
  }
  :deep(.goods-item) {
    background: #fff;
    width: 100%;
    margin-bottom: 10px;
    img {
      width: 200px;
      height: 200px;
    }
    p {
      margin: 0 10px;
    }
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
}
</style>
