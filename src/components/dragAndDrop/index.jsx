// import React, { useEffect, useState } from 'react';
// import { useDropzone } from 'react-dropzone';

// const thumbsContainer = {
//   display: 'flex',
//   flexDirection: 'row',
//   flexWrap: 'wrap',
//   marginTop: 16,
// };

// const thumb = {
//   display: 'inline-flex',
//   borderRadius: 2,
//   border: '1px solid #eaeaea',
//   marginBottom: 8,
//   marginRight: 8,
//   width: 100,
//   height: 100,
//   padding: 4,
//   boxSizing: 'border-box',
// };

// const thumbInner = {
//   display: 'flex',
//   minWidth: 0,
//   overflow: 'hidden',
// };

// const img = {
//   display: 'block',
//   width: 'auto',
//   height: '100%',
// };

// function Previews(props) {
//   const [files, setFiles] = useState([]);
//   const { getRootProps, getInputProps } = useDropzone({
//     maxFiles: 3,
//     accept: {
//       'image/png': ['.png'],
//       'text/html': ['.html', '.htm'],
//     },
//     onDrop: (acceptedFiles) => {
//       setFiles(
//         acceptedFiles.map((file) =>
//           Object.assign(file, {
//             preview: URL.createObjectURL(file),
//           })
//         )
//       );
//     },
//   });

//   const thumbs = files.map((file) => (
//     <div style={thumb} key={file.name}>
//       <div style={thumbInner}>
//         <img
//           src={file.preview}
//           style={img}
//           // Revoke data uri after image is loaded
//           onLoad={() => {
//             URL.revokeObjectURL(file.preview);
//           }}
//         />
//       </div>
//     </div>
//   ));

//   useEffect(() => {
//     // Make sure to revoke the data uris to avoid memory leaks, will run when files change
//     return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
//   }, [files]);
// console.log(files)
//   return (
//     <section className="container">
//       <div {...getRootProps({ className: 'dropzone' })}>
//         <input {...getInputProps()} />
//         <p>Drag 'n' drop some files here, or click to select files</p>
//       </div>
//       <aside style={thumbsContainer}>{thumbs}</aside>
//     </section>
//   );
// }

// export default Previews;
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const Previews = ({ className }) => {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles?.length) {
      setFiles((previousFiles) => [
        ...previousFiles,
        ...acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        ),
      ]);
    }

    if (rejectedFiles?.length) {
      setRejected((previousFiles) => [...previousFiles, ...rejectedFiles]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': [],
    },
    maxSize: 1024 * 1000,
    onDrop,
  });

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const removeFile = (name) => {
    setFiles((files) => files.filter((file) => file.name !== name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files?.length) return;

    const formData = new FormData();
    files.forEach((file) => formData.append('file', file));
    formData.append('upload_preset', 'friendsbook');

    const URL = process.env.NEXT_PUBLIC_CLOUDINARY_URL;
    const data = await fetch(URL, {
      method: 'POST',
      body: formData,
    }).then((res) => res.json());

    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        {...getRootProps({
          className: className,
        })}
      >
        <input {...getInputProps()} />
        <div>
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag & drop files here, or click to select files</p>
          )}
        </div>
      </div>

      {/* Preview */}
      <section>
        <div>
          <h2>Preview</h2>
        </div>
        {/* Accepted files */}
        <h3>Accepted Files</h3>
        <ul>
          {files.map((file) => (
            <li key={file.name}>
              <img
                src={file.preview}
                alt={file.name}
                width={100}
                height={100}
                onLoad={() => {
                  URL.revokeObjectURL(file.preview);
                }}
              />
              <button
                type="button"
                onClick={() => removeFile(file.name)}
              ></button>
              <p>{file.name}</p>
            </li>
          ))}
        </ul>
      </section>
    </form>
  );
};

export default Previews;
