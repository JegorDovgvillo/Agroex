import { useNavigate } from 'react-router-dom';
import styles from './banner.module.scss';
import bannerImage from '@assets/images/banner.png';
import ENDPOINTS, { IMAGE_URL } from '@helpers/endpoints';
const { container, titleRow } = styles;

const SubcategoryBanner = ({ title, path, image }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path);
  };

  const src = image ? `${IMAGE_URL}${ENDPOINTS.IMAGES}/${image}` : bannerImage;

  return (
    <div className={container} onClick={handleClick}>
      <div className={titleRow}>
        <h4>{title}</h4>
      </div>
      <img src={src} />
    </div>
  );
};

export default SubcategoryBanner;
