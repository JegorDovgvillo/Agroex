import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { Formik, Form } from 'formik';

import { InputAdornment, FormHelperText } from '@mui/material';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';

import CustomTextField from '@customTextField';
import { CustomButton } from '@buttons/CustomButton';

import { placeBetValidationSchema } from '@helpers/validationSchemes/placeBetValidationSchema';
import { CURRENCY } from '@helpers/currency.jsx';
import getNumberWithCurrency from '@helpers/getNumberWithCurrency.js';

import { toggleModal, setModalFields } from '@slices/modalSlice';

import styles from './placeBetForm.module.scss';
import { setNewBet } from '@store/slices/betsSlice';

const { formContainer, helperText, inputAdornment, inputAdornmentError } =
  styles;

export const PlaceBetForm = ({ lot, type }) => {
  const dispatch = useDispatch();
  const isModal = type === 'modal';
  const [isFirstSubmit, setIsFirstSubmit] = useState(true);
  const userInfo = useSelector((state) => state.usersList.userInfo);

  const currency = _.find(CURRENCY, { key: lot.originalCurrency });
  const [lastBet, setLastBet] = useState(lot.lastBet?.amount);

  const [minAmount, setMinAmount] = useState(
    lastBet ? _.toNumber(lastBet) + 1 : _.toNumber(lot.originalMinPrice) + 1
  );

  const maxAmount = lot.originalPrice;
  const minAmountWithCurrency = getNumberWithCurrency(minAmount, currency.key);
  const maxAmountWithCurrency = getNumberWithCurrency(maxAmount, currency.key);
  const amountHelperText = `From ${minAmountWithCurrency} to ${maxAmountWithCurrency}`;
  const { errors, loadingStatus } = useSelector((state) => state.bets);
  const [resetFormFunc, setResetFormFunc] = useState(null);

  const handleBetBtnClick = () => {
    isFirstSubmit && setIsFirstSubmit(false);
  };

  const handleSubmit = (values, { resetForm }) => {
    const valueToSubmit = { ...values };
    valueToSubmit.userId = userInfo.id;
    valueToSubmit.lotId = lot.id;

    dispatch(
      setModalFields({
        modalId: 'confirmModal',
        text: 'Do you confirm the bid request?',
        action: 'placeBet',
      })
    );
    dispatch(setNewBet(valueToSubmit));

    isModal && dispatch(toggleModal('placeBetModal'));
    dispatch(toggleModal('confirmModal'));

    setResetFormFunc(() => resetForm);
    setLastBet(values.amount);
  };

  const getValidationSchema = () =>
    placeBetValidationSchema(minAmount, maxAmount, currency.key);

  const formatAmountPerTon = (amount) => {
    if (!amount || !lot.quantity) {
      return '';
    }

    return `${getNumberWithCurrency(amount / lot.quantity, currency.key)}/ton`;
  };

  useEffect(() => {
    if (loadingStatus === false && !errors && lastBet) {
      resetFormFunc && resetFormFunc();
      setMinAmount(_.toNumber(lastBet) + 1);
    }
  }, [loadingStatus, errors, lastBet]);

  return (
    <Formik
      initialValues={{
        amount: '',
      }}
      onSubmit={handleSubmit}
      validationSchema={getValidationSchema}
    >
      {({ values, errors, touched, isValid, setFieldValue }) => (
        <Form className={formContainer}>
          {isModal && (
            <CustomTextField
              name="quantity"
              disabled={true}
              label="Quantity"
              id="quantity"
              value={lot.quantity}
              fieldType="betInput"
              inputProps={{
                startAdornment: (
                  <InputAdornment position="start">Ton</InputAdornment>
                ),
              }}
              setFieldValue={setFieldValue}
            />
          )}
          <CustomTextField
            label={isModal ? 'Total amount' : ''}
            id="amount"
            name="amount"
            fieldType="betInput"
            placeholder="Enter your bet here"
            value={values.amount}
            type="number"
            helperText={amountHelperText}
            errors={errors.amount}
            touched={touched.amount}
            inputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                  className={
                    errors.amount && touched.amount
                      ? inputAdornmentError
                      : inputAdornment
                  }
                >
                  {currency.symbol}
                </InputAdornment>
              ),
            }}
            setFieldValue={setFieldValue}
          />

          <FormHelperText
            id="outlined-weight-helper-text"
            className={helperText}
          >
            {formatAmountPerTon(values.amount)}
          </FormHelperText>

          {isModal ? (
            <CustomButton
              text="Bet"
              typeOfButton="submit"
              handleClick={handleBetBtnClick}
              disabled={!isFirstSubmit && !isValid}
            />
          ) : (
            <CustomButton
              text="My bet"
              icon={<GavelOutlinedIcon />}
              handleClick={handleBetBtnClick}
              typeOfButton="submit"
              disabled={!isFirstSubmit && !isValid}
              type="secondary"
              width="100%"
            />
          )}
        </Form>
      )}
    </Formik>
  );
};
