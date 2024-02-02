import styles from './adminDetailedLotView.module.scss';
import getNumberWithCurrency from '../../../helpers/getNumberWithCurrency';
import getFormattedDate from '../../../helpers/getFormattedDate';

const { container, lotDetailsRow, lotDetailsKey, lotDetailsValue } = styles;

const AdminDetailedLotView = ({ lot }) => {
  const {
    id,
    creationDate,
    currency,
    description,
    enabledByAdmin,
    expirationDate,
    images,
    location,
    lotType,
    packaging,
    pricePerTon,
    productCategoryId,
    quantity,
    size,
    tags,
    title,
    userId,
    variety,
  } = lot;

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
    { key: 'Product Category', value: productCategoryId },
    { key: 'Variety', value: variety },
    { key: 'Description', value: description },
    { key: 'Creation Date', value: getFormattedDate(creationDate) },
    { key: 'Expiration Date', value: getFormattedDate(expirationDate) },
    { key: 'Location', value: `${location.countryName}, ${location.region}` },
    { key: 'Size / Packaging', value: `${size} / ${packaging}` },
    { key: 'Tags', value: `${tags.map((t) => ` ${t.title}`)}` },
    { key: 'User Data', value: userId },
    { key: 'Images', value: images[0].name },
  ];

  return (
    <div className={container}>
      {lotDetails.map((el) => (
        <div key={el.key} className={`${lotDetailsRow}`}>
          <p className={lotDetailsKey}>{el.key}</p>
          <p className={lotDetailsValue}>{el.value}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminDetailedLotView;
