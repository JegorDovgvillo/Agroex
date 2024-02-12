import { Select, MenuItem } from '@mui/material';
import { Field } from 'formik';

import styles from '@customTextField/customTextField.module.scss';

const CustomSelect = ({
  units,
  name,
  disabled = false,
  placeholder,
  required = true,
  itemFieldName,
  label = '',
  value,
}) => {
  return (
    <div className={styles.wrapp}>
      <label htmlFor={name}>{label}</label>
      <Field
        as={Select}
        name={name}
        displayEmpty
        disabled={disabled}
        required={required}
        className={styles.select}
        value={value || ''}
      >
        <MenuItem disabled value="">
          <em>{placeholder}</em>
        </MenuItem>
        {units.map((item, index) => (
          <MenuItem key={index} value={item.id || item}>
            {item[itemFieldName] || item}
          </MenuItem>
        ))}
      </Field>
    </div>
  );
};

export default CustomSelect;
