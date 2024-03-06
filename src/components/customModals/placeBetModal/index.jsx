import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import _ from 'lodash';

import Button from '@mui/material/Button';
import { Dialog, Box, InputAdornment, FormHelperText } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import CustomTextField from '@customTextField';
import { CustomButton } from '@buttons/CustomButton';
import { CloseButton } from '@buttons/CloseButton';

import { CURRENCY } from '@helpers/currency.jsx';
import getNumberWithCurrency from '@helpers/getNumberWithCurrency.js';

import { toggleModal, selectModalState } from '@slices/modalSlice';

import styles from './placeBetModal.module.scss';

const { headerForm } = styles;

const PlaceBetModal = ({ lot, setNewBet, setSelectedLot }) => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) =>
    selectModalState(state, 'placeBetModal')
  );
  const userCurrency = 'USD'; //todo select currency from store
  const currency = _.find(CURRENCY, { key: userCurrency });

  const handleClose = (event) => {
    event.stopPropagation();
    setSelectedLot(null);
    dispatch(toggleModal('placeBetModal'));
  };

  const handleBetClick = (values) => {
    //event.stopPropagation();
    const valueToSubmit = { ...values };
    valueToSubmit.userId = lot.userId;
    valueToSubmit.lotId = lot.id;
    setNewBet(valueToSubmit);
    dispatch(setConfirmModalText('Do you confirm the request?'));
    dispatch(setConfirmModalAction('placeBet'));

    //todo clear a form
    dispatch(toggleModal('placeBetModal'));
    dispatch(toggleModal('confirmModal'));
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      //aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <Box>
          <div className={headerForm}>
            <h4>Place a bet</h4>
            <CloseButton size="M" type="clear" handleClick={handleClose} />
          </div>

          <Formik
            initialValues={{ amount: lot.bet || '' }}
            onSubmit={handleBetClick}
            //validationSchema={createUserValidationSchema}
          >
            {({ values, errors, touched, isValid }) => (
              <Form>
                <CustomTextField
                  name="quantity"
                  disabled={true}
                  label="Quantity"
                  id="quantity"
                  value={lot.quantity}
                  inputProps={{
                    startAdornment: (
                      <InputAdornment position="start">Ton</InputAdornment>
                    ),
                  }}
                />
                <CustomTextField
                  label="Total amount"
                  id="amount"
                  name="amount"
                  placeholder="Enter your bet here"
                  value={values.amount}
                  type="number"
                  errors={errors.amount}
                  touched={touched.amount}
                  inputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {currency.symbol}
                      </InputAdornment>
                    ),
                  }}
                />
                <FormHelperText id="outlined-weight-helper-text">
                  {`${getNumberWithCurrency(
                    values.amount / lot.quantity,
                    userCurrency
                  )}/ton`}
                </FormHelperText>
                <CustomButton
                  text="Bet"
                  typeOfButton="submit"
                  disabled={!isValid}
                />
              </Form>
            )}
          </Formik>
        </Box>
      </DialogContent>
      {/* <DialogActions>
        <Button onClick={handleBetClick} variant="contained" autoFocus>
          Bet
        </Button>
      </DialogActions> */}
    </Dialog>
  );
};

export default PlaceBetModal;
