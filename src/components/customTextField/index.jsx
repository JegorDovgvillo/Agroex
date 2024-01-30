import TextField from "@mui/material/TextField";
import styles from "./customTextField.module.scss";
const CustomTextField = ({
  label = "",
  id,
  width = "322px",
  margin = "0 16px 24px 0",
  placeholder = "",
  type,
}) => {
  return (
    <div className={styles.wrapp}>
      <label htmlFor={id}>{label}</label>
      <TextField
        type={type}
        id={id}
        sx={{ m: margin, width: { width } }}
        placeholder={placeholder}
      />
    </div>
  );
};
export default CustomTextField;
