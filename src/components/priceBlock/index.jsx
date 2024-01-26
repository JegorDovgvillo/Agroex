import styles from "./priceBlock.module.scss";

const PriceBlock = ({ className }) => {
  return (
    <div className={styles[className]}>
      <h6>$11,000.00</h6>
      <span>$1.1/kg</span>
    </div>
  );
};

export default PriceBlock;
