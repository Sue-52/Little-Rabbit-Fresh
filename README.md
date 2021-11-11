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
}, onRejected);
~~~

第五步：配置响应拦截器（携带Token）

~~~javascript
// 4. 响应拦截器（携带Token）返回 response.data, 处理服务器端返回未授权的情况、捕获错误传递错误
/**
 * 第一个参数获取数据
 * 第二个参数当响应失败时执行的回调
 */
instanceWithToken.interceptors.response.use(onResponseFulfilled, (error) => {
  // 当响应状态码为失败时执行当前回调
  // 请求未授权，表示没有登陆或登陆状态失效
  if (error.response.status === 401) {
    // 清空用户信息
    store.commit("user/setUser", {});
    // 跳转到登录页面
    router
      .push("/login")
      .then(() => {
        console.log("页面跳转成功");
      })
      .catch(() => {
        console.log("页面跳转失败");
      });生成请求函数所需参数
  }
  // 返回错误
  return Promise.reject(error);
});
~~~

第六步：响应拦截器，无Token

~~~javascript
// 响应拦截器(不携带token) 返回 response.data、捕获错误传递错误
instanceWithoutToken.interceptors.response.use(onResponseFulfilled, onRejected);
~~~

第七步：封装公共属性

~~~javascript
// 6. 用于返回 response.data
const onResponseFulfilled = (response) => response.data;

// 5. 用于捕获错误，传递错误
const onRejected = (error) => Promise.reject(error);
~~~

第八步：生成请求函数所需参数

~~~javascript
// 生成请求函数所需参数
const generateRequestConfig = (url, method, data) => ({
  url,
  method,
  [method.toLowerCase() === "get" ? "params" : "data"]: data,
});

// 请求函数（不带Token）
export default function requestWitho utToken(url, method, data) {
  return instanceWithoutToken(generateRequestConfig(url, method, data));
}

// 请求函数（带Token）
export function requestWIthToken(url, method, data) {
  return instanceWithToken(generateRequestConfig(url, method, data));
}
~~~

## 配置 Vue-Router 文件

| 路径              | 组件（功能）   | 嵌套级别 |
| :---------------- | :------------- | :------- |
| /                 | 首页           | 1级      |
| /category/:id     | 一级分类       | 1级      |
| /category/sub/:id | 二级分类       | 1级      |
| /goods/:id        | 商品详情       | 1级      |
| /cart             | 购物车         | 1级      |
| /login            | 登录           | 1级      |
| /login/callback   | 第三方登录回调 | 1级      |
| /checkout/order   | 结算           | 1级      |
| /checkout/pay     | 支付           | 1级      |
| /pay/callback     | 支付结果       | 1级      |
| /member/home      | 个人中心       | 1级      |
| /member/order     | 订单页面       | 1级      |
| /member/order     | 订单列表       | 2级      |
| /member/order/:id | 订单详情       | 2级      |

第一步：创建公共组件

`components/AppTopNav.vue`

~~~javascript
<template><div>AppTopNav</div></template>

<script>
export default {};
</script>

<style></style>
~~~

`components/AppHeader.vue`

~~~javascript
<template><div>AppHeader</div></template>

<script>
export default {};
</script>

<style></style>
~~~

`components/AppFooter.vue`

~~~javascript
<template><div>AppFooter</div></template>

<script>
export default {};
</script>

<style></style>
~~~

第二步：将布局组件放入到`views/LayoutTemplate.vue`中

~~~javascript
<template>
  <AppTopNav />
  <AppHeader />
  <!-- 占位符 -->
  <slot />
  <AppFooter />
</template>

<script>
import AppTopNav from "@/components/AppTopNav.vue";
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";
export default {
  components: { AppTopNav, AppHeader, AppFooter },
};
</script>

<style></style>
~~~

第三步: 创建页面级路由组件，首页页面组件

并在其中间使用占位符

`views/home/HomePage.vue`

~~~javascript
<template>
  <LayoutTemplate>
    <div>HomePage</div>
  </LayoutTemplate>
</template>

<script>
import LayoutTemplate from "@/views/LayoutTemplate.vue";
export default {
  components: { LayoutTemplate },
  name: "HomePage",
};
</script>

<style></style>
~~~

第四步: 配置首页页面组件的路由规则

`router/index.js`

~~~javascript
import { createRouter, createWebHashHistory } from "vue-router";
// 引入主页面
const HomePage = () =>
  import(/*webpackChunkName: 'HomePage'*/ "@/views/home/HomePage");

const routes = [
  {
    path: "/",
    name: "HomePage",
    component: HomePage,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
~~~

## Less 文件配置

`assets/styles/variables.less`: 存储应用公共颜色变量

~~~less
// 主题
@xtxColor: #27BA9B;
// 辅助
@helpColor: #E26237;
// 成功
@sucColor: #1DC779;
// 警告
@warnColor: #FFB302;
// 价格
@priceColor: #CF4444;
~~~

`assets/styles/variables.less`: 存储公共的less混入央视

~~~less
// 鼠标经过上移阴影动画
.hoverShadow () {
  transition: all .5s;
  &:hover {
    transform: translate3d(0,-3px,0);
    box-shadow: 0 3px 8px rgba(0,0,0,0.2);
  }
}
~~~

在 less 代码中若想使用公共变量需要 `@import` 方式引入：

~~~less
<template>
  <div class="box">test box</div>
</template>
<style scoped lang="less">
@import "./assets/styles/variables";
.box {
  color: @xtxColor;
}
</style>
~~~

但是vue的组件化开发方式，很多组件会使用该公共变量，一个一个引入太过于麻烦了。

所以我们要通过 `webpack loader` 方式自动注入 less。

第一步：通过脚手架工具安装 `style-resources-loader` 插件

~~~powershell
vue add style-resources-loader;
~~~

`Vue add` 命令其实就是帮助我们下载包, 运行包，通过命令的方式为项目创建文件或添加代码, 省去固定的配置或操作。

以下命令执行完成后会在应用的根目录下产生 `vue.config.js` 文件 

![22](https://gitee.com/sue201982/mysql/raw/master/img//22.png)

第二步：在`vue.config.js`文件中指定要注入的less文件

~~~javascript
const path = require("path");

module.exports = {
  transpileDependencies: true,

  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [
        path.join(__dirname, "src", "assets", "styles", "mixin.less"),
        path.join(__dirname, "src", "assets", "styles", "variables.less"),
      ],
    },
  },
};
~~~

**诸如完成后要重启服务。**

## 样式清除和公共样式配置

第一步：下载 `normalize.css` 第三方样式重置库 `npm install normalize.css@8.0.1`

![23](https://gitee.com/sue201982/mysql/raw/master/img//23.png)

第二步: 在 `src/assets/styles` 文件件中创建 `common.less` 文件用于存放我们自己的样式重置及公共样式

~~~less
// 重置样式
* {
  box-sizing: border-box;
 }
 
 html {
   height: 100%;
   font-size: 14px;
 }
 body {
   height: 100%;
   color: #333;
   min-width: 1240px;
   font: 1em/1.4 'Microsoft Yahei', 'PingFang SC', 'Avenir', 'Segoe UI', 'Hiragino Sans GB', 'STHeiti', 'Microsoft Sans Serif', 'WenQuanYi Micro Hei', sans-serif
 }
 
 ul,
 h1,
 h3,
 h4,
 p,
 dl,
 dd {
   padding: 0;
   margin: 0;
 }
 
 a {
   text-decoration: none;
   color: #333;
   outline: none;
 }
 
 i {
   font-style: normal;
 }
 
 input[type="text"],
 input[type="search"],
 input[type="password"], 
 input[type="checkbox"]{
   padding: 0;
   outline: none;
   border: none;
   -webkit-appearance: none;
   &::placeholder{
     color: #ccc;
   }
 }
 
 img {
   max-width: 100%;
   max-height: 100%;
   vertical-align: middle;
 }
 
 ul {
   list-style: none;
 }
 
 #app {
   background: #f5f5f5;
   // user-select: none;
 }
 
 .container {
   width: 1240px;
   margin: 0 auto;
   position: relative;
 }
 
 .ellipsis {
   white-space: nowrap;
   text-overflow: ellipsis;
   overflow: hidden;
 }
 
 .ellipsis-2 {
   word-break: break-all;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-box-orient: vertical;
   -webkit-line-clamp: 2;
   overflow: hidden;
 }
 
 .fl {
   float: left;
 }
 
 .fr {
   float: right;
 }
 
 .clearfix:after {
   content: ".";
   display: block;
   visibility: hidden;
   height: 0;
   line-height: 0;
   clear: both;
 }
~~~

第三步：在 `main.js` 中引入文件

~~~javascript
// 引入全局样式清除
import "normalize.css";
import "@/assets/styles/common.less";
~~~