export const diff = (src, dst) => {
  const result = {};
  for (const key in dst) {
    if (src?.[key] !== dst[key]) {
      result[key] = dst[key];
    }
  }
  return result;
};
