import Header from '../header';
import Footer from '../footer';
import styles from './layout.module.scss';
import { Outlet } from 'react-router';

const Layout = () => {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.mainContent}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;