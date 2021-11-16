// 默认图片
import defaultImg from "@/assets/images/200.png";

const lazy = {
  // 指定所在元素挂在完成后
  mounted(el, binding) {
    // 创建元素监听对象
    const observer = new IntersectionObserver(([{ isIntersecting }]) => {
      // 判断元素是否进入可视区
      if (isIntersecting) {
        // 停止监听元素
        observer.unobserve(el);
        // 加载图片
        el.src = binding.value;
        // 图片加载错误时
        el.onerror = () => {
          // 显示默认图片
          el.src = defaultImg;
        };
      }
    });
    // 指定监听元素
    observer.observe(el);
  },
};

export default lazy;
