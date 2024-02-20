import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from '@mui/material';
import { Field } from 'formik';

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
  const isError = !!errors && !!touched;

  return (
    <div className={styles.wrapp}>
      <label htmlFor={id}>{label}</label>
      <Autocomplete
        freeSolo
        id={id}
        disableClearable
        options={options.map((option) => option.title)}
        value={value}
        name={name}
        onChange={(event, newValue) => {
          setFieldValue(name, newValue);
        }}
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
