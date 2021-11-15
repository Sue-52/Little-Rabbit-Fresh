<template>
  <HomePanel title="新鲜好物" subTitle="新鲜出炉 品质靠谱">
    <template v-slot:right>
      <XtxMore />
    </template>
    <template v-slot:default>
      <ul class="goods-list">
        <li v-for="item in goods" :key="item.id">
          <RouterLink to="/">
            <img :src="item.picture" :alt="item.name" />
            <p class="name ellipsis">{{ item.name }}</p>
            <p class="price">&yen;{{ item.price }}</p>
          </RouterLink>
        </li>
      </ul>
    </template>
  </HomePanel>
</template>
<script>
import { getNewGoods } from "@/api/home";
import HomePanel from "@/views/home/components/HomePanel";
import { ref } from "vue";
export default {
  name: "HomeNew",
  components: { HomePanel },
  setup() {
    const { goods, getData } = useNewGoods();
    getData();
    return {
      goods,
    };
  },
};
function useNewGoods() {
  const goods = ref();
  const getData = () => {
    getNewGoods().then((res) => {
      goods.value = res.result;
    });
  };
  return { goods, getData };
}
</script>
<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>
