import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';

import { createUser } from '@store/thunks/fetchUsers';
import { toggleModal } from '@store/slices/modalSlice';
import { selectModalState } from '@store/slices/modalSlice';

import CustomTextField from '../customTextField';
import { CustomButton } from '../buttons/CustomButton';

import styles from './infoModal.module.scss';

const ModalForCreatingUser = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) =>
    selectModalState(state, 'creatingModal')
  );

  const userData = {
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
  };

  const handleSubmitClick = (values) => {
    dispatch(createUser(values));
    dispatch(toggleModal('creatingModal'));
  };

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={() => {
          dispatch(toggleModal('creatingModal'));
        }}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box className={styles.wrapp}>
          <h2 className={styles.title}>Create new user</h2>
          <Formik
            initialValues={userData}
            onSubmit={(values) => {
              handleSubmitClick(values);
            }}
          >
            <Form>
              <CustomTextField
                name='username'
                placeholder='Username'
                required
                label='Username'
                id='username'
              />
              <CustomTextField
                label='Email'
                id='email'
                name='email'
                placeholder='Email'
                required
              />
              <CustomTextField
                name='phoneNumber'
                placeholder='Phone number'
                required
                label='Phone number'
                id='phoneNumber'
              />
              <CustomTextField
                name='password'
                placeholder='password'
                required
                label='Password'
                id='password'
              />
              <CustomButton text='Create' width='210px' typeOfButton='submit' />
            </Form>
          </Formik>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalForCreatingUser;
