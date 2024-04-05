const isProd = import.meta.env.PROD;

const prefix = isProd ? '/team1' : '';

const ROUTES = {
  ROOT: `${prefix}`,
  HOME_PAGE: `${prefix}/:category?`,
  LOTS: `${prefix}/lots`,
  LOTS_DETAILS: `${prefix}/lots/:id/details`,
  ADMIN: `${prefix}/admin`,
  ADMIN_PAGE: `${prefix}/admin/:page`,
  CREATE_NEW_LOT: `${prefix}/new-lot`,
  UPDATE_LOT: `${prefix}/update-lot/:id`,
  USER_PROFILE: `${prefix}/user-profile`,
  USER_PROFILE_PAGE: `${prefix}/user-profile/:page`,
  USER_PROFILE_PAGE_TAB: `${prefix}/user-profile/:page/:tab`,
  LOG_IN: `${prefix}/log-in`,
  NOT_FOUND: `${prefix}/not-found`,
};

export const ADMIN_PAGES = {
  ADMIN_CATEGORIES: 'categories',
  ADMIN_USERS: 'users',
  ADMIN_LOTS: 'lots',
  ADMIN_REPORTS: 'reports',
};

export const USER_PROFILE_PAGE_ROTES = {
  USER_LOTS: 'my-lots',
  USER_BETTING: 'betting',
  USER_ORDERS: 'my-orders',
  USER_ACCOUNT: 'my-account',
};

export default ROUTES;
