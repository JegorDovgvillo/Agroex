import { Select, MenuItem } from '@mui/material';
import { Field } from 'formik';

import styles from '@customTextField/customTextField.module.scss';

const CustomSelect = ({
  margin = '0 0 24px 0',
  units,
  name,
  width,
  disabled = true,
  placeholder,
  required = true,
  itemFieldName,
  label = '',
}) => {
  return (
    <div className={styles.wrapp}>
      <label htmlFor={name}>{label}</label>
      <Field
        as={Select}
        name={name}
        displayEmpty
        sx={{ m: { margin }, width: { width } }}
        disabled={disabled}
        required={required}
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
