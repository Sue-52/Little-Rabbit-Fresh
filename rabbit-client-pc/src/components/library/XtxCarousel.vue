<template>
  <div class="xtx-carousel" @mouseenter="stopPlay" @mouseleave="startPlay">
    <ul class="carousel-body">
      <li
        class="carousel-item"
        :class="{ fade: index === currentIndex }"
        v-for="(item, index) in carsousel"
        :key="item.id"
      >
        <!-- 如果 item 是数组就表示当前遍历的同类商品数据 -->
        <div class="slider" v-if="Array.isArray(item)">
          <router-link
            v-for="goods in item"
            :key="goods.id"
            :to="`/goods/${goods.id}`"
          >
            <img :src="goods.picture" alt="" />
            <p class="name ellipsis">{{ goods.name }}</p>
            <p class="price">&yen;{{ goods.price }}</p>
          </router-link>
        </div>
        <!-- 如果 item 是对象就表示当前遍历的是普通轮播图数据 -->
        <router-link :to="item.hrefUrl" v-else>
          <img :src="item.imgUrl" alt="" />
        </router-link>
      </li>
    </ul>
    <a href="javascript:" class="carousel-btn prev" @click="toggle(-1)">
      <i class="iconfont icon-angle-left"></i>
    </a>
    <a href="javascript:" class="carousel-btn next" @click.prevent="toggle(1)">
      <i class="iconfont icon-angle-right"></i>
    </a>
    <div class="carousel-indicator">
      <span
        v-for="(item, index) in carsousel.length"
        :key="item.id"
        @click="currentIndex = index"
        :class="{ active: currentIndex === index }"
      ></span>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref } from "vue";
export default {
  name: "XtxCarousel",
  props: {
    carsousel: {
      type: Array,
    },
    autoPlay: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: Number,
      default: 3000,
    },
  },
  setup(props) {
    const currentIndex = ref(0);
    //#region 轮播图左右切换事件
    const toggle = (step) => {
      const nextStep = (currentIndex.value += step);
      if (nextStep < 0) {
        currentIndex.value = props.carsousel.length - 1;
      } else if (nextStep > props.carsousel.length - 1) {
        currentIndex.value = 0;
      } else {
        currentIndex.value = nextStep;
      }
      return nextStep;
    };
    //#endregion

    //#region 轮播图自动播放
    let timer = null;
    const startPlay = () => {
      if (props.autoPlay && props.carsousel.length > 0) {
        timer = setInterval(() => {
          toggle(1);
        }, props.duration);
      }
    };
    const stopPlay = () => {
      clearInterval(timer);
    };

    onMounted(startPlay);
    onUnmounted(stopPlay);
    //#endregion

    return { currentIndex, toggle, startPlay, stopPlay };
  },
};
</script>
<style scoped lang="less">
.xtx-carousel {
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel {
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        &.active {
          background: #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0, 0, 0, 0.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev {
        left: 20px;
      }
      &.next {
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
.slider {
  display: flex;
  justify-content: space-around;
  padding: 0 40px;
  > a {
    width: 240px;
    text-align: center;
    img {
      padding: 20px;
      width: 230px !important;
      height: 230px !important;
    }
    .name {
      font-size: 16px;
      color: #666;
      padding: 0 40px;
    }
    .price {
      font-size: 16px;
      color: @priceColor;
      margin-top: 15px;
    }
  }
}
</style>
