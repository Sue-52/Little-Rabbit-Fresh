<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggle" :class="{ active: visible }">
      <span class="placeholder" v-if="!location">请选择配送地址</span>
      <span class="value" v-else>{{ location }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="visible">
      <span
        @click="updateSelectedCityData(item)"
        class="ellipsis"
        v-for="item in list"
        :key="item.code"
      >
        {{ item.name }}
      </span>
    </div>
  </div>
</template>
<script>
import { computed, reactive, ref } from "vue";
import { onClickOutside } from "@vueuse/core";
import axios from "axios";

export default {
  name: "XtxCity",
  setup(porps, { emit }) {
    const visible = ref(false);
    const target = ref(null);
    // 用来接收城市数据
    const cityData = ref(null);
    // 存储省市区数据
    const selectedCityData = reactive({
      provinceCode: "",
      cityCode: "",
      countyCode: "",
      provinceName: "",
      cityName: "",
      countyName: "",
    });
    // 用来记录选择的省市区
    const updateSelectedCityData = (item) => {
      if (item.level === 0) {
        // 省级数据
        selectedCityData.provinceCode = item.code;
        selectedCityData.provinceName = item.name;
      } else if (item.level === 1) {
        selectedCityData.cityCode = item.code;
        selectedCityData.cityName = item.name;
      } else {
        selectedCityData.countyCode = item.code;
        selectedCityData.countyName = item.name;
      }
    };
    // 展示数据
    const location = ref("");
    // 计算点击省市区后的子数据
    const list = computed(() => {
      let list = cityData.value;

      // 判断选择的省市区的code；
      if (selectedCityData.provinceCode) {
        list = list.find(
          (item) => item.code === selectedCityData.provinceCode
        ).areaList;
      }
      if (selectedCityData.cityCode) {
        list = list.find(
          (item) => item.code === selectedCityData.cityCode
        ).areaList;
      }
      if (selectedCityData.countyCode) {
        const { provinceCode, cityCode, countyCode } = selectedCityData;
        // 将省市区的数据传递给父组件
        emit("onCityChanged", { provinceCode, cityCode, countyCode });
        list = cityData.value;
        hide();
      }

      return list;
    });
    const show = () => {
      visible.value = true;
      getCityData().then((res) => {
        // console.log(res);
        cityData.value = res;
      });
    };
    const hide = () => {
      visible.value = false;
      if (selectedCityData.countyName) {
        location.value = `${selectedCityData.provinceName} ${selectedCityData.cityName} ${selectedCityData.countyName}`;
      }
      for (let attr in selectedCityData) {
        selectedCityData[attr] = "";
      }
    };
    const toggle = () => {
      visible.value ? hide() : show();
    };
    onClickOutside(target, () => {
      // console.log(event);
      hide();
    });

    return {
      toggle,
      visible,
      target,
      cityData,
      updateSelectedCityData,
      list,
      location,
    };
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
