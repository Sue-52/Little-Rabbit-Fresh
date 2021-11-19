import { createRouter, createWebHashHistory } from "vue-router";
// 引入主页面
const HomePage = () =>
  import(/*webpackChunkName: 'HomePage'*/ "@/views/home/HomePage");
const TopCategoryPage = () =>
  import(
    /*webpackChunkName: 'TopCategoryPage'*/ "@/views/category/TopCategoryPage"
  );
const SubCategoryPage = () =>
  import(
    /*webpackChunkName: 'webpackChunkName'*/ "@/views/category/SubCategoryPage"
  );

const routes = [
  {
    path: "/",
    name: "HomePage",
    component: HomePage,
  },
  {
    path: "/category/:id",
    component: TopCategoryPage,
  },
  {
    path: "/category/sub/:id",
    component: SubCategoryPage,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // 点击路由回到顶部
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
