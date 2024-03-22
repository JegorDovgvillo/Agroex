import Divider from '@mui/material/Divider';

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
  detailedPage = false,
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
      <div className={styles.priceRow}>
        <p>{costWithCurrency}</p>
        {detailedPage && !isSameCurrency && (
          <>
            <Divider orientation="vertical" variant="middle" flexItem />
            <p className={styles.original}>{originalCostWithCurrency}</p>
          </>
        )}
      </div>
      <div className={styles.priceRow}>
        <span>{`${unitCostWithCurrency}/ton`}</span>
        {detailedPage && !isSameCurrency && (
          <>
            <Divider orientation="vertical" flexItem />
            <span
              className={styles.original}
            >{`${originalUnitCostWithCurrency}/ton`}</span>
          </>
        )}
      </div>

      {!isSameCurrency && !detailedPage && (
        <>
          <Divider className={styles.divider} />
          <div>
            <p className={styles.original}>{originalCostWithCurrency}</p>
            <span className={styles.original}>
              {`${originalUnitCostWithCurrency}/ton`}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default PriceBlock;
