import { Select, MenuItem } from '@mui/material';
import { Field } from 'formik';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

import styles from '@customTextField/customTextField.module.scss';

const ITEM_HEIGHT = 68;
const ITEM_PADDING_TOP = 18;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const CustomMultiSelect = ({
  units,
  name,
  disabled = false,
  placeholder,
  required = true,
  itemFieldName,
  label = '',
  fieldType = '',
  wrappType = '',
  onChange,
}) => {
  return (
    <div className={`${styles.wrapp} ${styles[wrappType]}`}>
      <FormControl>
        <label htmlFor={name}>{label}</label>
        <Field
          as={Select}
          name={name}
          disabled={disabled}
          required={required}
          displayEmpty
          className={`${styles.select} ${styles[fieldType]}`}
          MenuProps={MenuProps}
          multiple={true}
          onChange={onChange}
        >
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
      </FormControl>
    </div>
  );
};

export default CustomMultiSelect;
