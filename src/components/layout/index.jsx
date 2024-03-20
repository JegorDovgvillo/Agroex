import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet } from 'react-router';
import _ from 'lodash';

import { getUserFromCognito } from '@thunks/fetchUsers';

import { selectModal } from '@slices/modalSlice';
import ConfirmActionModal from '@customModals/confirmActionModal';
import AdminMessageModal from '@customModals/adminMessageModal';

import Header from '../header';
import Footer from '../footer';

import styles from './layout.module.scss';

const Layout = () => {
  const dispatch = useDispatch();
  const confirmActionData = useSelector((state) =>
    selectModal(state, 'confirmModal')
  );
  const [text, setText] = useState('');

  useEffect(() => {
    if (_.isEqual(text, confirmActionData.text)) {
      return;
    }

    setText(confirmActionData.text);
  }, [confirmActionData.text]);

  useEffect(() => {
    dispatch(getUserFromCognito());
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
    </div>
  );
};

export default Layout;
