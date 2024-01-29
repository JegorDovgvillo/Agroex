import styles from './header.module.scss';
import AgroexLogo from '@assets/icons/AgroexLogoHeader.svg';

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
