<template>
  <div class="container">
    <XtxBread>
      <XtxBreadItem path="/">首页</XtxBreadItem>
      <XtxBreadItem :path="`/category/${category?.TopCategory?.id}`">
        {{ category?.TopCategory?.name }}
      </XtxBreadItem>
      <Transition name="fade-right" mode="out-in">
        <XtxBreadItem
          :key="category?.SubCategory?.id"
          :path="`/category/sub/${category?.SubCategory?.id}`"
        >
          {{ category?.SubCategory?.name }}
        </XtxBreadItem>
      </Transition>
    </XtxBread>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { computed } from "vue";
export default {
  setup() {
    const category = useBread();
    return {
      category,
    };
  },
};
function useBread() {
  const store = useStore();
  const route = useRoute();
  return computed(() => {
    // 临时存储一级分类
    let TopCategory = null;
    // 临时存储二级分类
    let SubCategory = null;
    // 遍历一级分类
    store.state.category.list.forEach((top) => {
      // 遍历二级分类
      top.children?.forEach((sub) => {
        // 判断当前路由的id是否和二级分类的id相等
        if (sub.id === route.params.id) {
          // 如果相等，则将二级分类存储到临时变量中
          TopCategory = top;
          SubCategory = sub;
        }
      });
    });
    return {
      TopCategory,
      SubCategory,
    };
  });
}
</script>

<style></style>
