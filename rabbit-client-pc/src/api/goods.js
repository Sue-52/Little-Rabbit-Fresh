import requestWithoutToken from "@/utils/request";

/**
 * 根据商品ID获取商品详情信息
 * @param id 商品ID
 * @return {AxiosPromise}
 */

export function getGoodsDetailId(id) {
  return requestWithoutToken("/goods", "get", { id });
}

/**
 * 获取相关商品、猜你喜欢
 * @param id 商品id - 如果传了id参数表示获取相关商品数据, 如果没有传id参数表示获取猜你喜欢数据
 * @return {AxiosPromise}
 */
export function getRelevantGoods(id, limit = 7) {
  return requestWithoutToken("/goods/relevant", "get", {
    id,
    limit,
  });
}

/**
 * 获取热销商品
 * @param id 商品ID, 根据该商品推荐其同类的热销商品
 * @param limit 获取多少条商品数据
 * @param type 热销类型, 1为24小时，2为周榜，3为总榜，默认为1
 * @return {AxiosPromise}
 */

export function getGoodsHotApi({ id, limit = 4, type = 1 }) {
  return requestWithoutToken("/goods/hot", "get", { id, limit, type });
}

/**
 * 获取商品评价头部数据
 * @param id 商品id
 * @return {AxiosPromise}
 */
export function getGoodsEvaluate(id) {
  return requestWithoutToken(
    `https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`,
    "get"
  );
}

/**
 * 获取评论列表数据
 * @param id 商品ID
 * @param params 其他的查询参数
 * @return {AxiosPromise}
 */
export function getCommentListApi(params) {
  return requestWithoutToken(
    `https://mock.boxuegu.com/mock/1175/goods/${params.id}/evaluate/page`,
    "get",
    params
  );
}
