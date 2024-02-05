
import React, { useState, useEffect } from "react";
import { Modal } from "antd";

const StudentApp = (props) => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = () => {
    fetch("http://192.168.1.108:5000/get-files")
      .then((response) => response.json())
      .then((data) => {
        if (data && data.files) {
          setFiles(data.files);
        } else {
          console.error("Invalid response format:", data);
        }
      })
      .catch((error) => console.error("Error fetching files:", error));
  };

  const openFileInModal = (fileId) => {
    fetch(`http://192.168.1.108:5000/get-file/${fileId}`)
      .then((response) => response.blob())
      .then((blob) => {
        setSelectedFile(URL.createObjectURL(blob));
        setModalVisible(true);
      })
      .catch((error) => console.error("Error fetching file:", error));
  };

  const handleModalClose = () => {
    setSelectedFile(null);
    setModalVisible(false);
  };

  return (
    <div className="container">
      <h1 className="display-6 mt-5" style={{ marginBottom: '50px' }}>Books</h1>
      <div className="row">
        {files.map((file) => (
          <div key={file.id} className="col-md-3 col-sm-6 mb-3" style={{ color: 'white' }}>
            <div className={'card'}>
              <div className="card-header" >
                <strong>{file.book_name}</strong>
              </div>
              <div className="card-body">
                {/* Make the image a clickable link */}
                <img
                  src="book_icon.png"
                  alt="Book Cover"
                  className="img-fluid"
                  width='100%'
                  height='100%'
                  
      
                  style={{ cursor: "pointer", objectFit: 'cover' }}
                  onClick={() => openFileInModal(file.id)}
                />
              </div>
              <div className="card-footer">
                <small>uploaded by: </small> {file.instructor_name}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal to display file content */}
      <Modal
        open={modalVisible}
        onCancel={handleModalClose}
        footer={null}
        centered
        width="80%"
        height="98%"
        closeIcon={<span style={{ position: 'absolute', top: '-14px', right: '-14px', cursor: 'pointer', fontSize: '17px', width:'20px',  color:'black',borderRadius: '40%',textAlign: 'center'}}>X</span>}
      >
        <iframe title="File Preview" src={selectedFile} style={{ width: "100%",  height: "90vh", maxHeight: "100vh" }}></iframe>
      </Modal>
    </div>
  );
};

export default StudentApp;

