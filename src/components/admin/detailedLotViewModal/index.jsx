import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';

import { fetchUser } from '@thunks/fetchUsers';
import { fetchLotDetails } from '@thunks/fetchLots';
import { fetchAllCategories } from '@thunks/fetchCategories';
import { selectUserById } from '@slices/usersListSlice';
import { toggleModal, selectModalState } from '@slices/modalSlice';
import { selectLotDetailById } from '@slices/lotListSlice';
import { categoriesSelector } from '@slices/categoriesSlice';

import AdminDetailedLotView from '../adminDetailedLotView';
import ConfirmActionModal from '@customModals/confirmActionModal';

import styles from './detailedLotViewModal.module.scss';

const { dialog } = styles;

const DetailedLotViewModal = () => {
  const dispatch = useDispatch();
  const { lotId } = useSelector((state) => state.lotList);
  const lot = useSelector((state) => selectLotDetailById(state, lotId));
  const open = useSelector((state) => selectModalState(state, 'infoModal'));
  const { userId } = useSelector((state) => state.usersList);
  const userData = useSelector((state) => selectUserById(state, userId));
  const [confirm, setConfirm] = useState(false);
  const categories = useSelector(categoriesSelector);

  useEffect(() => {
    dispatch(fetchLotDetails(lotId));
    dispatch(fetchUser(userId));
    dispatch(fetchAllCategories());
  }, [dispatch, lotId, userId]);

  useEffect(() => {
    if (confirm) {
      setConfirm(false);
    }
  }, [confirm, lot]);

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
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined" color="error">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <ConfirmActionModal
        text="This action changes the lot status. Do you confirm the action?"
        setConfirmStatus={setConfirm}
        modalType="confirmNestedModal"
      />
    </>
  );
};

export default DetailedLotViewModal;
