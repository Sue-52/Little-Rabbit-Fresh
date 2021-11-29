<template>
  <div class="xtx-goods-page">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread v-if="getDetail">
        <XtxBreadItem path="/">首页</XtxBreadItem>
        <XtxBreadItem :path="`/category/${getDetail.categories[1].id}`">
          {{ getDetail.categories[1].name }}
        </XtxBreadItem>
        <XtxBreadItem :path="`/category/sub/${getDetail.categories[0].id}`">
          {{ getDetail.categories[0].name }}
        </XtxBreadItem>
        <XtxBreadItem>
          {{ getDetail.name }}
        </XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info" v-if="getDetail">
        <!-- 左侧 -->
        <div class="media">
          <!-- 放大镜 -->
          <GoodsImages :images="getDetail.mainPictures" />
          <!-- 商品销售信息 -->
          <GoodsSales
            :salesCount="getDetail.salesCount"
            :commentCount="getDetail.commentCount"
            :collectCount="getDetail.collectCount"
            :brandName="getDetail.brand.name"
          />
        </div>
        <!-- 右侧 -->
        <div class="spec">
          <GoodsInfo :goods="getDetail" />
          <GoodsSku
            :specs="getDetail.specs"
            :skus="getDetail.skus"
            :skuId="'1369155872197971970'"
            @on-spec-change="onSpecChanged"
          />
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant></GoodsRelevant>
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <div class="goods-tabs"></div>
          <!-- 注意事项 -->
          <div class="goods-warn"></div>
        </div>
        <!-- 24热榜 -->
        <div class="goods-aside"></div>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsSku from "@/views/goods/components/GoodsSku.vue";
import GoodsInfo from "@/views/goods/components/GoodsInfo.vue";
import GoodsImages from "@/views/goods/components/GoodsImages.vue";
import GoodsSales from "@/views/goods/components/GoodsSales.vue";
import { getGoodsDetailId } from "@/api/goods";
import GoodsRelevant from "@/views/goods/components/GoodsRelevant";
import { ref } from "vue";
import { useRoute, onBeforeRouteUpdate } from "vue-router";

export default {
  name: "GoodsDetailPage",
  components: { GoodsRelevant, GoodsImages, GoodsSales, GoodsInfo, GoodsSku },
  setup() {
    const route = useRoute();

    const { getDetail, getData } = useGoods();
    getData(route.params.id);
    const onSpecChanged = (sku) => {
      getDetail.value.price = sku.price;
      getDetail.value.oldPrice = sku.oldPrice;
      getDetail.value.inventory = sku.inventory;
    };

    return { getDetail, onSpecChanged };
  },
};
function useGoods() {
  const getDetail = ref(null);
  const getData = async (id) => {
    const { result } = await getGoodsDetailId(id);
    getDetail.value = result;
  };
  onBeforeRouteUpdate((to) => getData(to.params.id));
  return { getDetail, getData };
}
</script>

<style scoped lang="less">
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-tabs {
  min-height: 600px;
  background: #fff;
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
