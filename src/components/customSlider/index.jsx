import ImageGallery from 'react-image-gallery';

import ENDPOINTS, { IMAGE_URL } from '@helpers/endpoints';

const baseURL = `${IMAGE_URL}${ENDPOINTS.IMAGES}`;

import 'react-image-gallery/styles/css/image-gallery.css';
import './customSlider.scss';

const getImages = (images) => {
  return images.map((image) => ({
    original: `${baseURL}/${image.name}`,
    originalAlt: 'Lot image',
    thumbnail: `${baseURL}/${image.name}`,
    thumbnailAlt: 'Lot image',
  }));
};

const CustomSlider = ({ images }) => {
  const imagesArr = getImages(images);

  return (
    <div className="customSliderContainer">
      <ImageGallery items={imagesArr} infinite={false} />
    </div>
  );
};

export default CustomSlider;
