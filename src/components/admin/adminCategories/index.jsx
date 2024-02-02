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

import styles from '../usersList/usersList.module.scss';
import { deleteCategory } from '../../../store/thunks/fetchCategories';

const { tableRow, userName, editIcon, deleteIcon, editBlock } = styles;

export default function CategoriesList() {
  const dispatch = useDispatch();
  const categories = useSelector(categoriesSelector);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleEditClick = (id) => {};

  const handleDeleteClick = (id) => {
    dispatch(deleteCategory(id));
  };

  return (
    <>
      <div className={styles.titleWrapp}>
        <Typography component='h2' variant='h6' color='primary'>
          Categories
        </Typography>
        <div className={styles.title}>
          <div onClick={() => dispatch(toggleModal('creatingCategoryModal'))}>
            <Typography component='h2' variant='h6' color='primary'>
              Create new category
            </Typography>
            <AddIcon />
          </div>
          <div onClick={() => dispatch(toggleModal('creatingCategoryModal'))}>
            <Typography component='h2' variant='h6' color='primary'>
              Create new subcategory
            </Typography>
            <AddIcon />
          </div>
        </div>
      </div>
      <Table size='small'>
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
            categories.map((c) => (
              <TableRow key={c.id} className={tableRow}>
                <TableCell>{c.id}</TableCell>
                <TableCell>
                  <span className={userName} onClick={handleEditClick}>
                    {c.title}
                  </span>
                </TableCell>
                <TableCell>{c.parentId}</TableCell>
                <TableCell>
                  <div className={editBlock}>
                    <DeleteForeverOutlinedIcon
                      className={deleteIcon}
                      onClick={() => handleDeleteClick(c.id)}
                    />
                    <BorderColorIcon
                      className={editIcon}
                      onClick={() => handleEditClick(c.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
}
