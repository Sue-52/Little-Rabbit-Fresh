# Little-Rabbit-Fresh

## 准备工作

第一步：查看和安装`vue/cli`脚手架工具

~~~powershell
npm view @vue/cli version
# 4.5.15
npm install @vue/cli -g
~~~

第二步：通过脚手架创建 `Vue` 应用

~~~powershell
vue create rabbit-client-pc
~~~

第三步：选择自定义安装

![03](https://i.loli.net/2021/11/09/eG1oydfMHxpL4XK.png)

第四步：选择要自定义安装的选项

![04](https://i.loli.net/2021/11/09/h62RyqdCIlT8rn5.png)

第五步：选择 Vue 版本

![05](https://i.loli.net/2021/11/09/8dmFv7HlMxLyt1B.png)

第六步：选择路由模式

![06](https://i.loli.net/2021/11/09/TwKNdRx6jGZtlFO.png)

第七步：选择 `CSS` 预处理器

![07](https://i.loli.net/2021/11/09/xnUCW2Jkr9HZL5z.png)

第八步：选择 `ESLint` 代码风格

![08](https://i.loli.net/2021/11/09/SlcXJGMuEkIxFjg.png)

第九步：ESLint 配置

![09](https://i.loli.net/2021/11/09/rTxh6gGBMe2QE5w.png)

第十步：选择开发工具配置文件的存放位置

![10](https://i.loli.net/2021/11/09/tzWRob5TuViyUNB.png)

第十一步：选择是否要将以上配置作为预置使用

![11](https://i.loli.net/2021/11/09/vysKVW6TQLR8JCx.png)

第十二步：选择安装应用依赖工具

![12](https://i.loli.net/2021/11/09/GdNAOQY5cw6r7kL.png)

第十三步：安装依赖

![13](https://i.loli.net/2021/11/09/xf8FRKUuawJZ3Xj.png)

![14](https://i.loli.net/2021/11/09/3d4c7JvVE6GURXH.png)

## 组建目录结构

![image-20211109082233295](https://i.loli.net/2021/11/09/u8Qi2yqNpKVWnoA.png)

![image-20211109083006877](https://i.loli.net/2021/11/09/dO5L1RB6usaTlGk.png)

## Vuex 持久化

在应用中，有些共享数据除了要存储在 `vuex` 中以外还需要存储在本地，每次操作完这些数据都要手动存储是比较麻烦的，所以需要实现数据自动被持久化到本地。

![156](https://i.loli.net/2021/11/09/vpEwt2Yrbo9fCli.jpg)

用户模块状态、购物车模块状态、分类模块状态需要被存储在 vuex 中，用户和购物车需要存储在本地，分类不需要。

第一步：下载 `npm install vuex-persistedstate@4.1.0`

~~~powershell
npm install vuex-persistedstate@4.1.0
~~~

![18](https://i.loli.net/2021/11/09/auTi9Df1YdH7tZJ.png)

第二步：声明状态，分别创建用户模块，购物车模块，分类模块

`src/store/user.js`: 用户模块状态

~~~js
export default {
  // 使用具有命名空间的 vuex 模块
  namespaced: true,
  // 返回该模块下存储的应用状态
  state() {
    return {
      // 用户信息
      profile: {
        // 用户id
        id: "",
        // 用户头像
        avatar: "",
        // 用户昵称
        nickname: "",
        // 用户账号
        account: "",
        // 用户手机号
        mobile: "",
        // 用户登录凭证
        token: "",
      },
    };
  },
};
~~~

`store/cart.js`: 购物车模块状态

~~~javascript
// eslint-disable-next-line no-unused-vars
export default {
  namespaced: true,
  state() {
    return {
      // 存储购物车列表
      list: [],
    };
  },
};
~~~

`store/category.js`: 分类页面模块状态

~~~JavaScript
export default {
  // 使用具有命名空间的 vuex 模块
  namespaced: true,
  state() {
    return {
      // 存储分类列表
      list: [],
    };
  },
};
~~~

第三步：创建 Store，配置模块

`store/index.js`

~~~javascript
import { createStore } from "vuex";
import user from "@/store/user";
import cart from "@/store/cart";
import category from "@/store/category";

export default createStore({
  modules: {
    user,
    cart,
    category,
  },
});
~~~

![image-20211109145147217](https://i.loli.net/2021/11/09/4O2up7RnsAYc9Td.png)

第四步：配置 `vuex-persistedstate` 插件

`store/index.js`

~~~javascript
import { createStore } from "vuex";
import user from "@/store/user";
import cart from "@/store/cart";
import category from "@/store/category";
// 用于将某些数据可以同步到本地的插件
import createPersistedState from "vuex-persistedstate";

const store = createStore({
  modules: {
    user,
    cart,
    category,
  },
  plugins: [
    createPersistedState({
      // 数据存储在 localStorage 时的 key
      key: "rabbit-client-pc",
      // 指定将哪些模块中的数据同步到本地
      paths: ["user", "cart"],
    }),
  ],
});

export default store;
~~~

第五步：验证插件是否匹配

`store/user.js`

~~~javascript
export default {
  // 使用具有命名空间的 vuex 模块
  namespaced: true,
  // 返回该模块下存储的应用状态
  state() {
    return {
      // 用户信息
      profile: {
        // 用户id
        id: "",
        // 用户头像
        avatar: "",
        // 用户昵称
        nickname: "",
        // 用户账号
        account: "",
        // 用户手机号
        mobile: "",
        // 用户登录凭证
        token: "",
      },
    };
  },
  mutations: {
    /** 设置用户信息
     *
     * @param {*} state 状态对象
     * @param {Object | null} user 用户信息
     */
    setUser(state, payload) {
      // 判断 user 对象是否是空对象
      console.log(payload);
      if (Object.keys(payload).length > 0) {
        // 不是空对象的情况, 表示要进行用户信息的修改
        state.profile = { ...state.profile, ...payload };
      } else {
        // 是空对象, 表示要进行用户信息的清除
        state.profile = {};
      }
    },
  },
};
~~~

`App.vue` 测试

~~~vue
<template>
  <div>{{ user }}</div>
  <button @click="onClickHandler">button</button>
</template>
<script>
import { useStore } from "vuex";

export default {
  name: "App",
  setup() {
    // 获取 store 对象
    const store = useStore();
    // 按钮点击事件的事件处理函数
    const onClickHandler = () => {
      // 设置用户信息
      store.commit("user/setUser", { token: "test" });
    };
    // 获取用户信息
    const user = store.state.user;
    return { onClickHandler, user };
  },
};
</script>
~~~

![vuex-persistedstate](https://i.loli.net/2021/11/09/1DqzdAKyQPpGURv.gif)

## 封装请求函数

目标：

1. 创建一个新的 axios 实例对象, 专门用于编写和小兔仙服务器端相关的请求配置
2. 在新创建的实例对象中添加 baseURL 选项, 将请求的基准地址抽取成公共配置
3. 添加请求拦截器, 在请求发送之前检查本地是否存在token, 如果有将其添加到请求头中
4. 添加响应拦截器, 精简数据层级 (response.data => data), 检查 token 是否过期
5. 导出用于发送请求的函数

第一步：下载axios

~~~powershell
npm install axios -s
npm view axios version
~~~

第二步：在 `utils` 中创建一个 `request.js`

第三步：创建新的 `axios` 实例对象

当前创建的新的 `axios` 实例及实例相关配置都和当前项目自身服务器端相关的，在任何项目中都难免会向第三方服务器段发送请求，如果直接使用 axios 实例而不去新建的话, 当前配置是不适用的, 就是说当前配置污染了全局的 axios 实例。

~~~javascript
// 引入 axios 包
import store from "@/store";

/** 开发地址设置
 * 开发地址：http://pcapi-xiaotuxian-front.itheima.net/
 * 上线地址：http://pcapi-xiaotuxian-front-devtest.itheima.net/
 */
// 2. 创建 baseURL 用于存储基准地址
const baseURL = "http://pcapi-xiaotuxian-front-devtest.itheima.net/";

// 1. 创建一个 axios 实例对象，用于配置项目应用相关请求
const instanceWithToken = axios.create({ baseURL }); // 携带Token才可以查看的数据
const instanceWithoutToken = axios.create({ baseURL }); // 无需携带 Token 就可以看到的数据
~~~

第四步：配置请求拦截器

~~~JavaScript
// 3. 请求拦截器：检查是否携带了Token
instanceWithToken.interceptors.request.use((config) => {
  // 获取 vuex
  const token = store.state.user.profile.token;
  // 判断Token是否携带
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
~~~

