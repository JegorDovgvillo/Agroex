const ROUTES = {
  HOME_PAGE: '/:category/:subcategory?',

  LOTS: '/lots',
  LOTS_DETAILS: '/lots/:id/details',
  ADMIN: '/admin',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_USERS: '/admin/users',
  ADMIN_LOTS: '/admin/lots',
  CREATE_NEW_LOT: '/new-lot',
  UPDATE_LOT: '/update-lot/:id',

  USER_PROFILE: '/user-profile',
  USER_PROFILE_PAGE: '/user-profile/:page',
  USER_PROFILE_PAGE_TAB: '/user-profile/:page/:tab',
};

export const USER_PROFILE_PAGE_ROTES = {
  USER_LOTS: 'my-lots',
  USER_BETTING: 'betting',
  USER_ORDERS: 'my-orders',
  USER_ACCOUNT: 'my-account',
};

export default ROUTES;
