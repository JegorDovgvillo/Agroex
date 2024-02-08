import Chip from '@mui/material/Chip';

import varibles from '@scss/colorVariables.module.scss';

const {
  warningExtraLight,
  successExtraLight,
  errorExtraLight,
  systemExtraLight,
  grayLight2,
} = varibles;

const getBackgroundColor = (type) => {
  switch (type) {
    case 'warning':
      return warningExtraLight;
    case 'error':
      return errorExtraLight;
    case 'info':
      return systemExtraLight;
    case 'success':
      return successExtraLight;
    default:
      return grayLight2;
  }
};

const CustomBadge = ({ type, size, icon, label }) => {
  const bgColor = getBackgroundColor(type);

  return (
    <Chip
      size={size}
      label={label}
      icon={icon}
      color={type}
      sx={{ backgroundColor: bgColor }}
      variant="outlined"
    />
  );
};

export default CustomBadge;
