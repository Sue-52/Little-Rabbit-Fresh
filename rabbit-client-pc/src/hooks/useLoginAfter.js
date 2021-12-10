import { useRouter } from "vue-router";
import Message from "@/components/library/Message";
import { useStore } from "vuex";

export default function useLoginAfter() {
  const router = useRouter();
  const store = useStore();
  const loginSuccess = ({ result }) => {
    // 存储用户信息
    store.commit("user/setUser", {
      // 用户id
      id: result.id,
      // 用户头像
      avatar: result.account,
      // 用户昵称
      nickname: result.nickname,
      // 用户账号
      account: result.account,
      // 用户手机号
      mobile: result.mobile,
      // 用户登录凭证
      token: result.token,
    });
    // 跳转首页
    router.push("/");
    // 提示用户登陆成功
    Message({
      type: "success",
      message: "登陆成功",
    });
  };
  const loginError = (error) => {
    // 登录失败之后的提示信息
    console.log(error);
    Message({
      type: "error",
      text: error.response.data.message,
    });
  };

  return {
    loginSuccess,
    loginError,
  };
}
