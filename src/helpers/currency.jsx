import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CurrencyRubleIcon from '@mui/icons-material/CurrencyRuble';
import EuroIcon from '@mui/icons-material/Euro';
import flagUS from '../assets/icons/flagUS.svg';
import flagBY from '../assets/icons/flagBY.svg';
import flagRU from '../assets/icons/flagRU.svg';
import flagEU from '../assets/icons/flagEU.svg';

export const CURRENCY = [
  {
    key: 'USD',
    symbol: <AttachMoneyIcon />,
    iconSrc: flagUS,
  },
  {
    key: 'BYN',
    symbol: 'BYN',
    iconSrc: flagBY,
  },
  {
    key: 'EUR',
    symbol: <EuroIcon />,
    iconSrc: flagEU,
  },
  {
    key: 'RUB',
    symbol: <CurrencyRubleIcon />,
    iconSrc: flagRU,
  },
];
