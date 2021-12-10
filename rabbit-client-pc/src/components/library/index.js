import lazy from "../directive/lazy";
import Message from "./Message";

const importFn = require.context("./", false, /\.vue$/);
const keys = importFn.keys();

export default {
  install(app) {
    keys.forEach((item) => {
      const component = importFn(item).default;
      app.component(component.name, component);
    });
    app.directive("lazy", lazy);
    // 添加到全局属性
    app.config.globalProperties.$message = Message;
  },
};
