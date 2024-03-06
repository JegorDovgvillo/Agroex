import { useParams } from 'react-router-dom';
import { find } from 'lodash';

import { adminProfileData } from '../adminProfileData';

const AdminTabContent = () => {
  const { page } = useParams();

  const targetTabContentPage =
    find(adminProfileData, { route: page })?.element ||
    adminProfileData[0].element;

  return <>{targetTabContentPage}</>;
};

export default AdminTabContent;
