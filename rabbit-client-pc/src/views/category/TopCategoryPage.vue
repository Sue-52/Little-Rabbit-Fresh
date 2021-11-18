<template>
  <div class="container">
    <XtxBread>
      <XtxBreadItem path="/">首页</XtxBreadItem>
      <Transition name="fade-right" mode="out-in">
        <!-- 为什么加 key ?
        动画执行的先决条件是元素的卸载和挂载, 而每次导航切换时, 变化的只是 category.name, 
        标签是没有变化的, 加 key 就是为了让元素发生变化, 从而执行动画, 每个分类的 ID 都不一样,
        所以分类 ID 变化, 元素必定重新渲染 -->
        <XtxBreadItem
          :key="topCategory?.id"
          :path="`/category/${topCategory?.id}`"
        >
          {{ topCategory?.name }}
        </XtxBreadItem>
        <!-- mode: 指定过渡模式
	  默认情况下入场元素的动画和离场元素的动画是同时执行的, 通过过渡模式可以更改这一默认行为
		in-out: 入场元素的动画先执行, 离场元素的动画后执行
		out-in: 离场元素的动画先执行, 入场元素的动画后执行 -->
      </Transition>
    </XtxBread>
    <!-- 轮播图 -->
    <XtxCarousel :carsousel="banners" :style="{ height: '500px' }" />
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { computed } from "vue";
import useBanners from "@/hooks/useBanners";
export default {
  setup() {
    const topCategory = useCategory();
    //#region 轮播图封装
    const { banners, getData } = useBanners();
    getData(2);
    //#endregion
    return {
      topCategory,
      banners,
    };
  },
};
function useCategory() {
  // 获取store对象
  const store = useStore();
  // 获取route对象
  const route = useRoute();
  return computed(() => {
    return store.state.category.list.find(
      (item) => item.id === route.params.id
    );
  });
}
</script>

<style></style>
