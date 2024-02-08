import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const Previews = ({ className }) => {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length) {
      setFiles((previousFiles) => [
        ...previousFiles,
        ...acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        ),
      ]);
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
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const removeFile = (name) => {
    setFiles((files) => files.filter((file) => file.name !== name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files?.length) return;

    const formData = new FormData();
    files.forEach((file) => formData.append(`file`, file));
    formData.append('somth', e.target.somth.value);
    formData.append('somth1', '52');

    const URL = 'http://localhost:8080/lots';
    try {
      const response = await fetch(URL, {
        method: 'POST',
        body: formData,
        // headers: {
        //   'Content-Type': 'multipart/form-data',
        // },
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div {...getRootProps({ className: className })}>
        <input {...getInputProps()} />
        <div>
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag & drop files here, or click to select files</p>
          )}
        </div>
      </div>
      <section>
        <div>
          <h2>Preview</h2>
        </div>
        <h3>Accepted Files</h3>
        <input name="somth" type="hidden" value={12345}></input>
        <ul>
          {files.map((file) => (
            <li key={file.name}>
              <img
                src={file.preview}
                alt={file.name}
                width={100}
                height={100}
                onLoad={() => URL.revokeObjectURL(file.preview)}
              />
              <button type="button" onClick={() => removeFile(file.name)}>
                Remove
              </button>
              <p>{file.name}</p>
            </li>
          ))}
        </ul>
      </section>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Previews;

// import { useCallback, useEffect, useState } from 'react';
// import { useDropzone } from 'react-dropzone';

// const Previews = ({ className }) => {
//   const [files, setFiles] = useState([]);

//   const onDrop = useCallback((acceptedFiles) => {
//     if (acceptedFiles?.length) {
//       setFiles((previousFiles) => [
//         ...previousFiles,
//         ...acceptedFiles.map((file) =>
//           Object.assign(file, { preview: URL.createObjectURL(file) })
//         ),
//       ]);
//     }
//   }, []);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     accept: {
//       'image/*': [],
//     },
//     maxSize: 1024 * 1000,
//     onDrop,
//   });

//   useEffect(() => {
//     // Revoke the data uris to avoid memory leaks
//     return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
//   }, [files]);

//   const removeFile = (name) => {
//     setFiles((files) => files.filter((file) => file.name !== name));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!files?.length) return;

//     const formData = new FormData();
//     files.forEach((file, index) => formData.append(`file`, file));
//     formData.append('somth', e.target.somth.value);
//     formData.append('somth1', '52');

//     const URL = 'http://localhost:8080/lots/1/images';
//     const data = await fetch(URL, {
//       method: 'POST',
//       body: formData,
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     })
//       .then((res) => console.log(res))
//       .catch((res) => console.log(res));

//     console.log(data);
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div
//         {...getRootProps({
//           className: className,
//         })}
//       >
//         <input {...getInputProps()} />
//         <div>
//           {isDragActive ? (
//             <>
//               <p>Drop the files here ...</p>
//             </>
//           ) : (
//             <p>Drag & drop files here, or click to select files</p>
//           )}
//         </div>
//       </div>

//       {/* Preview */}
//       <section>
//         <div>
//           <h2>Preview</h2>
//         </div>
//         {/* Accepted files */}
//         <h3>Accepted Files</h3>
//         <input name="somth" type="hidden" value={12345}></input>
//         <ul>
//           {files.map((file) => (
//             <li key={file.name}>
//               <img
//                 src={file.preview}
//                 alt={file.name}
//                 width={100}
//                 height={100}
//                 onLoad={() => {
//                   URL.revokeObjectURL(file.preview);
//                 }}
//               />

//               <button
//                 type="button"
//                 onClick={() => removeFile(file.name)}
//               ></button>
//               <p>{file.name}</p>
//             </li>
//           ))}
//         </ul>
//       </section>
//       <button type="submit">eerr</button>
//     </form>
//   );
// };

// export default Previews;
