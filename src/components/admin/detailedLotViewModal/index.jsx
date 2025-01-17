import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';

import { selectUserById } from '@slices/usersListSlice';
import { toggleModal, selectModalState } from '@slices/modalSlice';
import { selectLotDetailById } from '@slices/lotListSlice';
import { categoriesSelector } from '@slices/categoriesSlice';

import AdminDetailedLotView from '../adminDetailedLotView';

import styles from './detailedLotViewModal.module.scss';

const { dialog } = styles;

const DetailedLotViewModal = () => {
  const dispatch = useDispatch();
  const { lotId } = useSelector((state) => state.lotList);
  const lot = useSelector((state) => selectLotDetailById(state, lotId));
  const open = useSelector((state) => selectModalState(state, 'infoModal'));
  const userData = useSelector((state) => selectUserById(state, lot?.userId));
  const userInfo = useSelector((state) => state.usersList.userInfo);
  const categories = useSelector(categoriesSelector);

  const handleClose = () => {
    dispatch(toggleModal('infoModal'));
  };

  return (
    <>
      {lot && userData && !!categories.length && (
        <Dialog
          maxWidth="none"
          className={dialog}
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <AdminDetailedLotView
              lot={lot}
              userData={userData}
              categories={categories}
              adminTimeZone={userInfo.zoneinfo}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined" color="error">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default DetailedLotViewModal;
