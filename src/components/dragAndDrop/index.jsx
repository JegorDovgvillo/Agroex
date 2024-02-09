import { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import CloseIcon from '@mui/icons-material/Close';

import styles from './dragAndDrop.module.scss';

const Previews = ({
  files,
  setFiles,
  maxFilesPerDrop,
  setMaxFilesPerDrop,
  disabled,
  setDisabled,
}) => {
  const MIN_IMAGE_WIDTH = 120;
  const MIN_IMAGE_HEIGHT = 120;
  const MAX_IMAGE_WIDTH = 1024;
  const MAX_IMAGE_HEIGHT = 1024;
  const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

  const validateImage = (acceptedFiles) => {
    if (acceptedFiles?.length) {
      acceptedFiles.forEach((file) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
          if (
            img.width >= MIN_IMAGE_WIDTH &&
            img.height >= MIN_IMAGE_HEIGHT &&
            img.width <= MAX_IMAGE_WIDTH &&
            img.height <= MAX_IMAGE_HEIGHT
          ) {
            setFiles((previousFiles) => [
              ...previousFiles,
              Object.assign(file, { preview: URL.createObjectURL(file) }),
            ]);
          }
        };
      });
    }
  };

  const onDrop = (acceptedFiles) => {
    validateImage(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [
        '.jpeg',
        '.jpg',
        '.tiff',
        '.tif',
        '.ico',
        '.icon',
        '.bmp',
        '.gif',
        '.heic',
        '.heif',
        '.png',
        '.webp',
      ],
    },
    maxSize: MAX_IMAGE_SIZE,
    multiple: true,
    maxFiles: maxFilesPerDrop,
    onDrop,
    noDrag: disabled,
    noClick: disabled,
  });

  useEffect(() => {
    if (files.length < 6) {
      setMaxFilesPerDrop(6 - files.length);
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [files]);

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const removeFile = (preview) => {
    setFiles((files) => files.filter((file) => file.preview !== preview));
  };

  return (
    <>
      <div {...getRootProps()} className={styles.wrapp}>
        <input {...getInputProps()} />
        <div>
          <p>
            <span>Choose a file</span> or drag and drop it here
          </p>
          <p className={styles.infoParagraph}>
            Acceptable formats: jpeg, png. Maximum size: 10 MB.
          </p>
        </div>
      </div>
      <p className={styles.imageCount}>{files.length} of 6 images</p>
      <ul className={styles.imageWrapp}>
        {files.map((file) => (
          <li key={file.preview}>
            <img
              src={file.preview}
              alt={file.name}
              width={120}
              height={120}
              onLoad={() => URL.revokeObjectURL(file.preview)}
            />
            <CloseIcon onClick={() => removeFile(file.preview)} />
          </li>
        ))}
      </ul>
    </>
  );
};

export default Previews;
