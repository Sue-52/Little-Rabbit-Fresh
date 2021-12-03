<template>
  <div class="goods-comment">
    <div class="head" v-if="commentInfo">
      <div class="data">
        <p>
          <span>{{ commentInfo.salesCount }}</span
          ><span>人购买</span>
        </p>
        <p>
          <span>{{ commentInfo.praisePercent }}</span
          ><span>好评率</span>
        </p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a
            href="javascript:"
            v-for="item in commentInfo.tags"
            :class="{ active: item.title === activeTageName }"
            @click="
              activeTageName = item.title;
              updateReqParams(item.title);
            "
            :key="item"
          >
            {{ item.title }}（{{ item.tagCount }}）
          </a>
        </div>
      </div>
    </div>
    <div class="sort">
      <span>排序：</span>
      <a
        @click="
          sortValue = '默认';
          updateReqParams({ sortField: '' });
        "
        href="javascript:"
        :class="{ active: sortValue === '默认' }"
        >默认</a
      >
      <a
        @click="
          sortValue = '最新';
          updateReqParams({ sortField: 'createTime' });
        "
        :class="{ active: sortValue === '最新' }"
        href="javascript:"
        >最新</a
      >
      <a
        @click="
          sortValue = '最热';
          updateReqParams({ sortField: 'praiseCount' });
        "
        :class="{ active: sortValue === '最热' }"
        href="javascript:"
        >最热</a
      >
    </div>
    <!-- 评论数据 -->
    <div class="list" v-if="commentList">
      <div class="item" v-for="item in commentList.items" :key="item.id">
        <!-- 用户头像 -->
        <div class="user">
          <img :src="item.member.avatar" alt="" />
          <span>{{ formatNickname(item.member.nickname) }}</span>
        </div>
        <div class="body">
          <div class="score">
            <!-- 星级 -->
            <i
              class="iconfont icon-wjx01"
              v-for="i in item.score"
              :key="i + 's'"
            ></i>
            <i
              class="iconfont icon-wjx02"
              v-for="i in 5 - item.score"
              :key="i + 'k'"
            ></i>
            <span class="attr">{{ foromatAttrs(item.orderInfo.specs) }}</span>
          </div>
          <div class="text">
            {{ item.content }}
          </div>
          <GoodsCommentImage
            v-if="item.pictures.length > 0"
            :pictures="item.pictures"
          />
          <div class="time">
            <span>{{ item.createTime }}</span>
            <span class="zan">
              <i class="iconfont icon-dianzan"></i>
              {{ item.praiseCount }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- 页码 -->
    <XtxPagination
      v-model:page="reqParams.page"
      :pageSize="reqParams.pageSize"
      :counts="commentList.counts"
    />
  </div>
</template>
<script>
import GoodsCommentImage from "@/views/goods/components/GoodsCommentImage";
import { getCommentListApi, getGoodsEvaluate } from "@/api/goods";
import { ref, watch } from "vue";
import { useRoute, onBeforeRouteUpdate } from "vue-router";

export default {
  components: { GoodsCommentImage },
  name: "GoodsComment",
  setup() {
    const sortValue = ref("默认");
    //#region tags标签数据
    const { commentInfo, activeTageName } = useGoodsCommentInfo();
    //#endregion

    //#region List 数据
    const {
      commentList,
      reqParams,
      formatNickname,
      foromatAttrs,
      updateReqParams,
    } = useGoodsCommentList();
    //#endregion
    return {
      commentInfo,
      activeTageName,
      commentList,
      formatNickname,
      foromatAttrs,
      updateReqParams,
      sortValue,
      reqParams,
    };
  },
};
// 初始化评论信息 -- 标签栏
function useGoodsCommentInfo() {
  const commentInfo = ref();
  const route = useRoute();

  const activeTageName = ref("全部评价");
  const getTagsData = (id) => {
    getGoodsEvaluate(id).then((res) => {
      res.result.tags.unshift({
        tagCount: res.result.hasPictureCount,
        title: "有图",
      });
      res.result.tags.unshift({
        tagCount: res.result.evaluateCount,
        title: "全部评价",
      });
      commentInfo.value = res.result;
    });
  };
  getTagsData(route.params.id);
  onBeforeRouteUpdate((to) => getTagsData(to.params.id));

  return {
    commentInfo,
    activeTageName,
  };
}

// 初始化评论信息 -- 列表
function useGoodsCommentList() {
  const commentList = ref();
  const route = useRoute();
  const reqParams = ref({
    id: route.params.id,
    page: 1,
    pageSize: 10,
    hasPicture: false,
    tag: "",
    sortField: "",
  });
  // 筛选数据
  const updateReqParams = (target) => {
    // console.log(target);
    if (target.tag) {
      reqParams.value = {
        ...reqParams.value,
        hasPicture: target.tag === "有图" ? true : false,
        tag:
          target.tag === "全部评价" || target.tag === "有图" ? "" : target.tag,
      };
    } else {
      reqParams.value = {
        ...reqParams.value,
        ...target,
      };
    }
    // 当筛选条件发生变化后重置页码
    reqParams.value.page = 1;
  };
  const getListData = () => {
    getCommentListApi(reqParams.value).then((res) => {
      commentList.value = res.result;
    });
  };
  // 将顶params变化
  watch(
    () => reqParams.value,
    () => {
      getListData();
    },
    { immediate: true }
  );
  getListData();
  const formatNickname = (nickname) => {
    return (
      nickname.substr(0, 1) + "***" + nickname.substr(nickname.length - 1, 1)
    );
  };
  const foromatAttrs = (attrs) => {
    return attrs.map((attr) => `${attr.name} : ${attr.nameValue}`).join(" ");
  };
  return {
    commentList,
    formatNickname,
    foromatAttrs,
    updateReqParams,
    reqParams,
  };
}
</script>

<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor, 50%);
            color: @xtxColor;
          }
          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active,
      &:hover {
        color: @xtxColor;
      }
    }
  }
}

.list {
  padding: 0 20px;
  .item {
    display: flex;
    padding: 25px 10px;
    border-bottom: 1px solid #f5f5f5;
    .user {
      width: 160px;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
      }
      span {
        padding-left: 10px;
        color: #666;
      }
    }
    .body {
      flex: 1;
      .score {
        line-height: 40px;
        .iconfont {
          color: #ff9240;
          padding-right: 3px;
        }
        .attr {
          padding-left: 10px;
          color: #666;
        }
      }
    }
    .text {
      color: #666;
      line-height: 24px;
    }
    .time {
      color: #999;
      display: flex;
      justify-content: space-between;
      margin-top: 5px;
    }
  }
}
</style>
