<script>
import { h } from "vue";
export default {
  name: "XtxBread",
  render() {
    // return this.$slots.default();
    // 通过JS动态创建DOM元素
    const items = this.$slots.default();
    // 用于存储最终的布局结构
    const result = [];
    items.forEach((item, index) => {
      result.push(item);
      // 判断索引是否为最后一项用于添加面包屑 > 号
      if (index < items.length - 1) {
        // 将面包屑的 > 放入结构中
        result.push(h("i", { class: "iconfont icon-angle-right" }));
      }
    });
    return h("div", { class: "xtx-bread" }, result);
  },
};
</script>

<style lang="less">
.xtx-bread {
  display: flex;
  padding: 25px 10px;
  i {
    font-size: 12px;
    margin-left: 5px;
    margin-right: 5px;
    line-height: 22px;
  }
}
</style>
