<template>
  <LayoutTemplate>
    <div class="container">
      <HomeCategory />
    </div>
  </LayoutTemplate>
</template>

<script>
import LayoutTemplate from "@/views/LayoutTemplate.vue";
import HomeCategory from "@/views/home/components/HomeCategory.vue";
export default {
  components: {
    LayoutTemplate,
    HomeCategory,
  },
  name: "HomePage",
};
</script>

<style></style>
