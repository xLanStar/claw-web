import { RoleName } from "./role.mjs";

const ChangeLogReason = {
  // Change by admin
  MANAGE_BY_ADMIN: 0,
  // Change by user
  DRAW: 10,
  // BUY: 11,
};

const ChangeLogReasonNameMap = {
  [ChangeLogReason.MANAGE_BY_ADMIN]: "管理員更新",
  [ChangeLogReason.DRAW]: "抽獎",
  //   [ChangeLogReason.BUY]: "購買商品",
};

const ChangeNameMap = {
  uDiamond: "鑽石",
  uGold: "金幣",
  uClawChance: "夾娃娃機會",
  uToken: "代幣",
  uRemark: "備註欄",
  uName: "姓名",
  uEmail: "電子信箱",
  uPassword: "密碼",
  uPhoneNumber: "電話號碼",
  uAddress: "地址",
  uRole: "身分",
};

const ChangeParserMap = {
  uToken: (uToken) =>
    Object.keys(uToken)
      .map((adminId) => uToken?.[adminId])
      .join("、"),
  uRole: (uRole) => RoleName?.[uRole] || uRole,
};

const getChangeParser = (change) =>
  ChangeParserMap?.[change] || ((value) => value);

const parseChangeValues = (oldValues, newValues) =>
  Object.keys(oldValues)
    .map((change) => {
      const parser = getChangeParser(change);
      return `${ChangeNameMap[change]}：${
        parser(oldValues?.[change]) ?? "空值"
      } －＞ ${parser(newValues?.[change])}`;
    })
    .join("\n");

const ChangeLogValueParserMap = {
  [ChangeLogReason.MANAGE_BY_ADMIN]: ({ adminId, oldValues, newValues }) =>
    parseChangeValues(oldValues, newValues),
  [ChangeLogReason.DRAW]: ({ dId, dName, dCost, oldValues, newValues }) =>
    `在 ${dName} 抽獎，消耗 ${dCost} 代幣\n${parseChangeValues(
      oldValues,
      newValues
    )}`,
};

export const parseChangeReason = (reason) =>
  ChangeLogReasonNameMap?.[reason] || reason;

export const parseChangeLogValue = (reason, value) =>
  ChangeLogValueParserMap?.[reason]?.(value) || value;
