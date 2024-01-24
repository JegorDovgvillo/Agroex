import Header from '../header';
import Footer from '../footer';
import styles from './layout.module.scss';

const Layout = ({ children }) => {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.mainContent}>{children}</div>
      <Footer />
    </div>
  );
};
export default Layout;
