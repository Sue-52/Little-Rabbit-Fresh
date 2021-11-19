<template>
  <!-- 筛选区 -->
  <div v-if="SubCategoryFilter && !filtersLoading" class="sub-filter">
    <!-- 品牌栏 -->
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a
          v-for="brand in SubCategoryFilter?.brands"
          @click="
            SubCategoryFilter.selectedBrandId = brand.id;
            updateSelectedFilters();
          "
          :class="{ active: SubCategoryFilter.selectedBrandId === brand.id }"
          :key="brand.id"
        >
          {{ brand.name }}
        </a>
      </div>
    </div>
    <!-- 其他 -->
    <div
      class="item"
      v-for="item in SubCategoryFilter?.saleProperties"
      :key="item.id"
    >
      <div class="head">{{ item.name }}：</div>
      <div class="body">
        <a
          href="javascript:"
          v-for="sub in item.properties"
          @click="
            item.selectedFilterName = sub.name;
            updateSelectedFilters();
          "
          :class="{ active: item.selectedFilterName === sub.name }"
          :key="sub.id"
        >
          <!-- {{ sub }} -->
          {{ sub.name }}
        </a>
      </div>
    </div>
  </div>
  <div v-else class="sub-filter">
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
  </div>
</template>

<script>
import { getSubCategoryFilterById } from "@/api/category";
import { ref } from "vue";
import { onBeforeRouteUpdate, useRoute } from "vue-router";

export default {
  name: "SubFilter",
  setup(props, { emit }) {
    const route = useRoute();
    const {
      SubCategoryFilter,
      getData,
      updateSelectedFilters,
      filtersLoading,
    } = useSubCategoryFilter(emit);
    getData(route.params.id);
    return {
      SubCategoryFilter,
      updateSelectedFilters,
      filtersLoading,
    };
  },
};
/**
 * 获取子分类筛选数据
 */
function useSubCategoryFilter(emit) {
  // 获取总体筛选数据
  const SubCategoryFilter = ref(null);
  // 获取筛选分类数据
  const selectedFilters = {
    brandId: null,
    attrs: [],
  };
  const filtersLoading = ref(false);

  //#region 1.发请求获取筛选数据
  const getData = (id) => {
    // 加载状态
    filtersLoading.value = true;
    getSubCategoryFilterById(id).then((res) => {
      // 动态添加 元素
      res.result.brands.unshift({ name: "全部", id: null });
      // 将品牌ID设为 null 则全选选中
      res.result.selectedBrandId = null;
      // 便利筛选属性

      res.result.saleProperties.forEach((item) => {
        // 将其他筛选属性设为全选则全选选中
        item.selectedFilterName = "全部";
        item.properties.unshift({ name: "全部", id: null });
      });
      SubCategoryFilter.value = res.result;
      filtersLoading.value = false;
    });
  };
  //#endregion

  //#region 2.用于获取用户选择的筛选条件
  const updateSelectedFilters = () => {
    // 汇总品牌ID
    selectedFilters.brandId = SubCategoryFilter.value.selectedBrandId;
    // 清空数据
    selectedFilters.attrs = [];
    // 便利筛选属性
    SubCategoryFilter.value.saleProperties.forEach((item) => {
      // 如果用户选择了全部，则不添加
      if (item.selectedFilterName && item.selectedFilterName !== "全部") {
        // 添加筛选条件
        selectedFilters.attrs.push({
          groupName: item.name,
          propertyName: item.selectedFilterName,
        });
      }
    });
    // 子传父，通知父组件
    emit("onFilterChanged", selectedFilters);
  };
  //#endregion

  // 因为在页面切换后，只是将路由变化了，并未重新渲染页面，所以需要在路由变化后，重新获取数据。
  // 1.2 这样就可以实时获取数据
  onBeforeRouteUpdate((to) => getData(to.params.id));
  return {
    SubCategoryFilter,
    getData,
    updateSelectedFilters,
    filtersLoading,
  };
}
</script>
<style scoped lang="less">
// 筛选区
.sub-filter {
  background: #fff;
  padding: 25px;
  .item {
    display: flex;
    line-height: 40px;
    .head {
      width: 80px;
      color: #999;
    }
    .body {
      flex: 1;
      a {
        margin-right: 36px;
        transition: all 0.3s;
        display: inline-block;
        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
}

.xtx-skeleton {
  padding: 10px 0;
}
</style>
