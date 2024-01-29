import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import Filters from '@components/filters';
import ItemCard from '@components/itemCard';

import { fetchLots } from '@store/slices/lotListSlice';
import { lotListSelector } from '@store/slices/lotListSlice';

import styles from './lotList.module.scss';

const LotList = ({ lotType }) => {
  const dispatch = useDispatch();
  const lots = useSelector(lotListSelector);

  useEffect(() => {
    dispatch(fetchLots());
  }, [dispatch]);

  const filteringLotsByLotType = () => {
    const filteredLots = lots
      .filter((item) =>
        lotType === undefined ? true : item.lotType === lotType
      )
      .map((item) => {
        return <ItemCard {...item} key={item.id} />;
      });

    return <>{filteredLots}</>;
  };

  const filteredLots = filteringLotsByLotType();
  
  return (
    <>
      <Filters />
      <div className={styles.lotListWrapp}>{filteredLots}</div>
    </>
  );
};

export default LotList;
