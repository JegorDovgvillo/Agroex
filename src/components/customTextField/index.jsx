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
  required = false,
  value = '',
  errors,
  touched,
}) => {
  //console.log('errors', errors, 'touched', touched);
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
        value={value}
        required={required}
        className={`${styles.input} ${styles[type]} ${
          errors && touched && styles.error
        }`}
        error={errors && touched}
        helperText={errors && touched ? errors : null}
      />
    </div>
  );
};

export default CustomTextField;
