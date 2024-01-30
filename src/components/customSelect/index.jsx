import { Select, MenuItem } from "@mui/material";

const CustomSelect = ({margin='0 0 24px 0',units}) => {
  return (
    <Select
      value=''
      // onChange={handleChange}
      disabled
      displayEmpty
      inputProps={{ "aria-label": "Without label" }}
      sx={{m:{margin}}}
    >
      <MenuItem value="">
        <em>{units}</em>
      </MenuItem>
    </Select>
  );
};

export default CustomSelect;
