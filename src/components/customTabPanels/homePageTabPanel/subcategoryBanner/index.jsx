import styles from './banner.module.scss';
import bannerImage from '@assets/images/banner.png';

const { container, titleRow } = styles;

const SubcategoryBanner = ({ title }) => {
  const handleClick = () => {
    //todo write logic to  redirect user
  };

  return (
    <div className={container} onClick={handleClick}>
      <div className={titleRow}>
        <h4>{title}</h4>
      </div>
      <img src={bannerImage} />
    </div>
  );
};

export default SubcategoryBanner;
