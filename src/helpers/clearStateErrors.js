import { clearLotListErrors } from '@slices/lotListSlice';
import { clearBetsErrors } from '@slices/betsSlice';
import { clearCategoriesErrors } from '@slices/categoriesSlice';
import { clearCountriesErrors } from '@slices/countriesSlice';
import { clearTagsErrors } from '@slices/tagsSlice';
import { clearUsersListErrors } from '@slices/usersListSlice';

export const clearStateErrors = (stateId) => {
  switch (stateId) {
    case 'lotList':
      return clearLotListErrors();

    case 'bets':
      return clearBetsErrors();

    case 'categories':
      return clearCategoriesErrors();

    case 'countries':
      return clearCountriesErrors();

    case 'tags':
      return clearTagsErrors();

    case 'usersList':
      return clearUsersListErrors();
  }
};
