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
    skuId: {
      type: String,
      defualt: "",
    },
  },
  setup(props, { emit }) {
    const pathMap = createPathMap(props.skus);
    // 当点击规格按钮的时候
    const updateSelectd = (specs, value) => {
      // 当选项为disabled时直接返回
      if (value.disabled) return;
      // 判断值是否选中
      if (value.selected) {
        value.selected = false;
      } else {
        // 如果选中的值超过一个，则取消其他选中的值
        specs.values.forEach((v) => {
          v.selected = false;
        });
        value.selected = true;
      }
      // 更新规格选择状态
      updateDisabled(props.specs, pathMap);
      // 将数据回传到父组件
      // props.specs: 在组件中显示的供用户选择的规格选项, 使用它获取用户已经选择的规格名称
      // pathMap: 将获取到的规格名称以下划线组合, 组合后规格名称作为 pathMap 对象的属性可获取 skuId
      // props.skus: 通过 skuId 可以在 skus 规格数组中找到具体的规格对象信息
      // emit: 具体的规格对象信息获取到以后, 可以通过 emit 将信息传递到父组件
      sendDataToParent(props.specs, props.skus, emit, pathMap);
    };
    // 默认选中项
    setDefaultSelected(props.skuId, props.skus, props.specs);
    return { updateSelectd, pathMap };
  },
};

// 创建规格查询对象
function createPathMap(skus) {
  // skus: 存储了所有可以组合的规格集合, 数组类型
  // 用于存储最终的规格查询对象
  const pathMap = {};
  // 遍历所有可组合的规格组合
  skus.forEach((sku) => {
    // 找到有库存的规格组合
    if (sku.inventory > 0) {
      // 将可组合的规格的名称临时存到一个数组中
      const valueNames = sku.specs.map((spec) => spec.valueName);
      // 获取当前商品的规格数量, 后面将用于判断某个规格是否是完整的
      const max = valueNames.length;
      // 获取规格集合的子级组合
      const sets = powerSet(valueNames).filter((item) => item.length > 0);
      // 遍历规格子级组合
      sets.forEach((set) => {
        // 将规格名称以 _ 进行拼接
        const key = set.join("_");
        // 判断规格查询对象中是否已经存储了当前规格
        if (!(key in pathMap)) {
          // 没有存储会进入这个判断
          // 如果当前规格是完整的
          if (set.length === max) {
            // 将当前规格组合的名称作为规格查询对象的属性, 将当前商品的 skuId 最为属性值
            pathMap[key] = sku.id;
          } else {
            // 如果当前规格是子级规格, 不是完整的
            // 将当前规格组合的名称作为规格查询对象的属性, 将 null 作为属性值
            pathMap[key] = null;
          }
        }
      });
    }
  });
  // 返回规格查询对象
  return pathMap;
}

// 实现禁选效果
function updateDisabled(specs, pathMap) {
  specs.forEach((spec, index) => {
    // 在每一轮规格匹配的过程中, 下面的循环都会向数组中动态添加值
    // 在下一轮开始匹配前, 获取到用户最初选中的规格名称值
    const selected = getUserSelected(specs);
    // 遍历具体的规格信息
    spec.values.forEach((value) => {
      // 如果当前规格已经被选中了, 说明它可以选, 不需要被禁用
      if (value.selected) return;
      // 将当前规格名称放入用户选择的规格数组名称中, 待匹配
      selected[index] = value.name;
      // 将 `selected` 数组中的 undefined 过滤掉, 剩下的数组值使用 _ 进行拼接
      // 如果用户未选择任何规格 (组件初始化时), selected 数组中只会包含当前遍历的规格名称
      const key = selected.filter((item) => item).join("_");
      // 如果在规格查询对象中不存在 key 属性, 说明当前规格不能和用户选择的规格进行组合, 禁选当前规格
      value.disabled = !(key in pathMap);
    });
  });
}

// 获取用户选中的规格
function getUserSelected(specs) {
  // 用于存储用户选择的规格
  const result = [];
  // 遍历商品规格集合
  specs.forEach((spec, index) => {
    // 在当前规格中查找用户选择的规格
    const selected = spec.values.find((value) => value.selected);
    // 如果找到了
    if (selected) {
      // 将该规格放在它自己的位置上
      result[index] = selected.name;
    } else {
      // 如果没有找到, 当前规格使用 undefined 进行占位
      result[index] = undefined;
    }
  });
  // 返回用户选中的规格
  return result;
}

// 创建默认选中的规格
function setDefaultSelected(skuId, skus, specs) {
  // 判断是否有ID
  if (!skuId) return;
  // 根据 skuId 在规格集合中查找默认选中的规格对象
  // 然后遍历其中的 specs, 返回规格名称数组
  const target = skus
    .find((sku) => sku.id === skuId)
    .specs.map((spec) => spec.valueName);
  // 遍历所有规格商品
  specs.forEach((spec) => {
    // 遍历当前规格的规格值
    spec.values.forEach((value) => {
      // 如果当前规格值在默认选中的规格中
      if (target.includes(value.name)) {
        // 将当前规格值设置为选中状态
        value.selected = true;
      }
    });
  });
}

// 数据回传
function sendDataToParent(specs, skus, emit, pathMap) {
  // 获取用户选择的规格名称数组
  const selected = getUserSelected(specs).filter((item) => item);
  // 判断用户是否选择了所有规格
  if (selected.length === specs.length) {
    // 将规格名称以下划线进行组合, 组合后将它作为 pathMap 对象的属性, 以获取规格组合的 skuId
    const skuId = pathMap[selected.join("_")];
    // 通过 skuId 找到规格集合中具体的信息
    const target = skus.find((sku) => sku.id === skuId);
    emit("on-spec-change", {
      skuId,
      price: target.price,
      oldPrice: target.oldPrice,
      inventory: target.inventory,
    });
  }
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
