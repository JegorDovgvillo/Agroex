import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet } from 'react-router';
import _ from 'lodash';
import { EventSource } from 'extended-eventsource';
import { fetchAuthSession } from 'aws-amplify/auth';

import { getUserFromCognito } from '@thunks/fetchUsers';

import { setMessage } from '@slices/sseSlice';
import { selectModal, clearModalsFields } from '@slices/modalSlice';
import ConfirmActionModal from '@customModals/confirmActionModal';
import AdminMessageModal from '@customModals/adminMessageModal';
import { CustomSnackbar } from '@components/customSnackbar';

import { useErrorHandler } from '@helpers/customHooks/errorHandlerHook';

import ENDPOINTS, { BASE_URL } from '@helpers/endpoints';

import Header from '../header';
import Footer from '../footer';

import styles from './layout.module.scss';

const Layout = () => {
  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.usersList.userInfo);
  const errorHandler = useErrorHandler();
  const confirmActionData = useSelector((state) =>
    selectModal(state, 'confirmModal')
  );
  const customSnackbarData = useSelector((state) =>
    selectModal(state, 'snackbar')
  );
  const categoriesState = useSelector((state) => state.categories);
  const lotListState = useSelector((state) => state.lotList);
  const usersListState = useSelector((state) => state.usersList);
  const betsState = useSelector((state) => state.bets);
  const countriesState = useSelector((state) => state.countries);
  const tagsState = useSelector((state) => state.tags);

  const [text, setText] = useState('');
  const [sseConnection, setSseConnection] = useState(null);

  const openConnection = async () => {
    const { idToken } = (await fetchAuthSession()).tokens ?? {};
    const sse = new EventSource(`${BASE_URL}${ENDPOINTS.SSE}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    setSseConnection(sse);

    return sse;
  };

  useEffect(() => {
    if (_.isEqual(text, confirmActionData.text)) return;

    setText(confirmActionData.text);
  }, [confirmActionData.text]);

  useEffect(() => {
    dispatch(getUserFromCognito());
  }, []);

  useEffect(() => {
    if (userInfo) {
      openConnection().then(
        (data) =>
          (data.onmessage = (event) => {
            dispatch(setMessage(JSON.parse(event.data)));
          })
      );
    } else if (!userInfo && sseConnection) {
      sseConnection.close();
    }
  }, [userInfo]);

  useEffect(() => {
    const { isOpen, message } = customSnackbarData;

    if (!isOpen && message) {
      dispatch(clearModalsFields('snackbar'));
    }
  }, [customSnackbarData]);

  useEffect(() => {
    const statesWithErrors = _.filter(
      [
        categoriesState,
        lotListState,
        usersListState,
        betsState,
        countriesState,
        tagsState,
      ],
      (state) => !_.isNull(state.errors)
    );

    !_.isEmpty(statesWithErrors) && errorHandler(statesWithErrors);
  }, [
    categoriesState,
    lotListState,
    usersListState,
    betsState,
    countriesState,
    tagsState,
  ]);

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.mainContent}>
        <Outlet />
      </div>
      <Footer />
      <ConfirmActionModal text={text} />
      <AdminMessageModal />
      <CustomSnackbar />
    </div>
  );
};

export default Layout;
