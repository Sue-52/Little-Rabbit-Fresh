<template>
  <LayoutTemplate>
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
      <!-- 筛选分类 -->
      <SubFilter @onFilterChanged="updateReqParams" />
      <div class="goods-list">
        <!-- 排序组件使用 -->
        <SubSort @onSortParamsChanged="updateReqParams" />
        <!-- 商品数据 -->
        <GoodsList :goods="result.items" v-if="result" />
        <!-- 显示加载状态 -->
        <XtxInfiniteLoading
          :loading="loading"
          :finished="finished"
          @infinite="loadMore"
        />
      </div>
    </div>
  </LayoutTemplate>
</template>

<script>
import LayoutTemplate from "../LayoutTemplate.vue";
import GoodsList from "@/views/category/components/GoodsList.vue";
import SubSort from "@/views/category/components/SubSort.vue";
import SubFilter from "@/views/category/components/SubFilter.vue";
import { useStore } from "vuex";
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import { computed, ref, watch } from "vue";
import { getGoodsReq } from "@/api/category";
export default {
  components: { SubFilter, SubSort, GoodsList, LayoutTemplate },
  setup() {
    const category = useBread();
    // 获取筛选数据
    // const onParamsChanged = (data) => {
    //   console.log(data);
    // };
    // 获取排序数据
    // const onSortParamsChanged = (data) => {
    //   console.log(data);
    // };
    // 获取商品列表数据
    const { result, updateReqParams, loading, finished, loadMore } = useGoods();
    return {
      category,
      result,
      updateReqParams,
      loading,
      finished,
      loadMore,
    };
  },
};
// 面包屑层级数据
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
// 获取商品列表
function useGoods() {
  // 存储数据
  const result = ref();
  // 获取路由实例
  const route = useRoute();
  // 获取分类id、筛选条件、排序条件、分页信息
  const reqParams = ref({
    categoryId: route.params.id,
    // 第几页
    page: 1,
    // 每页多少条
    pageSize: 5,
  });
  // 定义loading、finished
  const loading = ref(false);
  const finished = ref(false);

  // getData函数封装请求
  const getData = () => {
    loading.value = true;
    // 发起请求获取数据
    getGoodsReq(reqParams.value).then((res) => {
      // 当页面为第一页时
      if (reqParams.value.page === 1) {
        result.value = res.result;
      } else {
        result.value = {
          ...result.value,
          items: [...result.value.items, ...res.result.items],
        };
        console.log(11111111111111);
      }
      // 当加载页数等于总页面数时，结束加载
      if (reqParams.value.page === res.result.pages) {
        finished.value = true;
      }
      loading.value = false;
    });
  };
  // 监听路由变化
  watch(
    () => reqParams.value,
    () => {
      getData();
    },
    {
      // 页面初始化后就直接执行一次
      immediate: true,
    }
  );

  // 用于更新数据
  const updateReqParams = (data) => {
    reqParams.value = { ...reqParams.value, ...data, page: 1 };
    // console.log(reqParams.value);
  };

  // 加载更多数据
  const loadMore = () => {
    reqParams.value = { ...reqParams.value, page: reqParams.value.page + 1 };
  };

  // 路由有变化后直接数据也要跟着一起变化
  onBeforeRouteUpdate((to) => {
    // 对象保留原来的数据，只更换ID
    reqParams.value = { categoryId: to.params.id, page: 1 };
    console.log(reqParams.value);
  });
  // 返回数据
  return { result, updateReqParams, loading, finished, loadMore };
}
</script>

<style scoped lang="less">
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
}
</style>
