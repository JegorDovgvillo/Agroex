import { useSelector } from 'react-redux';

import { selectCategoryById } from '@slices/categoriesSlice';

import getNumberWithCurrency from '@helpers/getNumberWithCurrency';
import getFormattedDate from '@helpers/getFormattedDate';

import styles from './adminDetailedLotView.module.scss';

const {
  container,
  lotDetailsRow,
  lotDetailsKey,
  lotDetailsValue,
  userDataContainer,
} = styles;

const AdminDetailedLotView = ({ lot, userData }) => {
  const {
    id,
    creationDate,
    currency,
    description,
    enabledByAdmin,
    expirationDate,
    location,
    lotType,
    packaging,
    pricePerTon,
    productCategoryId,
    quantity,
    size,
    tags,
    title,
    variety,
  } = lot;

  const category = useSelector((state) =>
    selectCategoryById(state, productCategoryId)
  );

  const { title: categoryTitle } = category;

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
      value: `${getNumberWithCurrency(pricePerTon, currency)}/ton`,
    },
    {
      key: 'Total price',
      value: `${getNumberWithCurrency(quantity * pricePerTon, currency)}`,
    },
    {
      key: 'Product Category',
      value: categoryTitle,
    },
    { key: 'Variety', value: variety },
    { key: 'Description', value: description },
    { key: 'Creation Date', value: getFormattedDate(creationDate) },
    { key: 'Expiration Date', value: getFormattedDate(expirationDate) },
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
          <span>{`Phone Number: ${phoneNumber}`}</span>
          <span>{`Registration Date: ${getFormattedDate(
            userCreationDate
          )}`}</span>
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
      </>
    </div>
  );
};

export default AdminDetailedLotView;
