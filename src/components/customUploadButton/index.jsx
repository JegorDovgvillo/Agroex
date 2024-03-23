import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { v4 as uuidv4 } from 'uuid';
import { useRef } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import _ from 'lodash';

import { CustomButton } from '@buttons/CustomButton';

import styles from './customUploadButton.module.scss';

const CustomUploadButton = ({
  file,
  setFile,
  imageSrc,
  isValid,
  buttonName,
}) => {
  const fileInputRef = useRef();

  const handleFileChange = (event) => {
    const newFile = event.target.files[0];

    setFile(
      _.assign(newFile, {
        preview: URL.createObjectURL(newFile),
        id: uuidv4(),
      })
    );
  };

  const removeFile = () => {
    if (file) {
      fileInputRef.current.value = '';

      setFile(null);
      URL.revokeObjectURL(file.preview);
    }
  };

  return (
    <>
      {imageSrc && (
        <>
          <p>Selected image:</p>
          <img src={imageSrc} alt="Uploaded" />
          <CloseIcon onClick={removeFile} className={styles.closeIcon} />
        </>
      )}
      <div className={styles.buttons}>
        <Button
          component="label"
          variant="contained"
          sx={{ width: '210px' }}
          className={styles.uploadButton}
        >
          <CloudUploadIcon />
          <span>Upload file</span>
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: 'none' }}
            onChange={handleFileChange}
            accept="image/*"
          />
        </Button>
        <CustomButton
          disabled={!isValid}
          text={buttonName}
          width="210px"
          typeOfButton="submit"
        />
      </div>
    </>
  );
};

export default CustomUploadButton;
