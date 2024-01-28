export const DrawEventTriggerType = {
  HOLE_LEFT: 0,
  RESET: 1,
};

export const DrawEventTriggerTypeNameMap = {
  [DrawEventTriggerType.HOLE_LEFT]: "洞數剩餘",
  [DrawEventTriggerType.RESET]: "重置時",
};

export const DrawEventTriggerTypeOptions = Object.values(
  DrawEventTriggerType
).map((value) => ({ value, title: DrawEventTriggerTypeNameMap[value] }));

// const exampleTrigger = {
//   type: "LEFT",
//   data: 10,
// };

export const DrawEventContentType = {
  RESET: 0,
  ADD_PRIZE_RANDOM: 1,
};

export const DrawEventContentTypeNameMap = {
  [DrawEventContentType.RESET]: "重置戳戳樂",
  [DrawEventContentType.ADD_PRIZE_RANDOM]: "加入獎項至隨機空位",
};

export const DrawEventContentTypeOptions = Object.values(
  DrawEventContentType
).map((value) => ({ value, title: DrawEventContentTypeNameMap[value] }));

// const exampleContent1 = {
//   type: "RESET",
// };
// const exampleContent2 = {
//   type: "ADD_PRIZE",
//   data: ['1'],
// };
