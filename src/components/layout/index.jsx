import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet } from 'react-router';
import _ from 'lodash';
import { EventSource } from 'extended-eventsource';
import { fetchAuthSession } from 'aws-amplify/auth';

import { getUserFromCognito } from '@thunks/fetchUsers';

import { selectModal } from '@slices/modalSlice';
import ConfirmActionModal from '@customModals/confirmActionModal';
import AdminMessageModal from '@customModals/adminMessageModal';
import { CustomSnackbar } from '@components/customSnackbar';

import ENDPOINTS, { BASE_URL } from '@helpers/endpoints';

import Header from '../header';
import Footer from '../footer';

import styles from './layout.module.scss';

const Layout = () => {
  const dispatch = useDispatch();
  const confirmActionData = useSelector((state) =>
    selectModal(state, 'confirmModal')
  );

  const [sseConnection, setSseConnection] = useState(null);
  const [text, setText] = useState('');

  const openConnection = async () => {
    const { idToken } = (await fetchAuthSession()).tokens ?? {};
    const sse = new EventSource(`${BASE_URL}${ENDPOINTS.SSE}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

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
    openConnection().then((data) => setSseConnection(data));
  }, []);

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
