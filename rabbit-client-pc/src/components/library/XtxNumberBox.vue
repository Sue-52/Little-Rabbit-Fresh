<template>
  <div class="xtx-number-box">
    <div class="label" v-if="label">{{ label }}</div>
    <div class="number-box">
      <a href="javascript:" @click="onClickChanged(-1)">-</a>
      <input type="text" readonly :value="count" />
      <a href="javascript:" @click="onClickChanged(1)">+</a>
    </div>
  </div>
</template>
<script>
import { useVModel } from "@vueuse/core";

export default {
  name: "XtxNumberBox",
  props: {
    label: {
      type: String,
      default: "",
    },
    modelValue: {
      type: Number,
      default: 1,
    },
    inventory: {
      type: Number,
      default: 1,
    },
  },
  setup(props, { emit }) {
    const count = useVModel(props, "modelValue", emit);
    const onClickChanged = (step) => {
      let nextStep = count.value + step;
      if (nextStep < 1) {
        count.value = 1;
      } else if (nextStep >= props.inventory) {
        count.value = props.inventory;
      } else {
        count.value = nextStep;
      }
    };
    return {
      count,
      onClickChanged,
    };
  },
};
</script>
<style scoped lang="less">
.xtx-number-box {
  display: flex;
  align-items: center;
  .label {
    width: 60px;
    color: #999;
    padding-left: 10px;
  }
  .number-box {
    width: 120px;
    height: 30px;
    border: 1px solid #e4e4e4;
    display: flex;
    > a {
      width: 29px;
      line-height: 28px;
      text-align: center;
      background: #f8f8f8;
      font-size: 16px;
      color: #666;
      &:first-of-type {
        border-right: 1px solid #e4e4e4;
      }
      &:last-of-type {
        border-left: 1px solid #e4e4e4;
      }
    }
    > input {
      width: 60px;
      padding: 0 5px;
      text-align: center;
      color: #666;
    }
  }
}
</style>
