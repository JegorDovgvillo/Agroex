import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import CloseIcon from '@mui/icons-material/Close';
import styles from './dragAndDrop.module.scss';

const Previews = ({ values, handleFileSelect }) => {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles?.length) {
        handleFileSelect(acceptedFiles);
        setFiles((previousFiles) => [
          ...previousFiles,
          ...acceptedFiles.map((file) =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
          ),
        ]);
      }
    },
    [handleFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': [],
    },
    maxSize: 1024 * 1000,
    onDrop,
  });

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const removeFile = (name) => {
    setFiles((files) => files.filter((file) => file.name !== name));
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
            Acceptable formats: jpeg, png. Maximum size: 5 MB.
          </p>
        </div>
      </div>
      <div>
        <ul className={styles.imageWrapp}>
          {files.map((file) => (
            <li key={file.name}>
              <img
                src={file.preview}
                alt={file.name}
                width={100}
                height={100}
                onLoad={() => URL.revokeObjectURL(file.preview)}
              />
              <CloseIcon onClick={() => removeFile(file.name)} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Previews;
