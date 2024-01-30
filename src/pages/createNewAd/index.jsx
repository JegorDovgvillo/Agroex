import { useState } from "react";
import CustomTextField from "../../components/customTextField";
import { CustomButton } from "@components/buttons/CustomButton";
import Slider from "@mui/material/Slider";
import styles from "./createNewAd.module.scss";

const CreateNewAd = () => {
  const [value, setValue] = useState([0, 10]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const valuetext = (value) => {
    return `${value}°C`;
  };
  return (
    <form>
      <CustomTextField label={"Title"} id={"title"} width={"660px"} />
      <div>
        <CustomTextField label={"Location"} id={"location"} />
        <CustomTextField id={"location"} />
      </div>
      <div>
        <CustomTextField label={"Category"} id={"category"} />
        <CustomTextField id={"category"} />
      </div>
      <CustomTextField label={"Variety"} id={"variety"} />
      <div>
        <label htmlFor="size">Size</label>
        <Slider
          id="size"
          getAriaLabel={() => "Temperature range"}
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          sx={{ width: "300px" }}
          step={5}
        />
      </div>
      <CustomTextField label={"Pacaging"} id={"pacaging"} />
      <CustomTextField label={"Quantity"} id={"quantity"} />
      <CustomTextField label={"Price"} id={"price"} />
      <CustomButton text={"Place an advertisment"} width={"auto"} />
    </form>
  );
};

export default CreateNewAd;
