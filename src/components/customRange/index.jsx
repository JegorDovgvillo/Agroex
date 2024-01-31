import { TextField } from "@mui/material";
import { Field } from "formik";
import { Slider } from "@mui/material";
import styles from "./customRange.module.scss";
import CustomSelect from "../customSelect";
import { useState } from "react";
import { useFormikContext } from "formik";
const CustomRange = ({ name, label, id }) => {
  const [value, setValue] = useState([0, 10]);
  const { setFieldValue } = useFormikContext();
  const handleChange = (event, newValue) => {
    setValue(newValue);
    setFieldValue("size", newValue);
  };

  return (
    <div className={styles.sliderWrapp}>
      <label htmlFor={name}>{label}</label>
      <Field
        as={Slider}
        id={id}
        name={name}
        value={value}
        // getAriaLabel={() => "Temperature range"}
        valueLabelDisplay="auto"
        sx={{ m: "8px 0 16px", width: "322px" }}
        step={5}
        onChange={handleChange}
      />
      <div className={styles.sliderValueBlock}>
        <Field
          as={TextField}
          width={"162.5px"}
          sx={{ margin: "0 0 24px 0", width: "162.5px" }}
          placeholder={"From"}
          name={"From"}
          onChange={(event) => {
            const newValue = isNaN(parseInt(event.target.value))
              ? value[0]
              : parseInt(event.target.value);
            handleChange(event, [newValue, value[1]]);
          }}
        />
        <Field
          as={TextField}
          width={"162.5px"}
          sx={{ margin: "0 16px 24px -2px", width: "162.5px" }}
          placeholder={"To"}
          name={"To"}
          onChange={(event) => {
            const newValue = isNaN(parseInt(event.target.value))
              ? value[1]
              : parseInt(event.target.value);
            handleChange(event, [value[0], newValue]);
          }}
        />
        <CustomSelect
          units={["mm"]}
          width={"90px"}
          disabled={false}
          name={"sizeUnits"}
        />
      </div>
    </div>
  );
};
export default CustomRange;
