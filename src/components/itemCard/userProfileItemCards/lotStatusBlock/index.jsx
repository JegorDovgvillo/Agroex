import CustomBadge from '@components/customBadge';

const getBadgeType = (lotStatus) => {
  switch (lotStatus.toLowerCase()) {
    case 'rejected':
      return 'error';
    case 'on moderation':
      return 'info';
    case 'cleared customs':
      return 'warning';
    default:
      return 'default';
  }
};

const LotStatusBlock = ({ lotStatus }) => {
  const type = getBadgeType(lotStatus);

  return <CustomBadge type={type} size="small" label={lotStatus} />;
};

export default LotStatusBlock;
