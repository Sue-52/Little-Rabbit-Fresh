import { createVNode, render } from "vue";
import XtxConfirm from "@/components/library/XtxConfirm";

const container = document.createElement("div");
document.body.appendChild(container);

export default function Confirm({ title = "温馨提示", content }) {
  return new Promise((resolve, reject) => {
    const onSureButtonClickHandler = () => {
      resolve();
      render(null, container);
    };
    const onCancelButtonClickHandler = () => {
      reject();
      render(null, container);
      vNode.el.classList.remove("fade");
      vNode.el.children[0].classList.remove("fade");
      setTimeout(() => {
        render(null, container);
      }, 400);
    };
    const vNode = createVNode(XtxConfirm, {
      title,
      content,
      onSureButtonClick: onSureButtonClickHandler,
      onCancelButtonClick: onCancelButtonClickHandler,
    });
    render(vNode, container);
    // 只有元素渲染完成后才能执行动画
    // 若下面代码不被定时器包裹, 代码执行到此处时元素还没有开始渲染, 所以动画不会生效
    // setTimeout 是异步的, 当所有同步代码执行完成后, 浏览器优先渲染 HTML, HTML 渲染完成后才执行异步回调
    // 就是说当执行 setTimeout 方法的回调函数时, HTML 已经渲染完成, 可以添加类名执行动画了
    // 执行入场动画
    setTimeout(() => {
      vNode.el.classList.add("fade");
      vNode.el.children[0].classList.add("fade");
    }, 0);
  });
}
