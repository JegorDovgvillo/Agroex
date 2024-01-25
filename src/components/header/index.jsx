import AgroexLogo from '../../images/AgroexLogoHeader.svg';
import styles from './header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={AgroexLogo} alt="Agroex Logo" />
      </div>
    </header>
  );
};

export default Header;
