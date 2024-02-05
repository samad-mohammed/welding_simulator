import React, { useState, useEffect } from "react";
import { Modal, Button } from "antd";


const ShowImage = ({ myArmyId }) => {
  const [dataList, setDataList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!myArmyId) {
      console.error("myArmyId is undefined or null");
      return;
    }

    // Fetch all existing image paths along with myArmyId and myName
    fetch(`http://192.168.1.108:5000/get_image_paths?myArmyId=${myArmyId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.dataList) {
          setDataList(data.dataList);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [myArmyId]);

  const firstItemMyName = dataList.length > 0 ? dataList[0].myName : "N/A";

  const handleImageClick = (imagePath) => {
    setSelectedImage(imagePath);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const imageCount = dataList.length;

  return (
    <div className="container p-3" style={{ color: "white" }}>
      <h1 className="display-6">
         My Activity 
      </h1>
      <div className="container  mt-5 mb-5" style={{textAlign: 'left' }}>
      <p> <strong>  Name : </strong>{firstItemMyName} </p>
      <p>  <strong> Army ID :</strong> ({myArmyId}) </p>
      <p> <strong>  Image Count :</strong> {imageCount}</p>
      </div>
      {imageCount > 0 ? (
        <>


          {/* Table : Image Details */}
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {dataList.map((data, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
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
                  <td>{/* Score column, add your logic here */}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Modal
        visible={modalVisible}
        onCancel={handleModalClose}
        footer={null}
        centered
        width="80%"
        height="80%"
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

export default ShowImage;
