import { Link } from 'react-router-dom';
import { Breadcrumbs, Typography } from '@mui/material';

import styles from './customBreadcrumbs.module.scss';

const { container, link } = styles;

function handleClick(event) {
  event.preventDefault();
}

const CustomBreadcrumbs = ({ props }) => {
  return (
    <div role="presentation" onClick={handleClick} className={container}>
      <Breadcrumbs aria-label="breadcrumb">
        {props.map((el, index) =>
          index !== props.length - 1 ? (
            <Link
              key={el.id}
              underline="hover"
              color="inherit"
              to={el.link}
              className={link}
            >
              {el.value}
            </Link>
          ) : (
            <Typography key={el.id} color="text.primary">
              {el.value}
            </Typography>
          )
        )}
      </Breadcrumbs>
    </div>
  );
};

export default CustomBreadcrumbs;
