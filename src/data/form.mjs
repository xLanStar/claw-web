export const InputType = {
  Email: "email",
  Password: "password",
  Text: "text",
  Number: "number",
  Phone: "tel",
  Select: "select",
  Boolean: "boolean",
  Range: "range",
  AutoComplete: "autocomplete",
  File: "file",
};

export const InputComponentMap = {
  [InputType.Email]: "v-text-field",
  [InputType.Password]: "v-text-field",
  [InputType.Text]: "v-text-field",
  [InputType.Number]: "v-text-field",
  [InputType.Phone]: "v-text-field",
  [InputType.Select]: "v-select",
  [InputType.Boolean]: "v-checkbox",
  [InputType.Range]: "v-slider",
  [InputType.AutoComplete]: "v-autocomplete",
  [InputType.File]: "v-file-input",
};

export const isNumberInputType = (inputType) =>
  inputType === InputType.Number || inputType === InputType.Range;

export const parseInputData = (inputType, inputData) =>
  isNumberInputType(inputType) ? Number(inputData) : inputData;

export const useRule = {
  required: (name) => (value) =>
    value !== undefined && value !== null ? true : `${name} 為必填欄位`,
  minLength: (name, length) => (value) =>
    value?.length >= length ? true : `${name} 長度不得少於 ${length}`,
  maxLength: (name, length) => (value) =>
    value?.length <= length ? true : `${name} 長度不得超過 ${length}`,
  email: (name) => (value) =>
    /.+@.+\..+/.test(value) ? true : `${name} 必須是有效的`,
  number: (name) => (value) =>
    /^\d+$/.test(value) ? true : `${name} 必須是數字`,
  min:
    (name, min, nullable = false) =>
    (value) =>
      (nullable && (value === null || value === undefined || value === "")) ||
      value >= min
        ? true
        : `${name} 必須大於或等於 ${min}.`,
  max:
    (name, max, nullable = false) =>
    (value) =>
      (nullable && (value === null || value === undefined || value === "")) ||
      value <= max
        ? true
        : `${name} 必須小於或等於 ${max}.`,
  phone: (name) => (value) =>
    /^09\d{9}$/.test(value) ? true : `${name} 必須是有效的`,
  url: (name) => (value) =>
    /^https?:\/\/.+/.test(value) ? true : `${name} 必須是有效的`,
  pattern: (name, pattern) => (value) =>
    pattern.test(value) ? true : `${name} 必須是有效的`,
  alpha: (name) => (value) =>
    /^\w+$/.test(value) ? true : `${name} 必須由英文或數字組成`,
  integer: (name, nullable) => (value) =>
    (nullable && (value === null || value === undefined || value === "")) ||
    /^[-+]?\d+$/.test(value)
      ? true
      : `${name} 必須是整數`,
  custom: (name, custom) => (value) =>
    custom(value) ? true : `${name} 必須是有效的`,
};

export const CommonRules = {
  Required: (value) =>
    value !== "" && value !== null && value !== undefined
      ? true
      : `此欄位為必填`,
  Email: [useRule.required("電子信箱"), useRule.email("電子信箱")],
  Password: [
    useRule.required("密碼"),
    useRule.minLength("密碼", 6),
    useRule.alpha("密碼"),
  ],
};

export const CommonAccept = {
  Image: "image/*",
};
