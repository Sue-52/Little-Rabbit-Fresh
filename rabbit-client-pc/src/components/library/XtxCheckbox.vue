<template>
  <div class="xtx-checkbox" @click="toggle">
    <i class="iconfont icon-checked" v-if="isChecked"></i>
    <i class="iconfont icon-unchecked" v-else></i>
    <span><slot /></span>
  </div>
</template>

<script>
// import { ref, unref, watch } from "vue";
import { unref } from "vue";
import { useVModel } from "@vueuse/core";
export default {
  name: "XtxCheckbox",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    // const isChecked = ref(false);
    const isChecked = useVModel(props, "modelValue", emit);
    const toggle = () => {
      isChecked.value = !unref(isChecked);
      //   emit("update:modelValue", isChecked.value);
    };
    // watch(
    //   () => props.modelValue,
    //   () => {
    //     isChecked.value = props.modelValue;
    //   }
    // );
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
