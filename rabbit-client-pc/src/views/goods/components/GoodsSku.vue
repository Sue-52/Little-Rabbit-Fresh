<template>
  <div class="goods-sku">
    <dl v-for="item in specs" :key="item.name">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="value in item.values" :key="value.name">
          <img
            @click="updateSelectd(item, value)"
            :class="{ selected: value.selected, disabled: value.disabled }"
            v-if="value.picture"
            :src="value.picture"
            alt=""
          />
          <span
            @click="updateSelectd(item, value)"
            :class="{ selected: value.selected, disabled: value.disabled }"
            v-else
          >
            {{ value.name }}
          </span>
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import powerSet from "@/vendor/power-set";
export default {
  name: "GoodsSku",
  props: {
    specs: {
      type: Array,
      defualt: () => [],
    },
    skus: {
      type: Array,
      defualt: () => [],
    },
  },
  setup(props) {
    const pathMap = createPathMap(props.skus);
    const updateSelectd = (specs, value) => {
      if (value.selected) {
        value.selected = false;
      } else {
        specs.values.forEach((v) => {
          v.selected = false;
        });
        value.selected = true;
      }
    };
    updateDisabled(props.specs, pathMap);
    // 当点击规格按钮的时候
    // const updateSpecSelected = (spec, value) => {
    //   // 如果按钮是禁选的, 直接返回不让用户更改当前规格的是否选中状态
    //   if (value.disabled) return;
    // };
    return { updateSelectd, pathMap };
  },
};

function createPathMap(skus) {
  const pathMap = {};

  skus.forEach((item) => {
    if (item.inventory > 0) {
      const valueNames = item.specs.map((spec) => spec.valueName);

      let max = valueNames.length;
      // pathMap[key] = item.price;

      const sets = powerSet(valueNames).filter((item) => item.length > 0);

      sets.forEach((set) => {
        const path = set.join("_");
        const isCompleteSku = set.length === max;

        if (path && !(path in pathMap)) {
          if (isCompleteSku) {
            pathMap[path] = item.id;
          } else {
            pathMap[path] = null;
          }
        }
      });
    }
    // console.log(pathMap);
  });
  console.log(pathMap);

  return pathMap;
}

function updateDisabled(specs, pathMap) {
  specs.forEach((spec) => {
    spec.values.forEach((value) => {
      if (!(value.name in pathMap)) {
        value.disabled = true;
      } else {
        value.disabled = false;
      }
    });
  });
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  margin-bottom: 10px;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 5px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
