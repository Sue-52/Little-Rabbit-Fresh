import requestWithoutToken from "@/utils/request";

/**
 * 账号密码登录
 * @param account 用户名或手机号
 * @param password 密码
 * @return {AxiosPromise}
 */
export function loginByAccount({ account, password }) {
  return requestWithoutToken("/login", "post", {
    account,
    password,
  });
}

/**
 * 获取验证码 (手机号登录)
 * @param mobile
 * @return {AxiosPromise}
 */
export function getLoginMsgCode(mobile) {
  return requestWithoutToken("/login/code", "get", { mobile });
}

/**
 * 手机号登录
 * @param mobile 手机号
 * @param code 验证码
 * @return {AxiosPromise}
 */
export function loginByMobile({ mobile, code }) {
  return requestWithoutToken("/login/code", "post", { mobile, code });
}
