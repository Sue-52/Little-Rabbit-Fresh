<template>
  <div>{{ user }}</div>
  <button @click="onClickHandler">button</button>
</template>
<script>
import { useStore } from "vuex";

export default {
  name: "App",
  setup() {
    // 获取 store 对象
    const store = useStore();
    // 按钮点击事件的事件处理函数
    const onClickHandler = () => {
      // 设置用户信息
      store.commit("user/setUser", { token: "test" });
    };
    // 获取用户信息
    const user = store.state.user;
    return { onClickHandler, user };
  },
};
</script>

<style lang="less" scoped></style>
