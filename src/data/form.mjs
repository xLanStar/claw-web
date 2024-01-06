export const useRule = {
  required: (name) => (value) => value ? true : `${name} 為必填欄位`,
  minLength: (name, length) => (value) =>
    value?.length >= length ? true : `${name} 長度不得少於 ${length}`,
  maxLength: (name, length) => (value) =>
    value?.length <= length ? true : `${name} 長度不得超過 ${length}`,
  email: (name) => (value) =>
    /.+@.+\..+/.test(value) ? true : `${name} 必須是有效的`,
  number: (name) => (value) =>
    /^\d+$/.test(value) ? true : `${name} 必須是數字`,
  min: (name, min) => (value) =>
    value >= min ? true : `${name} 必須大於或等於 ${min}.`,
  max: (name, max) => (value) =>
    value <= max ? true : `${name} 必須小於或等於 ${max}.`,
  phone: (name) => (value) =>
    /^09\d{9}$/.test(value) ? true : `${name} 必須是有效的`,
  url: (name) => (value) =>
    /^https?:\/\/.+/.test(value) ? true : `${name} 必須是有效的`,
  pattern: (name, pattern) => (value) =>
    pattern.test(value) ? true : `${name} 必須是有效的`,
  alpha: (name) => (value) =>
    /^\w+$/.test(value) ? true : `${name} 必須由英文或數字組成`,
  custom: (name, custom) => (value) =>
    custom(value) ? true : `${name} 必須是有效的`,
};

export const CommonRules = {
  Email: [useRule.required("電子信箱"), useRule.email("電子信箱")],
  Password: [
    useRule.required("密碼"),
    useRule.minLength("密碼", 6),
    useRule.alpha("密碼"),
  ],
};
