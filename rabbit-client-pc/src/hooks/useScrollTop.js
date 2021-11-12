import { ref, onMounted, onUnmounted } from "vue";

// TODO: useScrollTop
export default function useScrollTop() {
  // 存储滚动条的位置
  const scrollTop = ref(0);
  // 滚动事件处理函数
  const onScrollHandler = () => {
    scrollTop.value =
      document.documentElement.scrollTop || document.body.scrollTop;
  };
  // 组件初始化时，绑定滚动事件
  onMounted(() => {
    // 绑定滚动事件
    window.addEventListener("scroll", onScrollHandler);
  });
  // 组件销毁时，解绑滚动事件
  onUnmounted(() => {
    // 解绑滚动事件
    window.removeEventListener("scroll", onScrollHandler);
  });

  // 返回滚动条的位置
  return scrollTop;
}
