<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggle" :class="{ active: visible }">
      <span class="placeholder">请选择配送地址</span>
      <span class="value"></span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="visible">
      <span class="ellipsis" v-for="item in cityData" :key="item.code">
        {{ item.name }}
      </span>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";
import axios from "axios";

export default {
  name: "XtxCity",
  setup() {
    const visible = ref(false);
    const target = ref(null);
    // 用来接收城市数据
    const cityData = ref(null);
    const show = () => {
      visible.value = true;
      getCityData().then((res) => {
        // console.log(res);
        cityData.value = res;
      });
    };
    const hide = () => {
      visible.value = false;
    };
    const toggle = () => {
      visible.value ? hide() : show();
    };
    onClickOutside(target, () => {
      // console.log(event);
      hide();
    });
    return { toggle, visible, target, cityData };
  },
};
// 将cityData设置到window上
window.cityData = null;
// 获取城市数据
async function getCityData() {
  // 如果已经获取过了，就不再获取了
  if (window.cityData) return window.cityData;
  // 发起请求
  let { data } = await axios.get(
    "https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json"
  );
  return (window.cityData = data);
}
</script>

<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 125px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
</style>
