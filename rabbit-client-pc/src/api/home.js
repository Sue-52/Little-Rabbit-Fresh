import requestWithoutToken from "@/utils/request";

/**
 * @typedef {Object} Brand 品牌
 * @property {string} id 品牌ID
 * @property {string} picture 品牌封面
 * @property {string} name 品牌名称
 * @property {string} nameEn 品牌英文名称
 * @property {string} place 地点
 */

/**
 * 获取热门品牌
 * @param {number} limit - 请求多少条数据
 * @return {Promise<{result: Array<Brand>}>}
 */
export function getHotBrand(limit = 6) {
  return requestWithoutToken("/home/brand", "get", { limit });
}

/**
 * 获取轮播图数据
 * @param {Number} distributionSite
 * @returns {Promise<{result: Array<Brand>}>}
 */
export function getBanners(distributionSite = 1) {
  return requestWithoutToken("/home/banner", "get", { distributionSite });
}

/**
 * 获取新鲜好物数据
 * @param {Number} limit
 * @returns {Promise<{result: Array<Brand>}>}
 */
export function getNewGoods(limit = 4) {
  return requestWithoutToken("/home/new", "get", { limit });
}

/**
 * 获取人气推荐数据
 * @returns {Promise<{result: Array<Brand>}>}
 */
export function getHomeHot() {
  return requestWithoutToken("/home/hot", "get");
}

/**
 * 获取产品区块数据
 * @returns {Promise<{result: Array<Brand>}>}
 */
export function getProduct() {
  return requestWithoutToken("/home/goods", "get");
}

/**
 * 获取最新专题数据
 * @returns {Promise<{result: Array<Brand>}>}
 */
export function getSpecial(limit) {
  return requestWithoutToken("/home/special", "get", { limit });
}
