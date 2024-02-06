import AgroexLogo from '@icons/AgroexLogoFooter.svg';
import styles from './footer.module.scss';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.logo}>
        <img src={AgroexLogo} alt="Agroex Logo" />
        <p>2022 AGROEX. All rights received.</p>
      </div>
    </footer>
  );
};

export default Footer;
