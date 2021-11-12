<template>
  <div class="home-category">
    <ul class="menu">
      <li v-for="item in menuList" :key="item.id">
        <router-link :to="`/category/${item.id}`">{{ item.name }}</router-link>
        <router-link
          v-for="sub in item.children"
          :key="sub.id"
          :to="`/category/sub/${sub.id}`"
          >{{ sub.name }}</router-link
        >
      </li>
    </ul>
  </div>
</template>

<script>
import { computed, ref } from "@vue/reactivity";
import { useStore } from "vuex";

export default {
  name: "HomeCategory",
  setup() {
    return {
      menuList: useMenuList(),
    };
  },
};
/** 将左侧列表抽取成单独的逻辑
 * returns {Array}
 */
function useMenuList() {
  const store = useStore();
  // 品牌数据
  const brand = ref({
    name: "品牌",
    id: "brand",
    children: [{ name: "品牌推荐", id: "brand-recommend" }],
    brands: [],
  });
  // 分类数据
  const category = computed(() => {
    // 获取分类数据,并便利
    const list = store.state.category.list.map((item) => ({
      ...item,
      // 分类下的子分类，我们只需要2个数据
      children: item.children ? item.children.slice(0, 2) : [],
    }));
    // 将品牌数据插入到分类数据
    list.push(brand.value);
    // 返回 list
    return list;
  });

  return category;
}
</script>
<style scoped lang="less">
.home-category {
  width: 250px;
  height: 500px;
  background: rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 99;
  .menu {
    li {
      padding-left: 40px;
      height: 50px;
      line-height: 50px;
      &:hover {
        background-color: @xtxColor;
      }
      a {
        margin-right: 4px;
        color: #fff;
        &:first-child {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
