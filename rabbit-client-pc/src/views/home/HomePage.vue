<template>
  <LayoutTemplate>
    <div class="container">
      <HomeCategory />
      <HomeBanner />
      <!-- 新鲜好物 -->
      <HomeNew />
      <!-- 人气推荐 -->
      <HomeHot />
    </div>
  </LayoutTemplate>
</template>

<script>
import HomeHot from "./components/HomeHot.vue";
import HomeNew from "./components/HomeNew.vue";
import LayoutTemplate from "@/views/LayoutTemplate.vue";
import HomeCategory from "@/views/home/components/HomeCategory.vue";
import HomeBanner from "@/views/home/components/HomeBanner.vue";
export default {
  components: {
    LayoutTemplate,
    HomeCategory,
    HomeBanner,
    HomeNew,
    HomeHot,
  },
  name: "HomePage",
};
</script>

<style></style>
