// 引入 axios 包
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
