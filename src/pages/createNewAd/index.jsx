import { useEffect, useState } from "react";
import CustomTextField from "@components/customTextField";
import { CustomButton } from "@components/buttons/CustomButton";
import styles from "./createNewAd.module.scss";
import CustomSelect from "@components/customSelect";
import { Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import { fetchUsers } from "../../store/thunks/fetchUsers";
import { useSelector } from "react-redux";
import { usersSelector } from "../../store/slices/usersSlice";
import CustomRange from "../../components/customRange";

const CreateNewAd = () => {
  const dispatch = useDispatch();
  const users = useSelector(usersSelector);
  useEffect(() => {
    dispatch(fetchUsers());
  }, []);


  return (
    <Formik
      initialValues={{
        user: "",
        title: "",
        country: "",
        city: "",
        category: "",
        subcategory: "",
        variety: "",
        size: '',
        pacaging: "",
        quantity: "",
        price: "",
        priceUnits: "",
        quantityUnits: "",
        description: "",
        lotType: "",
        sizeUnits: "",
      }}
      onSubmit={async (values, { resetForm }) => {
        const obj = {
          title: values.title,
          description: values.description,
          variety: values.variety,
          size: values.size,
          packaging: values.pacaging,
          quantity: values.quantity,
          pricePerTon: (values.price / values.quantity).toFixed(2),
          currency: values.priceUnits,
          expirationDate: "2024-01-29T13:59:36.139962600Z",
          productCategory: {
            title: values.subcategory,
          },
          lotType: values.lotType,
          user: values.user,
          location: {
            country: values.country,
            region: values.city,
          },
        };
        const request = await fetch("http://localhost:8080/lots", {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify(obj),
        });
        resetForm();
      }}
    >
      <Form>
        <CustomSelect
          units={users.map((item) => item)}
          name="user"
          width={"660px"}
          disabled={false}
        />

        <CustomTextField
          label={"Title"}
          id={"title"}
          width={"660px"}
          placeholder={"Enter the title"}
          name={"title"}
        />
        <CustomTextField
          label={"Description"}
          id={"description"}
          width={"660px"}
          placeholder={"Enter the description"}
          name={"description"}
        />
        <div className={styles.inputBlock}>
          <CustomTextField
            label={"Location"}
            id={"country"}
            placeholder={"Enter the country"}
            name={"country"}
          />
          <CustomTextField
            id={"city"}
            placeholder={"Enter the city"}
            name={"city"}
          />
        </div>
        <div className={styles.inputBlock}>
          <CustomTextField
            label={"Category"}
            id={"category"}
            placeholder={"Enter the category"}
            name={"category"}
          />
          <CustomTextField
            id={"subcategory"}
            placeholder={"Enter the subcategory"}
            name={"subcategory"}
          />
        </div>
        <div className={styles.inputBlock}>
          <CustomTextField
            label={"Variety"}
            id={"variety"}
            placeholder={"Enter the variety"}
            name={"variety"}
          />
          <CustomTextField
            label={"Lot type"}
            id={"lotType"}
            placeholder={"Enter the lot type"}
            name={"lotType"}
          />
        </div>

        <CustomRange name={"size"} label={"Size"} id={"size"}/>
        <CustomTextField
          label={"Pacaging"}
          id={"pacaging"}
          placeholder={"Enter the pacaging"}
          name={"pacaging"}
        />
        <div className={styles.inputBlock}>
          <CustomTextField
            label={"Quantity"}
            id={"quantity"}
            placeholder={"Enter the quantity"}
            name={"quantity"}
          />
          <CustomSelect
            units={["ton"]}
            name="quantityUnits"
            width={"90px"}
            disabled={false}
          />
        </div>
        <div className={styles.inputBlock}>
          <CustomTextField
            label={"Price"}
            id={"price"}
            name={"price"}
            placeholder={"Enter the price"}
          />
          <CustomSelect
            units={["USD"]}
            name="priceUnits"
            width={"90px"}
            disabled={false}
          />
        </div>
        <CustomButton
          text={"Place an advertisment"}
          width={"auto"}
          type={"submit"}
        />
      </Form>
    </Formik>
  );
};

export default CreateNewAd;
