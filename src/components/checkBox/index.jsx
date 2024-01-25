import Checkbox from '@mui/material/Checkbox';
import iconChecked from '../../assets/icons/Checkbox_fill.svg';
import uncheckedIcon from '../../assets/icons/Checkbox_empty.svg';
import indeterminateIcon from '../../assets/icons/Checkbox_int.svg';
import disabledIcon from '../../assets/icons/Checkbox_disabled.svg';

const CheckBoxIcon = () => {
  return <img src={iconChecked} alt="Checkbox icon" />;
};

const CheckBoxOutlineBlankIcon = () => {
  return <img src={uncheckedIcon} alt="Unchecked checkbox icon" />;
};

const IndeterminateCheckBoxIcon = () => {
  return <img src={indeterminateIcon} alt="Indeterminate checkbox icon" />;
};

const DisabledCheckBoxIcon = () => {
  return <img src={disabledIcon} alt="Disabled checkbox icon" />;
};

export const CheckBoxInput = ({ disabled = false, checked = false }) => {
  return (
    <Checkbox
      checkedIcon={<CheckBoxIcon />}
      icon={
        (disabled && <DisabledCheckBoxIcon />) || <CheckBoxOutlineBlankIcon />
      }
      indeterminateIcon={<IndeterminateCheckBoxIcon />}
      disabled={disabled}
      defaultChecked={checked}
      sx={{
        width: '24px',
        height: '24px',
      }}
    />
  );
};
