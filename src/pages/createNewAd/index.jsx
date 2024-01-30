import { useState } from "react";
import CustomTextField from "@components/customTextField";
import { CustomButton } from "@components/buttons/CustomButton";
import Slider from "@mui/material/Slider";
import styles from "./createNewAd.module.scss";
import CustomSelect from "@components/customSelect";
import { Form, Formik } from "formik";
const CreateNewAd = () => {
  const [value, setValue] = useState([0, 10]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const valuetext = (value) => {
    return `${value}°C`;
  };
  return (
    <Formik
      initialValues={{
        title: "",
        country: "",
        city: "",
        category: "",
        subcategory: "",
        variety: "",
        size: "",
        pacaging: "",
        quantity: "",
        price: "",
      }}
      onSubmit={async (values) => {
        // const request = await fetch("http://localhost:8080/lots", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json;charset=utf-8",
        //   },
        //   body: JSON.stringify(values),
        // });
        console.log(values);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        /* and other goodies */
      }) => (
        <Form>
          <CustomTextField
            label={"Title"}
            id={"title"}
            width={"660px"}
            placeholder={"Enter the title"}
            type={"title"}
          />
          <div className={styles.inputBlock}>
            <CustomTextField
              label={"Location"}
              id={"country"}
              placeholder={"Enter the country"}
            />
            <CustomTextField id={"city"} placeholder={"Enter the city"} />
          </div>
          <div className={styles.inputBlock}>
            <CustomTextField
              label={"Category"}
              id={"category"}
              placeholder={"Enter the category"}
            />
            <CustomTextField
              id={"subcategory"}
              placeholder={"Enter the subcategory"}
            />
          </div>
          <CustomTextField
            label={"Variety"}
            id={"variety"}
            placeholder={"Enter the variety"}
          />
          <div className={styles.sliderWrapp}>
            <label htmlFor="size">Size</label>
            <Slider
              id="size"
              getAriaLabel={() => "Temperature range"}
              value={value}
              onChange={handleChange}
              valueLabelDisplay="auto"
              getAriaValueText={valuetext}
              sx={{ m: "8px 0 16px", width: "322px" }}
              step={5}
            />
            <div className={styles.sliderValueBlock}>
              <CustomTextField
                width={"162.5px"}
                margin={"0 0 24px 0"}
                placeholder={"From"}
              />
              <CustomTextField
                width={"162.5px"}
                margin={"0 16px 24px -2px"}
                placeholder={"To"}
              />
              <CustomSelect units={"mm"} />
            </div>
          </div>
          <CustomTextField
            label={"Pacaging"}
            id={"pacaging"}
            placeholder={"Enter the pacaging"}
          />
          <div className={styles.inputBlock}>
            <CustomTextField
              label={"Quantity"}
              id={"quantity"}
              placeholder={"Enter the quantity"}
            />
            <CustomSelect units={"ton"} />
          </div>
          <div className={styles.inputBlock}>
            <CustomTextField
              label={"Price"}
              id={"price"}
              placeholder={"Enter the price"}
            />
            <CustomSelect units={"USD"} />
          </div>
          <CustomButton
            text={"Place an advertisment"}
            width={"auto"}
            type={"submit"}
          />
        </Form>
      )}
    </Formik>
  );
};

export default CreateNewAd;
