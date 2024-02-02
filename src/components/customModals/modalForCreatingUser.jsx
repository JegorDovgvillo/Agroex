import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';

import { createUser } from '@store/thunks/fetchUsers';
import { closeCreatingModal } from '@store/slices/modalSlice';

import CustomTextField from '../customTextField';
import { CustomButton } from '../buttons/CustomButton';

const ModalForCreatingUser = ({
  title,
  style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}) => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modal.creatingModalIsOpen);

  const userData = {
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
  };

  const handleSubmitClick = (values) => {
    dispatch(createUser(values));
    dispatch(closeCreatingModal());
  };

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={() => {
          dispatch(closeCreatingModal());
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2>{title}</h2>
          <Formik
            initialValues={userData}
            onSubmit={async (values) => {
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
              <CustomButton text="Create" width="210px" typeOfButton="submit" />
            </Form>
          </Formik>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalForCreatingUser;
