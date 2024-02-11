import TextField from '@mui/material/TextField';
import { Field } from 'formik';

import styles from './customTextField.module.scss';

const CustomTextField = ({
  label = '',
  id,
  type = '',
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
        placeholder={placeholder}
        multiline={multiline}
        rows={rows}
        required={required}
        className={`${styles.input} ${styles[type]}`}
      />
    </div>
  );
};

export default CustomTextField;
