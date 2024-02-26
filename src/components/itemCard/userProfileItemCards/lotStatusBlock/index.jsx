import CustomBadge from '@components/customBadge';

const getBadgeProps = (lotStatus) => {
  switch (lotStatus.toLowerCase()) {
    case 'rejected':
      return { type: 'error', text: 'Rejected' };
    // todo should be after back and changing case 'onModeration':
    case 'moderated':
      return { type: 'info', text: 'On moderation' };
    case 'cleared customs':
      return { type: 'warning', text: 'Cleared customs' };
    default:
      return { type: 'default', text: lotStatus };
  }
};

const LotStatusBlock = ({ lotStatus }) => {
  const { type, text } = getBadgeProps(lotStatus);

  return <CustomBadge type={type} size="small" label={text} />;
};

export default LotStatusBlock;
