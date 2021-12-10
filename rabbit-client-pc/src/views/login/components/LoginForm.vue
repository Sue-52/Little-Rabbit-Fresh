<template>
  <div class="account-box">
    <div class="toggle">
      <button v-if="isMessage" @click="isMessage = false">
        <i class="iconfont icon-user"></i>
        使用账号登录
      </button>
      <button v-if="!isMessage" @click="isMessage = true">
        <i class="iconfont icon-msg"></i> 使用短信登录
      </button>
    </div>
    <div class="form">
      <!-- 账户登录 -->
      <template v-if="!isMessage">
        <form @submit="accountFromSubmit">
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-user"></i>
              <input
                type="text"
                v-model="accountField"
                placeholder="请输入用户名"
              />
            </div>
            <div class="error" v-if="accountError">
              <i class="iconfont icon-warning"> </i>{{ accountError }}
            </div>
          </div>
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-lock"></i>
              <input
                type="password"
                v-model="passwordField"
                placeholder="请输入密码"
              />
            </div>
            <div class="error" v-if="passwordError">
              <i class="iconfont icon-warning"> </i> {{ passwordError }}
            </div>
          </div>
          <div class="form-item">
            <div class="agree">
              <XtxCheckbox v-model="accountIsAgreeField" />
              <span>我已同意</span>
              <a href="javascript:">《隐私条款》</a>
              <span>和</span>
              <a href="javascript:">《服务条款》</a>
            </div>
            <div class="error" v-if="accountIsAgreeError">
              <i class="iconfont icon-warning"> </i>{{ accountIsAgreeError }}
            </div>
          </div>
          <button type="submit" class="btn">登录</button>
        </form>
      </template>
      <!-- 短信登录 -->
      <template v-if="isMessage">
        <form @submit="mobileFromSubmit">
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-user"></i>
              <input
                type="text"
                v-model="mobileField"
                placeholder="请输入手机号"
              />
            </div>
            <div class="error" v-if="mobileError">
              <i class="iconfont icon-warning"></i> {{ mobileError }}
            </div>
          </div>
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-code"></i>
              <input
                type="password"
                v-model="codeField"
                placeholder="请输入验证码"
              />
              <span
                class="code"
                :class="{ disable: isActive }"
                @click="getMsgCode"
              >
                {{ isActive ? `剩余${count}秒` : "发送验证码" }}
              </span>
            </div>
            <div class="error" v-if="codeError">
              <i class="iconfont icon-warning"></i> {{ codeError }}
            </div>
          </div>
          <div class="form-item">
            <div class="agree">
              <XtxCheckbox v-model="mobileIsAgreeField" />
              <span>我已同意</span>
              <a href="javascript:">《隐私条款》</a>
              <span>和</span>
              <a href="javascript:">《服务条款》</a>
            </div>
            <div class="error" v-if="mobileIsAgreeError">
              <i class="iconfont icon-warning"></i> {{ mobileIsAgreeError }}
            </div>
          </div>
          <button type="submit" class="btn">登录</button>
        </form>
      </template>
    </div>
    <div class="action">
      <img
        src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png"
        alt=""
      />
      <div class="url">
        <a href="javascript:">忘记密码</a>
        <a href="javascript:">免费注册</a>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useForm, useField } from "vee-validate";
import {
  account,
  password,
  isAgree,
  mobile,
  code,
} from "@/utils/vee-validate-schema";
import { getLoginMsgCode, loginByAccount, loginByMobile } from "@/api/user";
import Message from "@/components/library/Message";
import useCountDown from "@/hooks/useCountDown";
import useLoginAfter from "@/hooks/useLoginAfter";

export default {
  name: "LoginForm",
  setup() {
    const isMessage = ref(false);
    const { loginSuccess, loginError } = useLoginAfter();
    // 获取账号登陆表单验证
    const { accountFormHandleSubmit, ...accountFormValid } =
      useAccountFormValidate();
    const accountFromSubmit = accountFormHandleSubmit(
      ({ account, password }) => {
        // 当点击按钮后发起请求
        loginByAccount({ account, password })
          .then(loginSuccess)
          .catch(loginError);
      }
    );

    // 获取手机登录表单验证
    const { mobileFormHandleSumbit, mobileIsValidate, ...mobileFormValid } =
      useMobileFormValidate();
    const mobileFromSubmit = mobileFormHandleSumbit(({ mobile, code }) => {
      loginByMobile({ mobile, code })
        // 登录成功
        .then(loginSuccess)
        // 登录失败
        .catch(loginError);
    });
    // 倒计时
    const { count, start, isActive } = useCountDown();
    // 获取验证码
    const getMsgCode = async () => {
      // 用户是否输入手机号
      const { isValid, mobile } = await mobileIsValidate();
      // 发送请求验证码
      if (isValid && !isActive.value) {
        try {
          getLoginMsgCode(mobile);
          Message({ type: "success", text: "验证码发送成功" });
          start(60);
          // 开启倒计时
        } catch (error) {
          Message({ type: "success", text: error.response.data.message });
        }
      }
    };
    return {
      isMessage,
      accountFromSubmit,
      ...accountFormValid,
      mobileFromSubmit,
      ...mobileFormValid,
      getMsgCode,
      isActive,
      count,
    };
  },
};
// 账号表单验证
function useAccountFormValidate() {
  // 创建表单验证对象
  const { handleSubmit: accountFormHandleSubmit } = useForm({
    // 指定表单中包含的验证规则, 只有以下规则都验证通过了表单才可以提交
    validationSchema: {
      account,
      password,
      isAgree,
    },
  });

  const { value: accountField, errorMessage: accountError } =
    useField("account");
  const { value: passwordField, errorMessage: passwordError } =
    useField("password");
  const { value: accountIsAgreeField, errorMessage: accountIsAgreeError } =
    useField("isAgree");
  return {
    accountField,
    accountError,
    passwordField,
    passwordError,
    accountIsAgreeField,
    accountIsAgreeError,
    accountFormHandleSubmit,
  };
}
// 手机登录表单验证
function useMobileFormValidate() {
  const { handleSubmit: mobileFormHandleSumbit } = useForm({
    validationSchema: {
      mobile,
      code,
      isAgree,
    },
  });

  const {
    value: mobileField,
    errorMessage: mobileError,
    validate: mobileValidate,
  } = useField("mobile");
  const { value: codeField, errorMessage: codeError } = useField("code");
  const { value: mobileIsAgreeField, errorMessage: mobileIsAgreeError } =
    useField("isAgree");

  // 单独验证手机号
  const mobileIsValidate = async () => {
    const { valid } = await mobileValidate();
    return { isValid: valid, mobile: mobileField.value };
  };

  return {
    mobileField,
    mobileError,
    codeField,
    codeError,
    mobileIsAgreeField,
    mobileIsAgreeError,
    mobileFormHandleSumbit,
    mobileIsValidate,
  };
}
</script>

<style lang="less" scoped>
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    button {
      color: @xtxColor;
      background: none;
      border: none;
      cursor: pointer;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,
          &:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 33px;
          cursor: pointer;
        }
        .code.disabled {
          cursor: wait;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      border: none;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
