import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import AddIcon from '@mui/icons-material/Add';

import { fetchAllCategories } from '@thunks/fetchCategories';
import { categoriesSelector } from '@slices/categoriesSlice';
import {
  selectModal,
  toggleModal,
  clearModalsFields,
  setModalFields,
} from '@slices/modalSlice';
import { setCategoryId } from '@slices/categoriesSlice';
import { deleteCategory } from '@thunks/fetchCategories';

import ModalForCreatingCategory from '@customModals/modalForCreatingCategory';
import ModalForUpdatingCategory from '@customModals/modalForUpdaitingCategory';

import { getSnackbarMessages } from '@helpers/getSnackbarMessages';

import styles from '../usersList/usersList.module.scss';

const { successCategoryDelete } = getSnackbarMessages();
const {
  tableRow,
  userName,
  editIcon,
  deleteIcon,
  editBlock,
  titleWrapp,
  title,
} = styles;

export default function CategoriesList() {
  const dispatch = useDispatch();
  const categories = useSelector(categoriesSelector);
  const categoryId = useSelector((state) => state.categories.categoryId);
  const confirmModalData = useSelector((state) =>
    selectModal(state, 'confirmModal')
  );
  const { loading, errors } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const handleEditClick = (id) => {
    dispatch(toggleModal('updatingModal'));
    dispatch(setCategoryId(id));
  };

  const showConfirm = (id) => {
    dispatch(
      setModalFields({
        modalId: 'confirmModal',
        text: 'This action delete the category. Do you confirm the action?',
      })
    );
    dispatch(toggleModal('confirmModal'));
    dispatch(setCategoryId(id));
  };

  const handleDeleteCategory = async (categoryId) => {
    await dispatch(deleteCategory({ id: categoryId }));

    if (!loading && !errors) {
      dispatch(
        setModalFields({
          modalId: 'snackbar',
          message: successCategoryDelete,
          severity: 'success',
          isOpen: true,
        })
      );
    }
  };

  useEffect(() => {
    const { confirmStatus, isOpen } = confirmModalData;

    if (!confirmStatus || isOpen) return;

    dispatch(clearModalsFields('confirmModal'));

    handleDeleteCategory(categoryId);
  }, [confirmModalData, categoryId, dispatch]);

  return (
    <>
      <div className={titleWrapp}>
        <Typography component="h2" variant="h6" color="primary">
          Categories
        </Typography>
        <div
          className={title}
          onClick={() => dispatch(toggleModal('creatingModal'))}
        >
          <Typography component="h2" variant="h6" color="primary">
            Create new category
          </Typography>
          <AddIcon />
        </div>
      </div>
      <Table size="small">
        <TableHead>
          <TableRow className={tableRow}>
            <TableCell>ID</TableCell>
            <TableCell>Category name</TableCell>
            <TableCell>Parent ID</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories &&
            categories.map((category) => (
              <TableRow key={category.id} className={tableRow}>
                <TableCell>{category.id}</TableCell>
                <TableCell>
                  <span
                    className={userName}
                    onClick={() => handleEditClick(category.id)}
                  >
                    {category.title}
                  </span>
                </TableCell>
                <TableCell>{category.parentId}</TableCell>
                <TableCell>
                  <div className={editBlock}>
                    <DeleteForeverOutlinedIcon
                      className={deleteIcon}
                      onClick={() => showConfirm(category.id)}
                    />
                    <BorderColorIcon
                      className={editIcon}
                      onClick={() => handleEditClick(category.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <ModalForCreatingCategory />
      <ModalForUpdatingCategory />
    </>
  );
}
