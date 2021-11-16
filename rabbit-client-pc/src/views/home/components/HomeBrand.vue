<template>
  <HomePanel title="热门品牌" subTitle="国际经典 品质保证" ref="target">
    <template v-slot:right>
      <a
        href="javascript:;"
        @click="toggle(-1)"
        class="iconfont icon-angle-left prev"
        :class="{ disabled: currentIndex === 0 }"
      ></a>
      <a
        href="javascript:;"
        @click="toggle(1)"
        class="iconfont icon-angle-right next"
        :class="{ disabled: currentIndex === 1 }"
      ></a>
    </template>
    <template v-slot:default>
      <div class="box">
        <transition name="fade">
          <ul
            class="list"
            :style="{ transform: `translateX(${-currentIndex * 1240}px)` }"
            v-if="brands"
          >
            <li v-for="item in brands" :key="item.id">
              <RouterLink to="/">
                <img :src="item.picture" :alt="item.place" />
              </RouterLink>
            </li>
          </ul>
          <div v-else class="skeleton">
            <xtx-skeleton
              class="item"
              v-for="i in 5"
              :key="i"
              animated="scroll"
              bg="#e4e4e4"
              width="240px"
              height="305px"
            />
          </div>
        </transition>
      </div>
    </template>
  </HomePanel>
</template>

<script>
import { getHotBrand } from "@/api/home";
import useLazyData from "@/hooks/useLazyData";
import HomePanel from "@/views/home/components/HomePanel";
import { ref } from "vue";
export default {
  name: "HomeBrand",
  components: { HomePanel },
  setup() {
    const { result: brands, target } = useLazyData(getHotBrand);
    // console.log(brands);
    const { currentIndex, toggle } = useToggle();
    return {
      brands,
      target,
      currentIndex,
      toggle,
    };
  },
};
function useToggle() {
  //#region 轮播切换
  const currentIndex = ref(0);
  const toggle = (step) => {
    const nextStep = currentIndex.value + step;
    if (nextStep < 0 || nextStep > 1) return;
    currentIndex.value = nextStep;
  };

  return {
    currentIndex,
    toggle,
  };
  //#endregion
}
</script>

<style scoped lang="less">
.home-panel {
  background: #f5f5f5;
}
.iconfont {
  width: 20px;
  height: 20px;
  background: #ccc;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: @xtxColor;
  &::before {
    font-size: 12px;
    position: relative;
    top: -2px;
  }
  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;
  .list {
    width: 200%;
    display: flex;
    transition: all 1s;
    li {
      margin-right: 10px;
      width: 240px;
      &:nth-child(5n) {
        margin-right: 0;
      }
      img {
        width: 240px;
        height: 305px;
      }
    }
  }
}

.skeleton {
  width: 100%;
  display: flex;
  .item {
    margin-right: 10px;
    &:nth-child(5n) {
      margin-right: 0;
    }
  }
}
</style>
