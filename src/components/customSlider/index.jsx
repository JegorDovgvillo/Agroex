import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import ENDPOINTS, { IMAGE_URL } from '@helpers/endpoints';

const baseURL = `${IMAGE_URL}${ENDPOINTS.IMAGES}`;
import styles from './customSlider.module.scss';

const {
  customSliderContainer,
  customStickDots,
  slide,
  sliderImage,
  arrow,
  next,
  prev,
} = styles;

function NextArrow(props) {
  const { onClick } = props;

  return (
    <div className={`${arrow} ${next}`} onClick={onClick}>
      <ArrowForwardIosIcon />
    </div>
  );
}

function PrevArrow(props) {
  const { onClick } = props;

  return (
    <div className={`${arrow} ${prev}`} onClick={onClick}>
      <ArrowForwardIosIcon />
    </div>
  );
}

const CustomSlider = ({ images }) => {
  const settings = {
    customPaging: function (i) {
      return (
        <a>
          <img src={`${baseURL}/${images[i].name}`} width={120} height={100} />
        </a>
      );
    },

    fade: true,
    dots: true,
    dotsClass: `slick-dots slick-thumb ${customStickDots}`,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className={`${customSliderContainer}`}>
      <Slider {...settings}>
        {images.map((el) => (
          <div key={el.id} className={slide}>
            <img src={`${baseURL}/${el.name}`} className={sliderImage} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CustomSlider;
