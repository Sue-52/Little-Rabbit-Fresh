import lazy from "../directive/lazy";

const importFn = require.context("./", false, /\.vue$/);
// console.log(importFn.keys());
const keys = importFn.keys();

export default {
  install(app) {
    keys.forEach((item) => {
      const component = importFn(item).default;
      // console.log(importFn(item));
      // console.log(component);
      app.component(component.name, component);
    });
    app.directive("lazy", lazy);
  },
};
