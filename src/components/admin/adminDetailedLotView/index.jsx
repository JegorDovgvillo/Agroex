import { find } from 'lodash';

import getNumberWithCurrency from '@helpers/getNumberWithCurrency';
import getFormattedDate from '@helpers/getFormattedDate';
import { getFormattedDuration } from '@helpers/getFormattedDuration';

import CustomSlider from '@components/customSlider';

import styles from './adminDetailedLotView.module.scss';

const {
  container,
  lotDetailsRow,
  lotDetailsKey,
  lotDetailsValue,
  userDataContainer,
} = styles;

const AdminDetailedLotView = ({ lot, userData, categories }) => {
  const {
    id,
    creationDate,
    currency,
    description,
    duration,
    enabledByAdmin,
    expirationDate,
    location,
    lotType,
    packaging,
    price,
    productCategory,
    quantity,
    size,
    tags,
    title,
    variety,
    images,
  } = lot;

  const {
    username,
    email,
    phoneNumber,
    creationDate: userCreationDate,
  } = userData;

  const lotDetails = [
    { key: 'Id', value: id },
    { key: 'Title', value: title },

    {
      key: 'Enabled By Admin',
      value: `${enabledByAdmin ? 'Enabled' : 'Disabled'}`,
    },
    { key: 'Lot Type', value: lotType },
    { key: 'Quantity', value: `${getNumberWithCurrency(quantity)} ton` },
    {
      key: 'Price Per Ton',
      value: `${getNumberWithCurrency(price / quantity, currency)}/ton`,
    },
    {
      key: 'Total price',
      value: `${getNumberWithCurrency(price, currency)}`,
    },
    {
      key: 'Product category',
      value: find(categories, { id: productCategory.parentId }).title,
    },
    {
      key: 'Product subcategory',
      value: productCategory.title,
    },
    { key: 'Variety', value: variety },
    { key: 'Description', value: description },
    { key: 'Duration', value: duration ? getFormattedDuration(duration) : '' },
    { key: 'Creation Date', value: getFormattedDate(creationDate) },
    {
      key: 'Expiration Date',
      value: expirationDate ? getFormattedDate(expirationDate) : '',
    },
    { key: 'Location', value: `${location.countryName}, ${location.region}` },
    { key: 'Size / Packaging', value: `${size} / ${packaging}` },
    {
      key: 'Tags',
      value: `${tags.length > 0 ? tags.map((t) => ` ${t.title}`) : 'no tags'}`,
    },
    {
      key: 'User Data',
      value: (
        <div className={userDataContainer}>
          <span>{`Name: ${username}`}</span>
          <span>{`Email: ${email}`}</span>
          <span>{`Phone Number: ${phoneNumber || 'n/a'}`}</span>
          <span>{`Registration Date: ${
            userCreationDate ? getFormattedDate(userCreationDate) : 'n/a'
          }`}</span>
        </div>
      ),
    },
  ];

  return (
    <div className={container}>
      <>
        {lotDetails.map((el) => (
          <div key={el.key} className={`${lotDetailsRow}`}>
            <div className={lotDetailsKey}>{el.key}</div>
            <div className={lotDetailsValue}>{el.value}</div>
          </div>
        ))}

        {images.length > 0 && <CustomSlider images={images} />}
      </>
    </div>
  );
};

export default AdminDetailedLotView;
