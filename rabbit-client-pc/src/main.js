import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// 引入全局样式清除
import "normalize.css";
import "@/assets/styles/common.less";

createApp(App).use(store).use(router).mount("#app");
