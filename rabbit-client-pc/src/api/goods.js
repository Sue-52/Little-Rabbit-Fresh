import requestWithoutToken from "@/utils/request";

/**
 * 根据商品ID获取商品详情信息
 * @param id 商品ID
 * @return {AxiosPromise}
 */

export function getGoodsDetailId(id) {
  return requestWithoutToken("/goods", "get", { id });
}