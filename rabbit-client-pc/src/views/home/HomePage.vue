<template>
  <div class="container">
    <HomeCategory />
    <HomeBanner />
    <!-- 新鲜好物 -->
    <HomeNew />
    <!-- 人气推荐 -->
    <HomeHot />
    <!-- 热门品牌 -->
    <HomeBrand />
    <!-- 产品区块 -->
    <HomeProduct />
    <!-- 最新专题 -->
    <HomeSpecial />
  </div>
</template>

<script>
import HomeSpecial from "./components/HomeSpecial.vue";
import HomeProduct from "./components/HomeProduct.vue";
import HomeBrand from "./components/HomeBrand.vue";
import HomeHot from "./components/HomeHot.vue";
import HomeNew from "./components/HomeNew.vue";
import HomeCategory from "@/views/home/components/HomeCategory.vue";
import HomeBanner from "@/views/home/components/HomeBanner.vue";
export default {
  components: {
    HomeCategory,
    HomeBanner,
    HomeNew,
    HomeHot,
    HomeBrand,
    HomeProduct,
    HomeSpecial,
  },
  name: "HomePage",
};
</script>

<style></style>
