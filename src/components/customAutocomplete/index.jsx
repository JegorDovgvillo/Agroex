import { useDispatch } from 'react-redux';

import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from '@mui/material';
import { Field } from 'formik';

import { deleteError } from '@slices/lotListSlice';

import styles from '../customTextField/customTextField.module.scss';

const CustomAutocompleteField = ({
  label = '',
  id,
  fieldType = '',
  placeholder = '',
  name,
  multiline = null,
  required = false,
  value = '',
  errors,
  touched,
  rows = null,
  type = '',
  options,
  setFieldValue,
}) => {
  const dispatch = useDispatch();
  const isError = !!errors && !!touched;

  const handleChange = (newValue) => {
    setFieldValue(name, newValue);

    if (errors && name === 'subcategory') {
      dispatch(deleteError('subcategory'));
    }

    errors && dispatch(deleteError(name));
  };

  return (
    <div className={styles.wrappAutocomplete}>
      <label htmlFor={id}>{label}</label>
      <Autocomplete
        freeSolo
        id={id}
        disableClearable
        options={options.map((option) => option.title)}
        value={value}
        name={name}
        onChange={(event, newValue) => handleChange(newValue)}
        renderInput={(params) => (
          <Field
            as={TextField}
            {...params}
            label=""
            value={value}
            InputProps={{
              ...params.InputProps,
              type: 'search',
            }}
            className={`${styles.input} ${styles[type]} ${
              isError && styles.error
            } ${styles[fieldType]}`}
            placeholder={placeholder}
            multiline={multiline}
            rows={rows}
            required={required}
            error={isError}
            helperText={isError ? errors : null}
          />
        )}
      />
    </div>
  );
};

export default CustomAutocompleteField;
