<template>
  <LayoutTemplate>
    <div class="xtx-goods-page" v-if="getDetail">
      <div class="container">
        <!-- 面包屑 -->
        <XtxBread>
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
        <div class="goods-info">
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
              :skuId="''"
              @on-spec-change="onSpecChanged"
              @onSpecHalfChanged="getDetail.currentSkuId = null"
            />
            <!-- 数量 -->
            <XtxNumberBox
              label="数量"
              v-model="goodsCount"
              :inventory="getDetail.inventory"
            />
            <!-- 添加到购物车按钮 -->
            <XtxButton
              @click="addCart"
              type="primary"
              size="large"
              style="margin-top: 15px"
              >加入购物车</XtxButton
            >
          </div>
        </div>
        <!-- 商品推荐 -->
        <GoodsRelevant :goodsId="getDetail.id"></GoodsRelevant>
        <!-- 商品详情 -->
        <div class="goods-footer">
          <div class="goods-article">
            <!-- 商品+评价 -->
            <div class="goods-tabs">
              <GoodsTab />
            </div>
            <!-- 注意事项 -->
            <div class="goods-warn">
              <GoodsWarn />
            </div>
          </div>
          <!-- 24热榜 -->
          <div class="goods-aside">
            <GoodsHot :type="1" />
            <GoodsHot :type="2" />
            <GoodsHot :type="3" />
          </div>
        </div>
      </div>
    </div>
  </LayoutTemplate>
</template>

<script>
import LayoutTemplate from "../LayoutTemplate.vue";
import GoodsWarn from "@/views/goods/components/GoodsWarn.vue";
import GoodsHot from "@/views/goods/components/GoodsHot.vue";
import GoodsTab from "@/views/goods/components/GoodsTab.vue";
import GoodsSku from "@/views/goods/components/GoodsSku.vue";
import GoodsInfo from "@/views/goods/components/GoodsInfo.vue";
import GoodsImages from "@/views/goods/components/GoodsImages.vue";
import GoodsSales from "@/views/goods/components/GoodsSales.vue";
import { getGoodsDetailId } from "@/api/goods";
import GoodsRelevant from "@/views/goods/components/GoodsRelevant";
import Message from "@/components/library/Message";
import { provide, ref } from "vue";
import { useRoute, onBeforeRouteUpdate } from "vue-router";
import { useStore } from "vuex";

export default {
  name: "GoodsDetailPage",
  components: {
    GoodsRelevant,
    GoodsImages,
    GoodsSales,
    GoodsInfo,
    GoodsSku,
    GoodsTab,
    GoodsHot,
    GoodsWarn,
    LayoutTemplate,
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    const { getDetail, getData } = useGoods();
    getData(route.params.id);
    const onSpecChanged = (sku) => {
      getDetail.value.price = sku.price;
      getDetail.value.oldPrice = sku.oldPrice;
      getDetail.value.inventory = sku.inventory;
      getDetail.value.currentSkuId = sku.skuId;
      getDetail.value.attrsText = sku.attrsText;
      console.log(sku);
    };
    const goodsCount = ref(1);
    provide("getDetail", getDetail);
    // 手机商品信息
    const addCart = () => {
      // 判断用户是否选择了规格
      if (!getDetail.value.currentSkuId) {
        return Message({ type: "error", text: "请选择商品规格" });
      }
      const goods = {
        // 商品id
        id: getDetail.value.id,
        // 商品 skuId
        skuId: getDetail.value.currentSkuId,
        // 商品名称
        name: getDetail.value.name,
        // 商品规格属性文字
        attrsText: getDetail.value.attrsText,
        // 商品图片
        picture: getDetail.value.mainPictures[0],
        // 商品原价
        price: getDetail.value.oldPrice,
        // 商品现价
        nowPrice: getDetail.value.price,
        // 是否选中
        selected: true,
        // 商品库存
        stock: getDetail.value.inventory,
        // 用户选择的商品数量
        count: goodsCount.value,
        // 是否为有效商品
        isEffective: true,
      };
      // console.log(goods);
      store.dispatch("cart/addGoodsToCart", goods);
    };

    return { getDetail, onSpecChanged, goodsCount, addCart };
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
