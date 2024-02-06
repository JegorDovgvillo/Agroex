import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';

import { updateUser } from '@thunks/fetchUsers';
import { toggleModal } from '@slices/modalSlice';
import { selectModalState } from '@slices/modalSlice';
import { selectUserById } from '@slices/usersListSlice';

import CustomTextField from '@customTextField';
import { CustomButton } from '@buttons/CustomButton';

import styles from './infoModal.module.scss';

const ModalForUpdatingUser = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) =>
    selectModalState(state, 'updatingModal')
  );
  const userId = useSelector((state) => state.usersList.userId);
  const userFields = useSelector((state) => selectUserById(state, userId));

  const userData = {
    username: userFields?.username || '',
    email: userFields?.email || '',
    phoneNumber: userFields?.phoneNumber || '',
    password: '',
  };

  const handleSubmitClick = (values) => {
    dispatch(updateUser({ id: userId, userData: values }));
    dispatch(toggleModal('updatingModal'));
  };

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={() => {
          dispatch(toggleModal('updatingModal'));
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={styles.wrapp}>
          <h2 className={styles.title}>Update user info</h2>
          <Formik
            initialValues={userData}
            onSubmit={(values) => {
              handleSubmitClick(values);
            }}
          >
            <Form>
              <CustomTextField
                name="username"
                placeholder="Username"
                required
                label="Username"
                id="username"
              />
              <CustomTextField
                label="Email"
                id="email"
                name="email"
                placeholder="Email"
                required
              />
              <CustomTextField
                name="phoneNumber"
                placeholder="Phone number"
                required
                label="Phone number"
                id="phoneNumber"
              />
              <CustomTextField
                name="password"
                placeholder="password"
                required
                label="Password"
                id="password"
              />
              <CustomButton text="Update" width="210px" typeOfButton="submit" />
            </Form>
          </Formik>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalForUpdatingUser;
