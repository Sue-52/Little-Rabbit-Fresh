import { getCategoriesApi, topCategories } from "@/api/category";

export default {
  // 使用具有命名空间的 vuex 模块
  namespaced: true,
  state() {
    return {
      // 存储分类列表
      list: topCategories.map((item) => ({
        name: item,
      })),
    };
  },
  mutations: {
    // 更新分类列表
    setCategories(state, payload) {
      state.list = payload;
    },
    // 开启显示下拉
    open(state, id) {
      const item = state.list.find((item) => item.id === id);
      item.open = true;
    },
    // 关闭显示下拉
    close(state, id) {
      const item = state.list.find((item) => item.id === id);
      item.open = false;
    },
  },
  actions: {
    async getCategories({ commit }) {
      const { result } = await getCategoriesApi();
      result.forEach((element) => {
        element.open = false;
      });
      commit("setCategories", result);
    },
  },
};
