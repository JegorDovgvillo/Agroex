import { TextField } from '@mui/material';
import { Field } from 'formik';

import styles from './customTextField.module.scss';

const CustomTextField = ({
  label = '',
  id,
  fieldType = '',
  placeholder = '',
  name,
  multiline = null,
  required = false,
  disabled = false,
  value = '',
  errors,
  touched,
  rows = null,
  type = '',
  inputProps = {},
}) => {
  const isError = !!errors && !!touched;

  return (
    <div className={styles.wrapp}>
      <label htmlFor={id}>{label}</label>
      <Field
        as={TextField}
        type={type}
        name={name}
        id={id}
        disabled={disabled}
        placeholder={placeholder}
        multiline={multiline}
        rows={rows}
        value={value}
        required={required}
        className={`${styles.input} ${styles[type]} ${
          isError && styles.error
        } ${styles[fieldType]}`}
        error={isError}
        helperText={isError ? errors : null}
        InputProps={inputProps}
      />
    </div>
  );
};

export default CustomTextField;
