import TextField from '@mui/material/TextField';
import { Field } from 'formik';

import styles from './customTextField.module.scss';

const CustomTextField = ({
  label = '',
  id,
  width = '210px',
  margin = '0 16px 24px 0',
  placeholder = '',
  name,
  multiline = null,
  rows,
  required = true,
}) => {
  return (
    <div className={styles.wrapp}>
      <label htmlFor={id}>{label}</label>
      <Field
        as={TextField}
        name={name}
        id={id}
        sx={{ m: margin, width: { width } }}
        placeholder={placeholder}
        multiline={multiline}
        rows={rows}
        required={required}
      />
    </div>
  );
};

export default CustomTextField;
