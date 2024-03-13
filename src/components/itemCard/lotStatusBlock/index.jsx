import _ from 'lodash';

import CustomBadge from '@components/customBadge';

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
        return [{ type: 'error', text: 'rejected' }];
      case 'inactive':
        return [{ type: 'warning', text: 'deactivated by user' }];
      case 'finished':
        return [{ type: 'success', text: 'finished' }];
      case 'expired':
        return [{ type: 'warning', text: 'expired' }];
      case 'won':
        return [{ type: 'success', text: 'won' }];
      case 'lose':
        return [{ type: 'warning', text: 'lose' }];
      default:
        return [];
    }
  });

  return _.uniqBy(targetStatusesArr, 'text');
};

const LotStatusBlock = ({ lotStatuses }) => {
  const statuses = getBadgeProps(lotStatuses);

  return (
    <>
      {!_.isEmpty(statuses) &&
        statuses.map((status) => (
          <CustomBadge
            key={status.text}
            type={status.type}
            size="small"
            label={status.text}
          />
        ))}
    </>
  );
};

export default LotStatusBlock;
