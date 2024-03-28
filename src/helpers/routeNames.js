const ROUTES = {
  HOME_PAGE: '/:category?',
  LOTS: '/lots',
  LOTS_DETAILS: '/lots/:id/details',

  ADMIN: '/admin',
  ADMIN_PAGE: '/admin/:page',

  CREATE_NEW_LOT: '/new-lot',
  UPDATE_LOT: '/update-lot/:id',

  USER_PROFILE: '/user-profile',
  USER_PROFILE_PAGE: '/user-profile/:page',
  USER_PROFILE_PAGE_TAB: '/user-profile/:page/:tab',

  LOG_IN: '/log-in',
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
