import TextField from "@mui/material/TextField";
import styles from "./customTextField.module.scss";
import { Field } from "formik";

const CustomTextField = ({
  label = "",
  id,
  width = "322px",
  margin = "0 16px 24px 0",
  placeholder = "",
  name,
}) => {
  
  return (
    <div className={styles.wrapp}>
      <label htmlFor={id}>{label}</label>
      <Field
        as={TextField}
        name={name}
        id={id}
        sx={{ m: margin, width: { width } }}
        placeholder={placeholder}
      />
    </div>
  );
};

export default CustomTextField;
