export const formatDateTime = (date) =>
  date ? new Date(date).toLocaleString() : "(未知的時間)";
