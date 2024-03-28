import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import SportsScoreOutlinedIcon from '@mui/icons-material/SportsScoreOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import LocalAtmOutlinedIcon from '@mui/icons-material/LocalAtmOutlined';

const getMessageType = (type) => {
  switch (type) {
    case 'LOT_REJECT':
      return <WarningAmberIcon sx={{ color: 'red' }} />;
    case 'LOT_APPROVED':
      return <CheckCircleOutlineIcon sx={{ color: '#38999b' }} />;
    case 'LOT_GET':
      return <WarningAmberIcon sx={{ color: 'red' }} />;
    case 'LOT_DEAL':
      return <LocalAtmOutlinedIcon sx={{ color: '#38999b' }} />;
    case 'LOT_FINISHED':
    case 'AUCTION_LOST':
      return <SportsScoreOutlinedIcon sx={{ color: 'red' }} />;
    case 'BET_WIN':
      return <EmojiEventsOutlinedIcon sx={{ color: '#38999b' }} />;
    case 'BET_OUTBID':
      return <GavelOutlinedIcon sx={{ color: '#38999b' }} />;
    default:
      return <WarningAmberIcon sx={{ color: 'red' }} />;
  }
};

export default getMessageType;
