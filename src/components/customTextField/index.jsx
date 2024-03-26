import { useDispatch } from 'react-redux';
import { TextField } from '@mui/material';
import { Field } from 'formik';

import { includes } from 'lodash';

import { deleteError } from '@slices/lotListSlice';

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
  helperText = null,
  setFieldValue,
}) => {
  const dispatch = useDispatch();

  const isError = !!errors && !!touched;

  const handleChange = (e) => {
    setFieldValue(name, e.target.value);

    if (includes(['days', 'hours', 'minutes'], name)) {
      dispatch(deleteError('duration'));
      return;
    }

    errors && dispatch(deleteError(name));
  };

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
        helperText={isError ? errors : helperText}
        InputProps={inputProps}
        onChange={handleChange}
      />
    </div>
  );
};

export default CustomTextField;
