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

import { createUserValidationSchema } from '@helpers/validationSchemes/userDataValidationSchemes';

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
            validationSchema={createUserValidationSchema}
          >
            {({ values, errors, touched, isValid }) => (
              <Form>
                <CustomTextField
                  name="username"
                  placeholder="Username"
                  label="Username"
                  id="username"
                  value={values.username}
                  errors={errors.username}
                  touched={touched.username}
                />
                <CustomTextField
                  label="Email"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={values.email}
                  errors={errors.email}
                  touched={touched.email}
                />
                <CustomTextField
                  name="phoneNumber"
                  placeholder="Phone number"
                  type="tel"
                  label="Phone number"
                  id="phoneNumber"
                  value={values.phoneNumber}
                  errors={errors.phoneNumber}
                  touched={touched.phoneNumber}
                />
                <CustomTextField
                  name="password"
                  placeholder="password"
                  label="Password"
                  id="password"
                  value={values.password}
                  errors={errors.password}
                  touched={touched.password}
                />
                <CustomButton
                  text="Update"
                  width="210px"
                  typeOfButton="submit"
                  dispatch={!isValid}
                />
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalForUpdatingUser;
