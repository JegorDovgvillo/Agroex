import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import _ from 'lodash';

import { getFetchResultMessages } from '@helpers/getFetchResultMessages';

import { clearModalsFields, setModalFields } from '@slices/modalSlice';

import {
  changeLotStatusByUser,
  changeLotStatusByAdmin,
  deleteLot,
  createLot,
  updateLot,
} from '@thunks/fetchLots';

const {
  successLotCreate,
  successLotUpdate,
  successLotDelete,
  successUserStatusLotUpdate,
  successInnerStatusLotUpdate,
} = getFetchResultMessages();

export function useCreateLot() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loadingStatus, errors } = useSelector((state) => state.lotList);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (_.isNull(loadingStatus) || !isSubmitted) return;

    if (!loadingStatus && !errors) {
      dispatch(
        setModalFields({
          modalId: 'snackbar',
          message: successLotCreate,
          severity: 'success',
          isOpen: true,
        })
      );
      navigate(-1);
    }
  }, [loadingStatus, errors, isSubmitted]);

  return async ({ formData, currency }) => {
    await dispatch(createLot({ formData, currency }));
    setIsSubmitted(true);
  };
}

export function useUpdateLot() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loadingStatus, errors } = useSelector((state) => state.lotList);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (_.isNull(loadingStatus) || !isSubmitted) return;

    if (!loadingStatus && !errors) {
      dispatch(
        setModalFields({
          modalId: 'snackbar',
          message: successLotUpdate,
          severity: 'success',
          isOpen: true,
        })
      );

      navigate(-1);
    }
  }, [loadingStatus, errors, isSubmitted]);

  return async ({ id, lotData, currency }) => {
    await dispatch(updateLot({ id, lotData, currency }));
    setIsSubmitted(true);
  };
}

export function useDeleteLot() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { loadingStatus, errors } = useSelector((state) => state.lotList);

  useEffect(() => {
    if (_.isNull(loadingStatus) || !isSubmitted) return;

    if (!loadingStatus && !errors) {
      dispatch(
        setModalFields({
          modalId: 'snackbar',
          message: successLotDelete,
          severity: 'success',
          isOpen: true,
        })
      );
      dispatch(clearModalsFields('confirmModal'));
      navigate(-1);
    }
  }, [loadingStatus, errors, isSubmitted]);

  return async ({ id }) => {
    await dispatch(deleteLot({ id }));
    setIsSubmitted(true);

    return !loadingStatus && !errors;
  };
}

export const useDeactivateLot = () => {
  const dispatch = useDispatch();
  const { loadingStatus, errors } = useSelector((state) => state.lotList);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (_.isNull(loadingStatus) || !isSubmitted) return;

    if (!loadingStatus && !errors) {
      dispatch(
        setModalFields({
          modalId: 'snackbar',
          message: successUserStatusLotUpdate,
          severity: 'success',
          isOpen: true,
        })
      );
    }

    dispatch(clearModalsFields('confirmModal'));
  }, [loadingStatus, errors, isSubmitted]);

  return async (lotId) => {
    await dispatch(
      changeLotStatusByUser({
        lotId: lotId,
        isActive: false,
      })
    );
    setIsSubmitted(true);
  };
};

export function useChangeLotStatusByUser() {
  const dispatch = useDispatch();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { loadingStatus, errors } = useSelector((state) => state.lotList);

  useEffect(() => {
    if (_.isNull(loadingStatus) || !isSubmitted) return;

    if (!loadingStatus && !errors) {
      dispatch(
        setModalFields({
          modalId: 'snackbar',
          message: successUserStatusLotUpdate,
          severity: 'success',
          isOpen: true,
        })
      );
      dispatch(clearModalsFields('confirmModal'));
    }
  }, [loadingStatus, errors, isSubmitted]);

  return async ({ lotId, userStatus }) => {
    await dispatch(
      changeLotStatusByUser({
        lotId: lotId,
        isActive: userStatus === 'active' ? false : true,
      })
    );
    setIsSubmitted(true);

    return !loadingStatus && !errors;
  };
}

export function useChangeLotStatusByAdmin() {
  const dispatch = useDispatch();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { loadingStatus, errors } = useSelector((state) => state.lotList);

  useEffect(() => {
    if (_.isNull(loadingStatus) || !isSubmitted) return;

    if (!loadingStatus && !errors) {
      dispatch(
        setModalFields({
          modalId: 'snackbar',
          message: successInnerStatusLotUpdate,
          severity: 'success',
          isOpen: true,
        })
      );
    }
  }, [loadingStatus, errors, isSubmitted]);

  return async ({ lotId, status, adminMessage, selectedCurrency }) => {
    await dispatch(
      changeLotStatusByAdmin({
        lotId: lotId,
        status: status,
        adminComment: adminMessage,
        currency: selectedCurrency,
      })
    );
    dispatch(clearModalsFields(['adminMessageModal', 'confirmModal']));
    setIsSubmitted(true);

    return !loadingStatus && !errors;
  };
}
