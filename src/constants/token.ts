const TOKENS = {
  USER_TOKEN: () => process.env.USER_TOKEN as string,
  PLUMBER_TOKEN: () => process.env.PLUMBER_TOKEN as string,
  ADMIN_TOKEN: () => process.env.ADMIN_TOKEN as string,
};

export default TOKENS;
