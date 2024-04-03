import _ from 'lodash';

import CustomBadge from '@components/customBadge';

import styles from './lotStatusBlock.module.scss';

const { badgesContainer } = styles;

const getFormattedString = (str) => {
  return _.words(_.startCase(str)).join(' ').toLowerCase();
};

const getBadgeProps = (lotStatuses) => {
  const targetStatusesArr = _.flatMap(lotStatuses, (status) => {
    switch (status) {
      case 'new':
        return [{ type: 'default', text: 'awaiting moderation' }];
      case 'onModeration':
      case 'auctionSell':
      case 'sell':
      case 'buy':
        return [{ type: 'info', text: getFormattedString(status) }];
      case 'rejected':
        return [{ type: 'error', text: 'rejected by admin' }];
      case 'inactive':
        return [{ type: 'warning', text: 'deactivated by user' }];
      case 'finished':
      case 'won':
        return [{ type: 'success', text: getFormattedString(status) }];
      case 'approved':
        return [{ type: 'success', text: 'approved by admin' }];
      case 'lose':
        return [{ type: 'warning', text: getFormattedString(status) }];
      default:
        return [];
    }
  });

  return _.uniqBy(targetStatusesArr, 'text');
};

const LotStatusBlock = ({ lotStatuses }) => {
  const statuses = getBadgeProps(lotStatuses);

  return (
    <div className={badgesContainer}>
      {!_.isEmpty(statuses) &&
        statuses.map((status) => (
          <CustomBadge
            key={status.text}
            type={status.type}
            size="small"
            label={status.text}
          />
        ))}
    </div>
  );
};

export default LotStatusBlock;
