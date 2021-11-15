<template>
  <div class="home-category" @mouseleave="current = null">
    <ul class="menu">
      <!-- 注意: 此弹层结构放在 ul.menu 下面 -->
      <div class="layer" v-if="current">
        <h4>分类商品推荐 <small>根据您的购买或浏览记录推荐</small></h4>
        <ul v-if="current.goods">
          <li v-for="item in current.goods" :key="item.id">
            <RouterLink to="/">
              <img :src="item.picture" :alt="item.name" />
              <div class="info">
                <p class="name ellipsis-2">{{ item.name }}</p>
                <p class="desc ellipsis">{{ item.desc }}</p>
                <p class="price"><i>¥</i>{{ item.price }}</p>
              </div>
            </RouterLink>
          </li>
        </ul>
        <ul v-if="current && current.brands">
          <li class="brand" v-for="item in current.brands" :key="item.id">
            <RouterLink to="/">
              <img :src="item.logo" :alt="item.name" />
              <div class="info">
                <p class="place">
                  <i class="iconfont icon-dingwei"></i>{{ item.place }}
                </p>
                <p class="name ellipsis">{{ item.nameEn }}</p>
                <p class="desc ellipsis-2">{{ item.name }}</p>
              </div>
            </RouterLink>
          </li>
        </ul>
      </div>
      <li
        :class="{ active: current?.id && current.id === item.id }"
        v-for="item in menuList"
        @mouseenter="current = item"
        :key="item.id"
      >
        <router-link :to="`/category/${item.id}`">{{ item.name }}</router-link>
        <template v-if="item.children.length">
          <router-link
            v-for="sub in item.children"
            :key="sub.id"
            :to="`/category/sub/${sub.id}`"
            >{{ sub.name }}</router-link
          >
        </template>
        <template v-else>
          <XtxSkeleton
            animated="fade"
            width="60px"
            height="18px"
            bg="rgba(255,255,255,0.2)"
            style="margin-right: 5px"
          ></XtxSkeleton>
          <XtxSkeleton
            animated="fade"
            width="60px"
            height="18px"
            bg="rgba(255,255,255,0.2)"
          ></XtxSkeleton>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
import { getHotBrand } from "@/api/home";
import { computed, ref } from "@vue/reactivity";
import { useStore } from "vuex";

export default {
  name: "HomeCategory",
  setup() {
    const current = ref(null);
    return {
      menuList: useMenuList(),
      current,
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
  getBrand().then((res) => {
    brand.value.brands = res;
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
async function getBrand() {
  const { result } = await getHotBrand();
  return result;
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
      &:hover,
      &.active {
        background-color: @xtxColor;
      }
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
  // 注意: 此弹层样式放置在 .home-category 内部
  .layer {
    width: 990px;
    height: 500px;
    background: rgba(255, 255, 255, 0.8);
    position: absolute;
    left: 250px;
    top: 0;
    display: none;
    padding: 0 15px;
    h4 {
      font-size: 20px;
      font-weight: normal;
      line-height: 80px;
      small {
        font-size: 16px;
        color: #666;
      }
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 310px;
        height: 120px;
        margin-right: 15px;
        margin-bottom: 15px;
        border: 1px solid #eee;
        border-radius: 4px;
        background: #fff;
        &:nth-child(3n) {
          margin-right: 0;
        }
        a {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          padding: 10px;
          &:hover {
            background: #e3f9f4;
          }
          img {
            width: 95px;
            height: 95px;
          }
          .info {
            padding-left: 10px;
            line-height: 24px;
            width: 165px;
            .name {
              font-size: 16px;
              color: #666;
            }
            .desc {
              color: #999;
            }
            .price {
              font-size: 22px;
              color: @priceColor;
              i {
                font-size: 16px;
              }
            }
          }
        }
      }
      // 注意: 此样式方式在 .layer/ul 中
      li.brand {
        height: 180px;
        a {
          align-items: flex-start;
          img {
            width: 120px;
            height: 160px;
          }
          .info {
            p {
              margin-top: 8px;
            }
            .place {
              color: #999;
            }
          }
        }
      }
    }
  }
  &:hover {
    .layer {
      display: block;
    }
  }
}
</style>
