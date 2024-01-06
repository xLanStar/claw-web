export const Role = {
  Guest: 0,
  Member: 1,
  VIP: 2,
  Admin: 10,
  Root: 11,
};

export const RoleName = {
  [Role.Guest]: "訪客",
  [Role.Member]: "會員",
  [Role.VIP]: "終極會員",
  [Role.Admin]: "管理員",
  [Role.Root]: "系統管理員",
};

export const RoleColor = {
  [Role.Guest]: "green",
  [Role.Member]: "blue",
  [Role.VIP]: "cyan",
  [Role.Admin]: "red",
  [Role.Root]: "purple",
};
