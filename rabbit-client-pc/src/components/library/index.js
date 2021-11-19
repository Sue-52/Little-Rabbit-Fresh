import lazy from "../directive/lazy";

const importFn = require.context("./", false, /\.vue$/);
const keys = importFn.keys();

export default {
  install(app) {
    keys.forEach((item) => {
      const component = importFn(item).default;
      app.component(component.name, component);
    });
    app.directive("lazy", lazy);
  },
};
