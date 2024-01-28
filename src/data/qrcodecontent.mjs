export const QRCodeContentType = {
  Token: 0,
  Gold: 1,
};

export const QRCodeContentTypeNameMap = {
  [QRCodeContentType.Token]: "代幣",
  [QRCodeContentType.Gold]: "金幣",
};

export const QRCodeContentTypeOptions = Object.values(QRCodeContentType).map(
  (value) => ({ value, title: QRCodeContentTypeNameMap[value] })
);

/**
 * [
 *     { type: 0, count: 1 },
 *     { type: 1, count: 1 },
 * ]
 */
