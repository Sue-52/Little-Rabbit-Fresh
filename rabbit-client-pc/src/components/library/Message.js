// 1. 导入单文件
// 2. 将单文件渲染为虚拟DOM节点
// 3. 将虚拟DOM节点渲染成真实DOM节点
// 4. 定时器 3 秒
import XtxMessage from "@/components/library/XtxMessage";
import { createVNode, render } from "vue";

const container = document.createElement("div");
document.body.appendChild(container);

let timer = null;

export default function Message({ type, text }) {
  // 渲染为虚拟节点
  const Vnode = createVNode(XtxMessage, { type, text });
  // 将虚拟节点渲染为真实DOM
  render(Vnode, container);
  // 定时器
  clearTimeout(timer);
  timer = setTimeout(() => {
    // render(null, container);
    Vnode.component.proxy.show = false;
    container._vnode = null;
  }, 3000);
}
