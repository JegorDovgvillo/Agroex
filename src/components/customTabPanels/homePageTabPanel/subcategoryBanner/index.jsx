import { useNavigate } from 'react-router-dom';
import styles from './banner.module.scss';
import bannerImage from '@assets/images/banner.png';

const { container, titleRow } = styles;

const SubcategoryBanner = ({ title, path }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path);
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
