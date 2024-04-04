export const getFetchResultMessages = (action) => {
  return {
    successLotDelete: 'Lot has been successfully deleted.',
    successLotUpdate: 'Lot has been successfully updated.',
    successLotCreate: 'New lot has been successfully created.',
    successInnerStatusLotUpdate: 'Lot status has been successfully changed.',
    successUserStatusLotUpdate: `Lot has been successfully ${
      action ? 'activated' : 'deactivated'
    }.`,

    successUserCreate: 'Your account has been successfully created',
    successPasswordUpdate: 'Your password has been successfully updated',
    successUserDataUpdate: 'Your data has been successfully updated',

    successUserStatusUpdate: 'User status has been successfully updated',
    successUserDBUpdate: 'Users Data Base has been successfully updated',

    successCategoryCreate: 'New category has been successfully created.',
    successCategoryUpdate: 'The category has been successfully updated.',
    successCategoryDelete: 'Category has been successfully deleted.',

    successPlaceBet: 'Your bet has been successfully placed',
    successPlaceDeal: 'Your order has been successfully placed!',

    authError: 'Authorization error',
    serverError: 'Internal server error',
    badRequestError: 'Bad request error',
    unknown: 'Error. Something went wrong',
    successUpdateUserData: 'Your data has been successfully updated.',
    updateUserDataWarning:
      '\nAn issue occurred while updating our databases. No actions needed',

    unableToShowFilters: {
      title: 'Error. Unable to display the filter panel.',
      message: 'Try reloading the page.',
    },
  };
};

export const snackbarMessages = {
  login: 'Please login',
};
