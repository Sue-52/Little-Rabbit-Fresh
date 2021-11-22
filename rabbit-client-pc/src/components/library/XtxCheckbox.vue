<template>
  <div class="xtx-checkbox" @click="toggle">
    <i class="iconfont icon-checked" v-if="isChecked"></i>
    <i class="iconfont icon-unchecked" v-else></i>
    <span><slot /></span>
  </div>
</template>

<script>
import { ref, unref, watch } from "vue";
// import { unref } from "vue";
// import { useVModel } from "@vueuse/core";
export default {
  name: "XtxCheckbox",
  props: {
    // 接收v-model传来的值（固定写法）
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const isChecked = ref(false);
    // const isChecked = useVModel(props, "modelValue", emit);
    const toggle = () => {
      isChecked.value = !unref(isChecked);
      // 通过emit触发更新数据
      emit("update:modelValue", isChecked.value);
    };
    // 监听获取的数据
    watch(
      () => props.modelValue,
      () => {
        // 将isChecked值赋值给modelValue
        isChecked.value = props.modelValue;
      }
    );
    return { isChecked, toggle };
  },
};
</script>

<style scoped lang="less">
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>
