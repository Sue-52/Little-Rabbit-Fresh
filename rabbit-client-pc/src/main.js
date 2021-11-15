import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// 引入全局样式清除
import "normalize.css";
import "@/assets/styles/common.less";

// 全局组件注册
import UI from "@/components/library";

createApp(App).use(store).use(router).use(UI).mount("#app");
