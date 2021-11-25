<template>
  <div class="goods-image">
    <!-- 大图 -->
    <div
      class="large"
      :style="{
        backgroundImage: `url(${images[current]})`,
        backgroundPositionX: bgPosition.x + 'px',
        backgroundPositionY: bgPosition.y + 'px',
      }"
      v-show="show"
    ></div>
    <!-- 中图 -->
    <div class="middle" ref="middleElement">
      <img :src="images[current]" alt="" />
      <div
        class="layer"
        v-show="show"
        :style="{
          left: layerPosition.left + 'px',
          top: layerPosition.top + 'px',
        }"
      ></div>
    </div>
    <!-- 小图 -->
    <ul class="small">
      <li
        @mouseenter="current = index"
        v-for="(item, index) in images"
        :key="index"
        :class="{ active: index === current }"
      >
        <img :src="item" alt="" />
      </li>
    </ul>
  </div>
</template>
<script>
import { ref, watch } from "vue";
import { useMouseInElement } from "@vueuse/core";

export default {
  name: "GoodsImages",
  props: {
    images: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    // 用于存储当前要显示的图片的索引
    const current = ref(0);
    // 用于控制镜片和大图是否显示
    const show = ref(false);
    // 用于存储中图元素
    const middleElement = ref(null);
    // 获取鼠标和元素之间的位置关系
    const { isOutside, elementX, elementY } = useMouseInElement(middleElement);
    // 用于存储镜片元素位置
    const layerPosition = ref({ left: 0, top: 0 });
    // 用于存储大图背景位置
    const bgPosition = ref({ x: 0, y: 0 });
    // 监听鼠标移入中图元素的变化
    watch([isOutside, elementX, elementY], () => {
      /*
       * 如果鼠标在元素外部, 隐藏镜片和大图
       * if (isOutside.value) show.value = false
       * 如果鼠标在元素内部, 显示静态和大图
       * if (!isOutside.value) show.value = true
       * 下面这句代码等同以上代码
       * */
      show.value = !isOutside.value;

      // 鼠标居中位置
      layerPosition.value = {
        left: elementX.value - 100,
        top: elementY.value - 100,
      };
      // 对镜片元素的水平方向位置进行限制
      if (layerPosition.value.left < 0) {
        layerPosition.value.left = 0;
      } else if (layerPosition.value.left > 200) {
        layerPosition.value.left = 200;
      }
      // 对镜片元素的垂直方向位置进行限制
      if (layerPosition.value.top < 0) {
        layerPosition.value.top = 0;
      } else if (layerPosition.value.top > 200) {
        layerPosition.value.top = 200;
      }

      // 更新大图背景位置
      bgPosition.value = {
        x: -layerPosition.value.left * 2,
        y: -layerPosition.value.top * 2,
      };
    });

    return {
      current,
      show,
      middleElement,
      isOutside,
      layerPosition,
      bgPosition,
    };
  },
};
</script>

<style scoped lang="less">
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
  z-index: 500;
  .large {
    position: absolute;
    top: 0;
    left: 412px;
    width: 400px;
    height: 400px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-repeat: no-repeat;
    background-size: 800px 800px;
    background-color: #f8f8f8;
  }
  .middle {
    width: 400px;
    height: 400px;
    background: #f5f5f5;
    position: relative;
    cursor: move;
    .layer {
      width: 200px;
      height: 200px;
      background: rgba(0, 0, 0, 0.2);
      left: 0;
      top: 0;
      position: absolute;
    }
  }
  .small {
    width: 80px;
    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;
      &:hover,
      &.active {
        border: 2px solid @xtxColor;
      }
    }
  }
}
</style>
