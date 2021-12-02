<template>
  <div class="xtx-pagination">
    <a href="javascript:">上一页</a>
    <span>...</span>
    <a href="javascript:">3</a>
    <a href="javascript:">4</a>
    <a href="javascript:" class="active">5</a>
    <a href="javascript:">6</a>
    <a href="javascript:">7</a>
    <span>...</span>
    <a href="javascript:">下一页</a>
  </div>
</template>

<script>
import { computed, ref } from "vue-demi";

export default {
  name: "XtxPagination",
  setup() {
    // 当前页
    const currentPage = ref(5);
    // 页面中一次最多显示的页码数量
    const pageButtonMaxCount = ref(5);
    //偏移量
    const pageOffsest = Math.floor(pageButtonMaxCount / 2);
    // 开始页和结束页
    const pageInfo = computed(() => {
      let start = currentPage.value - pageOffsest;
      let end = start + pageButtonMaxCount - 1;
      // 总页数
      let totalPage = Math.ceil(100 / 10);
      // 如果总页数小于等于按钮数量，则直接返回
      if (start < 1) {
        start = 1;
        let temp = start + pageButtonMaxCount - 1;
        // 判断是否超出总页数
        end = temp > totalPage ? totalPage : temp;
      }
      // 如果总页数大于按钮数量，则判断是否需要偏移
      if (end > totalPage) {
        end = totalPage;
        let temp = end - pageButtonMaxCount + 1;
        // 判断是否超过 1
        start = temp < 1 ? 1 : temp;
      }
      // 声明存储页码的数组
      let pageNumbers = [];
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      return { pageNumbers };
    });

    return {
      currentPage,
      pageInfo,
    };
  },
};
</script>

<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333;
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
