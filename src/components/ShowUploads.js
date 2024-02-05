import React, { useState, useEffect } from "react";
import { Modal } from "antd";

const ShowUploads = ({ notify }) => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    fetch("http://192.168.1.108:5000/get-files")
      .then((response) => response.json())
      .then((data) => {
        // console.log("Response from server:", data);

        if (data && data.files) {
    
          setFiles(data.files);
        } else {
          console.error("Invalid response format:", data);
        }
      })
      .catch((error) => console.error("Error fetching files:", error));
  }, []);
  
const handleDelete = (fileId) => {
  Modal.confirm({
    title: 'Confirm Deletion',
    content: 'Are you sure you want to delete this file?',
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    onOk: () => {
      fetch(`http://192.168.1.108:5000/delete-file/${fileId}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          notify(data.message, "success");
          // Update the list of files after a successful delete
          setFiles(files.filter((file) => file.id !== fileId));
        })
        .catch((error) => {
          alert("Error deleting file", "error");
        });
    },
    onCancel: () => {
      // Do nothing if user cancels
    },
  });
};
  const openFileInNewTab = (fileId) => {
    fetch(`http://192.168.1.108:5000/get-file/${fileId}`)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);

        // Open a new tab with the Blob URL
        window.open(blobUrl, "_blank");
      })
      .catch((error) => console.error("Error fetching file:", error));
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
    <div className="mt-5 container  vh-100">
      <div className="text-center">
        <table
          className={`table table-dark table-striped table-bordered table-hover
        `}
          style={{
            border: "10px solid black",
            color: "white",
          }}
        >
          <thead className={`thead-light`}>
            <tr>
              <th>Instructor Name</th>
              <th>Book Name</th>
              <th>View</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.filename}>
                <td>{file.instructor_name}</td>
                <td>{file.book_name}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => openFileInModal(file.id)}
                  >
                    View
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(file.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
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

export default ShowUploads;
