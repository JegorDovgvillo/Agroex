import TextField from "@mui/material/TextField";
import styles from "./customTextField.module.scss";
const CustomTextField = ({ label = '', id, width='300px' }) => {
  return (
    <div className={styles.inputWrapp}>
      <label htmlFor={id}>{label}</label>
      <TextField id="title" sx={{ width: { width } }} />
    </div>
  );
};
export default CustomTextField;
