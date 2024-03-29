import ImageGallery from 'react-image-gallery';

import { IMAGE_URL } from '@helpers/endpoints';

import 'react-image-gallery/styles/css/image-gallery.css';
import './customSlider.scss';

const getImages = (images) => {
  return images.map((image) => ({
    original: `${IMAGE_URL}/${image.name}`,
    originalAlt: 'Lot image',
    thumbnail: `${IMAGE_URL}/${image.name}`,
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
