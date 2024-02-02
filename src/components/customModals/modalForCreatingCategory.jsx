import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';

import { closeCreatingModal } from '@store/slices/modalSlice';

import CustomTextField from '../customTextField';
import { CustomButton } from '../buttons/CustomButton';
import { createCategory } from '../../store/thunks/fetchCategories';

const ModalForCreatingCategory = ({
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
    category: '',
    parentId: 0,
  };

  const handleSubmitClick = (values) => {
    dispatch(createCategory(values));
    // dispatch(closeCreatingModal());
  };

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={() => {
          // dispatch(closeCreatingModal());
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
                name="category"
                placeholder="Enter the category"
                required
                label="Category name"
                id="category"
              />
              <CustomButton text="Create" width="210px" typeOfButton="submit" />
            </Form>
          </Formik>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalForCreatingCategory;