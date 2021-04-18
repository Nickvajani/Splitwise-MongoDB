import React, { Fragment, useState,useEffect } from 'react';
import Message from './Message';
import Progress from './Progress';
import axios from 'axios';
import axiosInstance from "../helpers/axios"

const FileUpload = (props) => {
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [fileNameFromProps, setFileNameFromProps] = useState("");

  useEffect(() => {
    if (props.imageName != "") {
      const filePath = props.imageName;
      setFileNameFromProps(filePath);
    }
  });
 

  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);


  
    try {
      const res = await axiosInstance.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          user: JSON.parse(localStorage.getItem("user"))?.u_id,
        },
      }).then((response)=>{
        console.log(response.data)
        const fileName= response.data
        const filePath  = response.data;
        console.log(fileName)
        console.log(filePath)
        setUploadedFile({ fileName, filePath });
      });
      
      // setMessage('File uploaded');
    } catch(err) {
      console.log(err)
      if(err.response.status === 500) {
        setMessage('There was a problem with the server');
      } else {
        setMessage(err.response.data.msg);
      }
    }
  }

  return (
    <Fragment>
      { message ? <Message msg={ message } /> : null }
      <form onSubmit={onSubmit} >
      {uploadedFile ? (
          <div className="row mt-5">
            <div className="col-md-6 m-auto"></div>
            {/* <h3 classNAme="text-center">{ uploadedFile.fileName }</h3> */}
            {/* {<img style={{ width: '50%' }} src={'/uploads/'+props.imageName} />} */}

            {uploadedFile.filePath ? (
              <img
                style={{ width: "50%" }}
                src={uploadedFile.filePath}
                alt=""
              />
            ) : (
              <img style={{ width: "50%" }} src={fileNameFromProps} alt="" />
            )}
          </div>
        ) : null}
      
      
        <div className="custom-file mb-4">
          <input
            type="file"
            className="custom-file-input"
            id="customFile"
            onChange={onChange}
          />
          <label className='custom-file-label' htmlFor='customFile'>
            {filename}
          </label>
        </div>

        {/* <Progress percentage={ uploadPercentage } /> */}

        <input
          type="submit"
          value="Upload"
          className="btn btn-primary btn-block mt-4"
        />
      </form>
    
    </Fragment>
  );
};

export default FileUpload;