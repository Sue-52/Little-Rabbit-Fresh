<template>
  <AppLayout>
    <div class="cart-page">
      <div class="container">
        <XtxBread>
          <XtxBreadItem path="/">首页</XtxBreadItem>
          <XtxBreadItem>购物车</XtxBreadItem>
        </XtxBread>
        <div class="cart">
          <table>
            <thead>
              <tr>
                <th>
                  <XtxCheckbox
                    :modelValue="selectAll"
                    :updateValue="
                      $store.dispatch('cart/updateAllButtonStatus', $event)
                    "
                  >
                    全选
                  </XtxCheckbox>
                </th>
                <th>商品信息</th>
                <th>单价</th>
                <th>数量</th>
                <th>小计</th>
                <th>操作</th>
              </tr>
            </thead>
            <!-- 有效商品 -->
            <tbody>
              <tr v-if="effectiveGoodsCount === 0">
                <td colspan="6">
                  <EmptyCart />
                </td>
              </tr>
              <tr v-else v-for="item in effectiveGoodsList" :key="item.id">
                <td>
                  <XtxCheckbox
                    :modelValue="item.selected"
                    @update:modelValue="
                      $store.dispatch('cart/updateSelectedGoods', {
                        skuId: item.skuId,
                        selected: $event,
                      })
                    "
                  />
                </td>
                <td>
                  <div class="goods">
                    <RouterLink :to="`/goods/${item.id}`">
                      <img :src="item.picture" alt="" />
                    </RouterLink>
                    <div>
                      <p class="name ellipsis">
                        {{ item.name }}
                      </p>
                      <!-- 选择规格组件 -->
                    </div>
                  </div>
                </td>
                <td class="tc">
                  <p>&yen;{{ item.nowPrice }}</p>
                  <p v-if="item.price - item.nowPrice > 0">
                    比加入时降价
                    <span class="red">
                      &yen;{{ (item.price - item.nowPrice).toFixed(2) }}
                    </span>
                  </p>
                </td>
                <td class="tc">
                  <XtxNumberBox></XtxNumberBox>
                </td>
                <td class="tc">
                  <p class="f16 red">
                    &yen;{{ (item.count * Number(item.nowPrice)).toFixed(2) }}
                  </p>
                </td>
                <td class="tc">
                  <p><a href="javascript:">移入收藏夹</a></p>
                  <p>
                    <a
                      class="green"
                      href="javascript:"
                      @click="deleteGoods(item.skuId)"
                      >删除</a
                    >
                  </p>
                  <p><a href="javascript:">找相似</a></p>
                </td>
              </tr>
            </tbody>
            <!-- 无效商品 -->
            <tbody>
              <tr>
                <td colspan="6"><h3 class="tit">失效商品</h3></td>
              </tr>
              <tr v-for="item in invalidGoodsList" :key="item.id">
                <td></td>
                <td>
                  <div class="goods">
                    <RouterLink :to="`/goods/${item.id}`">
                      <img :src="item.picture" alt="" />
                    </RouterLink>
                    <div>
                      <p class="name ellipsis">
                        {{ item.name }}
                      </p>
                      <p class="attr">{{ item.attrsText }}</p>
                    </div>
                  </div>
                </td>
                <td class="tc">
                  <p>&yen;{{ item.nowPrice }}</p>
                </td>
                <td class="tc">{{ item.count }}</td>
                <td class="tc">
                  <p>
                    &yen;{{ (item.count * Number(item.nowPrice)).toFixed(2) }}
                  </p>
                </td>
                <td class="tc">
                  <p><a class="green" href="javascript:">删除</a></p>
                  <p><a href="javascript:">找相似</a></p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 操作栏 -->
        <div class="action">
          <div class="batch">
            <XtxCheckbox>全选</XtxCheckbox>
            <a href="javascript:">删除商品</a>
            <a href="javascript:">移入收藏夹</a>
            <a href="javascript:">清空失效商品</a>
          </div>
          <div class="total">
            共 {{ effectiveGoodsCount }} 件商品，已选择
            {{ selectedGoodsCount }} 件，商品合计：
            <span class="red">¥{{ selectedGoodsPrice }}</span>
            <XtxButton type="primary">下单结算</XtxButton>
          </div>
        </div>
        <!-- 猜你喜欢 -->
        <GoodsRelevant />
      </div>
    </div>
  </AppLayout>
</template>
<script>
import Confirm from "@/components/library/Confirm";
import EmptyCart from "@/views/cart/components/EmptyCart.vue";
import GoodsRelevant from "@/views/goods/components/GoodsRelevant";
import AppLayout from "@/views/LayoutTemplate.vue";
import { computed } from "vue-demi";
import { useStore } from "vuex";
export default {
  name: "CartPage",
  components: { GoodsRelevant, AppLayout, EmptyCart },
  setup() {
    const store = useStore();
    // 有效商品
    const effectiveGoodsList = computed(
      () => store.getters["cart/effectiveGoodsList"]
    );
    const effectiveGoodsCount = computed(
      () => store.getters["cart/effectiveGoodsCount"]
    );
    // 无效商品、总价、数量
    const invalidGoodsList = computed(
      () => store.getters["cart/invalidGoodsList"]
    );
    const selectedGoodsPrice = computed(
      () => store.getters["cart/selectedGoodsPrice"]
    );
    const selectedGoodsCount = computed(
      () => store.getters["cart/selectedGoodsCount"]
    );

    // 更本地购物车商品
    store.dispatch("cart/updateLocalCart");

    // 全选
    const selectAll = computed(() => {
      return store.getters["cart/selectAllButtonStatus"];
    });

    // 删除商品
    const deleteGoods = (skuId) => {
      Confirm({
        content: "您确定要删除该商品吗?",
      })
        .then(() => {
          store.dispatch("cart/deleteGoodsToCart", skuId);
        })
        .catch(() => {});
    };
    return {
      effectiveGoodsList,
      effectiveGoodsCount,
      invalidGoodsList,
      selectedGoodsPrice,
      selectedGoodsCount,
      selectAll,
      deleteGoods,
    };
  },
};
</script>
<style scoped lang="less">
.tc {
  text-align: center;
  .xtx-number-box {
    margin: 0 auto;
    width: 120px;
  }
}
.red {
  color: @priceColor;
}
.green {
  color: @xtxColor;
}
.f16 {
  font-size: 16px;
}
.goods {
  display: flex;
  align-items: center;
  img {
    width: 100px;
    height: 100px;
  }
  > div {
    width: 280px;
    font-size: 16px;
    padding-left: 10px;
    .attr {
      font-size: 14px;
      color: #999;
    }
  }
}
.action {
  display: flex;
  background: #fff;
  margin-top: 20px;
  height: 80px;
  align-items: center;
  font-size: 16px;
  justify-content: space-between;
  padding: 0 30px;
  .xtx-checkbox {
    color: #999;
  }
  .batch {
    a {
      margin-left: 20px;
    }
  }
  .red {
    font-size: 18px;
    margin-right: 20px;
    font-weight: bold;
  }
}
.tit {
  color: #666;
  font-size: 16px;
  font-weight: normal;
  line-height: 50px;
}
.cart-page {
  .cart {
    background: #fff;
    color: #666;
    table {
      border-spacing: 0;
      border-collapse: collapse;
      line-height: 24px;
      width: 100%;
      th,
      td {
        padding: 10px;
        border-bottom: 1px solid #f5f5f5;
        &:first-child {
          text-align: left;
          padding-left: 30px;
          color: #999;
        }
      }
      th {
        font-size: 16px;
        font-weight: normal;
        line-height: 50px;
      }
    }
  }
}
</style>
