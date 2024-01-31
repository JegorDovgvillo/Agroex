import { Select, MenuItem } from "@mui/material";
import { Field } from "formik";
import { useState } from "react";
const CustomSelect = ({
  margin = "0 0 24px 0",
  units,
  name,
  width,
  disabled = true,
}) => {
  return (
    <Field
      as={Select}
      name={name}
      displayEmpty
      inputProps={{ "aria-label": "Without label" }}
      sx={{ m: { margin }, width: { width } }}
      disabled={disabled}
    >
      {units.map((item, index) => {
        const value = typeof item === 'object' ? item : item;
        return (
          <MenuItem key={index} value={value}>
            {typeof item === 'object' ? item.username : item}
          </MenuItem>
        );
      })}
    </Field>
  );
};

export default CustomSelect;
