// 引入 axios 包
import router from "@/router";
import store from "@/store";
import axios from "axios";

/** 开发地址设置
 * 开发地址：http://pcapi-xiaotuxian-front.itheima.net/
 * 上线地址：http://pcapi-xiaotuxian-front-devtest.itheima.net/
 */
// 2. 创建 baseURL 用于存储基准地址
const baseURL = "http://pcapi-xiaotuxian-front-devtest.itheima.net/";

// 1. 创建一个 axios 实例对象，用于配置项目应用相关请求
const instanceWithToken = axios.create({ baseURL }); // 携带Token才可以查看的数据
const instanceWithoutToken = axios.create({ baseURL }); // 无需携带 Token 就可以看到的数据

// 6. 用于返回 response.data
const onResponseFulfilled = (response) => response.data;

// 5. 用于捕获错误，传递错误
const onRejected = (error) => Promise.reject(error);

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
      });
  }
  // 返回错误
  return Promise.reject(error);
});

// 响应拦截器(不携带token) 返回 response.data、捕获错误传递错误
instanceWithoutToken.interceptors.response.use(onResponseFulfilled, onRejected);

// 生成请求函数所需参数
const generateRequestConfig = (url, method, data) => ({
  url,
  method,
  [method.toLowerCase() === "get" ? "params" : "data"]: data,
});

// 请求函数（不带Token）
export default function requestWithoutToken(url, method, data) {
  return instanceWithoutToken(generateRequestConfig(url, method, data));
}

// 请求函数（带Token）
export function requestWIthToken(url, method, data) {
  return instanceWithToken(generateRequestConfig(url, method, data));
}
