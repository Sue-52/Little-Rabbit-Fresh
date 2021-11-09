import { createStore } from "vuex";
import user from "@/store/user";
import cart from "@/store/cart";
import category from "@/store/category";
// 用于将某些数据可以同步到本地的插件
import createPersistedState from "vuex-persistedstate";

const store = createStore({
  modules: {
    user,
    cart,
    category,
  },
  plugins: [
    createPersistedState({
      // 数据存储在 localStorage 时的 key
      key: "rabbit-client-pc",
      // 指定将哪些模块中的数据同步到本地
      paths: ["user", "cart"],
    }),
  ],
});

export default store;
