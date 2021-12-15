// eslint-disable-next-line no-unused-vars
export default {
  namespaced: true,
  state() {
    return {
      // 存储购物车列表
      list: [],
    };
  },
  mutations: {
    addGoodsToCart(state, goods) {
      // 判断列表中是否有该商品
      const index = state.list.findIndex((item) => item.skuId === goods.skuId);
      if (index > -1) {
        state.list[index].count += goods.count;
        // 添加到顶部
        let newList = state.list.splice(index, 1)[0];
        state.list.unshift(newList);
      } else {
        state.list.unshift(goods);
      }
    },
    deleteGoodsToCart(state, skuId) {
      const index = state.list.findIndex((item) => item.skuId === skuId);
      if (index > -1) {
        state.list = [
          ...state.list.slice(0, index),
          ...state.list.slice(index + 1),
        ];
      }
    },
  },
  actions: {
    addGoodsToCart({ rootState, commit }, goods) {
      if (rootState.user.profile.token) {
        // 已登录
      } else {
        // 未登录
        commit("addGoodsToCart", goods);
      }
    },
    deleteGoodsToCart({ rootState, commit }, skuId) {
      if (rootState.user.profile.token) {
        // 已登录
      } else {
        // 未登录
        commit("deleteGoodsToCart", skuId);
      }
    },
  },
  getters: {
    // 可购买商品列表 (有效商品 + 商品库存数量大于0)
    effectiveGoodsList(state) {
      return state.list.filter((item) => item.isEffective && item.stock > 0);
    },
    // 可购买商品总价
    effectiveGoodsCount(state, getters) {
      return getters.effectiveGoodsList.reduce(
        (count, item) => count + item.count,
        0
      );
    },
    // 可购买商品数量
    effectiveGoodsPrice(state, getters) {
      return getters.effectiveGoodsList.reduce(
        (price, item) => price + Number(item.nowPrice) * item.count,
        0
      );
    },
  },
};
