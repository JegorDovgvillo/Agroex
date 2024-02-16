import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';

import { createUser } from '@thunks/fetchUsers';
import { toggleModal } from '@slices/modalSlice';
import { selectModalState } from '@slices/modalSlice';

import { createUserValidationSchema } from '@helpers/validationSchemes/userDataValidationSchemes';

import CustomTextField from '@customTextField';
import { CustomButton } from '@buttons/CustomButton';

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
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={styles.wrapp}>
          <h2 className={styles.title}>Create new user</h2>
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
                  name="email"
                  placeholder="Email"
                  type="email"
                  value={values.email}
                  errors={errors.email}
                  touched={touched.email}
                />
                <CustomTextField
                  name="phoneNumber"
                  placeholder="Phone number"
                  label="Phone number"
                  id="phoneNumber"
                  type="tel"
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
                  text="Create"
                  width="210px"
                  typeOfButton="submit"
                  disabled={!isValid}
                />
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalForCreatingUser;
