import React, { useState, useEffect } from "react";
import { Modal, Input } from "antd";

const Dashboard = () => {
  const [dataList, setDataList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [totalStudents, setTotalStudents] = useState(0);
  const [searchName, setSearchName] = useState(""); // New state for name filter

  useEffect(() => {
    // Fetch total number of students
    fetch("http://192.168.1.108:5000//get_total_students")
      .then((response) => response.json())
      .then((data) => {
        if (data && data.totalStudents) {
          setTotalStudents(data.totalStudents);
        }
      })
      .catch((error) => {
        console.error("Error fetching total students:", error);
      });

    // Fetch all student activity based on searchName
    const apiUrl = `http://192.168.1.108:5000/get_all_student_activity?name=${searchName}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.dataList) {
          setDataList(data.dataList);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [searchName]);

  const firstItemMyName = dataList.length > 0 ? dataList[0].myName : "N/A";
  const imageCount = dataList.length;

  const handleImageClick = (imagePath) => {
    setSelectedImage(imagePath);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleSearchChange = (e) => {
    setSearchName(e.target.value);
  };

  return (
    <div className="container p-3">
      <h1 className="display-6 mt-5">Student Performance Dashboard</h1>
      <div className="container mt-3 mb-5" style={{ textAlign: 'center' }}>
        <Input
          placeholder="Search by Student Name"
          value={searchName}
          onChange={handleSearchChange}
          style={{ width: '200px', margin:'5px', border:'2px solid blue', marginBottom:'18px' }}
        />
        <p><strong>Total number of Students:</strong> {totalStudents}</p>
        <p><strong>Image Count:</strong> {imageCount}</p>
      </div>
      {dataList.length > 0 && dataList[0].imagePath !== null ? (
        <>
          {/* Table: Image Details */}
          <table className="table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Student Name</th>
                <th>Result</th>
                <th>Score</th>
                <th >Date</th>
              </tr>
            </thead>
            <tbody>
              {dataList.map((data, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{data.myName}</td>
                  <td>
                    {data.imagePath && (
                      <img
                        src={data.imagePath.replace("public\\", "")}
                        alt={`Image ${index + 1}`}
                        style={{ width: "250px", height: "250px", cursor: "pointer" }}
                        onClick={() => handleImageClick(data.imagePath.replace("public\\", ""))}
                      />
                    )}
                  </td>
                  <td>999</td>
                  <td style={{ fontSize: "0.85em" }}>{data.created_at} </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Modal
            open={modalVisible}
            onCancel={handleModalClose}
            footer={null}
            centered
            width="80%"
            height="97%"
            closeIcon={<span style={{ position: 'absolute', top: '-14px', right: '-14px', cursor: 'pointer', fontSize: '17px', width:'20px',  color:'black',borderRadius: '40%',textAlign: 'center'}}>X</span>}
          >
            <img src={selectedImage} alt="Full-Screen Image" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </Modal>
        </>
      ) : (
        <p>No images available.</p>
      )}
    </div>
  );
};

export default Dashboard;
