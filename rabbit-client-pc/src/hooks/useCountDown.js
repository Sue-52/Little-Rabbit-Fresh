import { useIntervalFn } from "@vueuse/core";
import { onUnmounted, ref } from "vue";

export default function useCountDown() {
  const count = ref(0);
  // vueuse，和原生JS的setInterval一样。
  // pause 清除定时器
  // resume 重新开启定时器
  // isActive 定时器是否正在执行
  const { pause, resume, isActive } = useIntervalFn(
    () => {
      if (count.value <= 0) {
        pause();
      } else {
        count.value = count.value - 1;
      }
    },
    1000,
    {
      immediate: false,
    }
  );
  // 开始倒计时
  const start = (value) => {
    // 如果正在倒计时
    if (!isActive.value) {
      // 重新设置
      count.value = value;
      // 开始
      resume();
    }
  };
  // 组件卸载时，清除定时器
  onUnmounted(pause);
  return {
    count,
    start,
    isActive,
  };
}
