import { IMAGE_URL } from '@helpers/endpoints';
import ENDPOINTS from '@helpers/endpoints';

const convertImagesToFiles = async (images, setFiles) => {
  const files = [];

  for (const { id, name } of images) {
    const URL = `${IMAGE_URL}${ENDPOINTS.IMAGES}`;
    const response = await fetch(`${URL}/${name}`);
    const blob = await response.blob();
    const file = new File([blob], name, { type: 'image/jpeg' });
    file.id = id;
    files.push(file);
  }

  setFiles(files);
};

export default convertImagesToFiles;
