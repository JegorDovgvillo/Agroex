import { Select, MenuItem, FormHelperText, FormControl } from '@mui/material';
import { Field } from 'formik';

import styles from '@customTextField/customTextField.module.scss';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const CustomSelect = ({
  units,
  name,
  disabled = false,
  placeholder,
  required = false,
  itemFieldName,
  label = '',
  value,
  errors,
  touched,
  fieldType = '',
  wrappType = '',
  handleChange = null,
  setFieldValue,
}) => {
  const handleSelectChange = (e) => {
    setFieldValue(name, e.target.value);
    handleChange && handleChange(e.target.value);
  };

  return (
    <div className={`${styles.wrapp} ${styles[wrappType]}`}>
      <FormControl error={errors && touched} className={styles[fieldType]}>
        <label htmlFor={name}>{label}</label>
        <Field
          as={Select}
          name={name}
          displayEmpty
          disabled={disabled}
          required={required}
          className={`${styles.select} ${errors && touched && styles.error} ${
            styles[fieldType]
          }`}
          value={value || ''}
          onChange={handleSelectChange}
          MenuProps={MenuProps}
        >
          <MenuItem disabled value="">
            <em>{placeholder}</em>
          </MenuItem>
          {units.map((item, index) => (
            <MenuItem
              key={index}
              value={item.id || item}
              sx={{ height: '60px' }}
            >
              {item[itemFieldName] || item}
            </MenuItem>
          ))}
        </Field>
        {touched && <FormHelperText>{errors}</FormHelperText>}
      </FormControl>
    </div>
  );
};

export default CustomSelect;
