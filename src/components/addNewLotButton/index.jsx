import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import AddIcon from '@mui/icons-material/Add';

import { getUserFromCognito } from '@thunks/fetchUsers';

import { CustomButton } from '@buttons/CustomButton';
import ROTES from '@helpers/routeNames';

const { CREATE_NEW_LOT } = ROTES;

export const AddNewLotButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.usersList.userInfo);
  const isAdmin = userInfo?.['custom:role'] === 'admin';

  const handleAddLot = () => {
    navigate(CREATE_NEW_LOT);
  };

  useEffect(() => {
    dispatch(getUserFromCognito());
  }, []);

  return (
    <>
      {userInfo && !isAdmin && (
        <CustomButton
          text="New lot"
          typeOfButton="button"
          handleClick={handleAddLot}
          icon={<AddIcon />}
        />
      )}
    </>
  );
};
