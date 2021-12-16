import requestWithoutToken from "@/utils/request";

/**
 * 更新购物车中的商品信息 (库存, 是否有效, 现价)
 * @param skuId
 * @param id
 * @return {AxiosPromise}
 */
export function updateLocalCart({ skuId, id }) {
  return requestWithoutToken(`/goods/stock/${skuId}`, "get", { id });
}
