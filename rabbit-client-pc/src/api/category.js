import requestWithoutToken from "@/utils/request";

/**
 * @typedef {object} Category - 分类对象
 * @property {string} id - 分类id
 * @property {string} name - 分类名称
 * @property {string} picture - 分类封面图片
 * @property {Category} children - 子级分类对象
 * @property {RecommendGoods} goods - 该分类下的推荐商品
 */

/**
 * @typedef {object} RecommendGoods 推荐商品
 * @property {string} id - 商品id
 * @property {string} name 商品名称
 * @property {string} desc 商品描述
 * @property {null | number} discount - 折扣信息
 * @property {number} orderNum - 销量
 * @property {string} picture - 商品图片
 * @property {string} price - 商品价格
 */

/**
 * 获取分类列表
 * @return {Promise<{result: Array<Category>}>}
 */
export function getCategoriesApi() {
  return requestWithoutToken("/home/category/head", "get");
}

// 一级分类
export const topCategories = [
  "居家",
  "美食",
  "服饰",
  "母婴",
  "个护",
  "严选",
  "数码",
  "运动",
  "杂货",
];
