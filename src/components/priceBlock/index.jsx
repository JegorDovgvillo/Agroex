import getNumberWithCurrency from '@helpers/getNumberWithCurrency';
import styles from './priceBlock.module.scss';

const PriceBlock = ({ totalCost, unitCost, currency, className }) => {
  const classNames = className.map((c) => styles[c]).join(' ');
  const costWithCurrency = getNumberWithCurrency(totalCost, currency);
  const unitCostWithCurrency = getNumberWithCurrency(unitCost, currency);

  return (
    <div className={`${styles.container} ${classNames}`}>
      <p>{costWithCurrency}</p>
      <span>{unitCostWithCurrency}</span>
    </div>
  );
};

export default PriceBlock;
