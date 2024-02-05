import React, { useState, useEffect } from 'react';

const UploadImage = () => {
  const [file, setFile] = useState(null);

  // Fetch myArmyId from localStorage
  const myArmyId = localStorage.getItem('user');

  useEffect(() => {
    // You can perform any additional operations with myArmyId here if needed
    console.log('myArmyId:', myArmyId);
  }, [myArmyId]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileSubmit = () => {
    if (!file) {
      alert('Please select a file', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('myArmyId', myArmyId);

    fetch('http://192.168.1.108:5000/upload_image', {
      method: 'POST',
      body: formData,
  // Include credentials to send cookies with the request
    })
      .then(response => response.json())
      .then(data => {
        console.log('Response from server:', data);
        alert(data.message, 'success');
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        alert('Error uploading file', 'error');
      });
  };

  return (
    <div className="container p-3 d-flex flex-column align-items-center">
      <h1 className="display-6">Upload Image</h1>
      <div className="m-3" style={{ width: '400px' }}>
        <input
          className="form-control mt-4"
          onChange={handleFileChange}
          type="file"
        />
        <button className="btn btn-warning my-3" onClick={handleFileSubmit}>
          Submit File
        </button>
      </div>
      <div className="p-2"></div>
    </div>
  );
};

export default UploadImage;
