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

import { fetchCategories } from '@store/thunks/fetchCategories';
import { categoriesSelector } from '@store/slices/categoriesSlice';
import { toggleModal } from '@store/slices/modalSlice';
import { setCategoryId } from '@store/slices/categoriesSlice';
import { deleteCategory } from '@store/thunks/fetchCategories';

import styles from '../usersList/usersList.module.scss';
import ModalForCreatingCategory from '../../customModals/modalForCreatingCategory';
import ModalForUpdatingCategory from '../../customModals/modalForUpdaitingCategory';

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

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleEditClick = (id) => {
    dispatch(toggleModal('updatingModal'));
    dispatch(setCategoryId(id));
  };

  const handleDeleteClick = (id) => {
    dispatch(deleteCategory(id));
  };

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
                      onClick={() => handleDeleteClick(category.id)}
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
