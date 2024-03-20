import getNumberWithCurrency from '@helpers/getNumberWithCurrency';

import styles from './priceBlock.module.scss';

const PriceBlock = ({
  totalCost,
  unitCost,
  currency,
  originalCost,
  originalUnitCost,
  originalCurrency = currency,
  className,
}) => {
  const classNames = className.map((c) => styles[c]).join(' ');
  const costWithCurrency = getNumberWithCurrency(totalCost, currency);
  const unitCostWithCurrency = getNumberWithCurrency(unitCost, currency);
  const originalCostWithCurrency = getNumberWithCurrency(
    originalCost,
    originalCurrency
  );
  const originalUnitCostWithCurrency = getNumberWithCurrency(
    originalUnitCost,
    originalCurrency
  );

  const isSameCurrency = currency === originalCurrency;

  return (
    <div className={`${styles.container} ${classNames}`}>
      <p>{costWithCurrency}</p>
      <span>{`${unitCostWithCurrency}/ton`}</span>
      {!isSameCurrency && (
        <div className={styles.original}>
          <p>{originalCostWithCurrency}</p>
          <span>{`${originalUnitCostWithCurrency}/ton`}</span>
        </div>
      )}
    </div>
  );
};

export default PriceBlock;
