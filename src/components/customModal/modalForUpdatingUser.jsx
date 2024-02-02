import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';

import { updateUser } from '@store/thunks/fetchUsers';
import { closeUpdatingModal } from '@store/slices/modalSlice';

const ModalForUpdatingUser = ({
  title,
  style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  },
}) => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modal.updatingModalIsOpen);
  const userId = useSelector((state) => state.usersList.userId);

  const userData = {
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
  };

  const handleSubmitClick = (values) => {
    dispatch(updateUser({ userId, values }));
  };

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={() => {
          dispatch(closeUpdatingModal());
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
              <Field
                type="text"
                name="username"
                placeholder="username"
                required
              />
              <Field type="text" name="email" placeholder="email" required />
              <Field
                type="tel"
                name="phoneNumber"
                placeholder="tel "
                required
              />
              <Field
                type="password"
                name="password"
                placeholder="password"
                required
              />
              <button type="submit">Submit</button>
            </Form>
          </Formik>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalForUpdatingUser;
