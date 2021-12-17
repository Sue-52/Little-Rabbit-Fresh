import { updateLocalCart } from "@/api/cart";
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
    updateGoodsBySkuId(state, partOfGoods) {
      // 根据skuId查找商品
      let goods = state.list.find((item) => item.skuId === partOfGoods.skuId);
      if (goods) {
        goods = { ...goods, ...partOfGoods };
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
    // 更新购物车中的商品信息 (库存, 是否有效, 现价)
    updateLocalCart({ commit, rootState, state }) {
      if (rootState.user.profile.token) {
        // 已登录
      } else {
        // 未登录
        const cartListPromise = state.list.map(({ skuId, id }) =>
          updateLocalCart({ skuId, id })
        );
        // 批量获取多个请求的数据
        Promise.all(cartListPromise).then((data) => {
          // 遍历响应结果
          data.forEach((item, index) => {
            item.result.skuId = state.list[index].skuId;
            commit("updateGoodsBySkuId", item.result);
          });
        });
      }
    },
    // 更新选中状态
    updateSelectedGoods({ rootState, commit }, state) {
      if (rootState.user.profile.token) {
        // 已登录
      } else {
        // 未登录
        commit("updateGoodsBySkuId", state);
      }
    },
    // 更新全选状态
    updateAllButtonStatus({ rootState, commit, getters }, state) {
      if (rootState.user.profile.token) {
        // 已登录
      } else {
        // 未登录
        getters.effectiveGoodsList.forEach((item) => {
          commit("updateGoodsBySkuId", { skuId: item.skuId, selected: state });
        });
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
    // 无效商品列表
    invalidGoodsList(state) {
      return state.list.filter((item) => !item.isEffective || item.stock === 0);
    },
    // 用户选择商品列表
    selectedGoodsList(state, getters) {
      return getters.effectiveGoodsList.filter((item) => item.iselected);
    },
    // 选择总价
    selectedGoodsPrice(state, getters) {
      return getters.selectedGoodsList.reduce(
        (price, item) => price + Number(item.nowPrice) * item.count,
        0
      );
    },
    // 选择数量
    selectedGoodsCount(state, getters) {
      return getters.selectedGoodsList.reduce(
        (count, item) => count + item.count,
        0
      );
    },
    // 全选
    selectAllButtonStatus(state, getters) {
      return (
        getters.effectiveGoodsList.length > 0 &&
        getters.effectiveGoodsList.length === getters.selectedGoodsList.length
      );
    },
  },
};
