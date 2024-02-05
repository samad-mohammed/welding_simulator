import React, { useState } from "react";
import { Form, Input, Button, Upload, message, Divider } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import reqwest from 'reqwest';

const UploadBook = ({notify}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append('file', values.file[0].originFileObj);
      formData.append('instructorName', values.instructorName);
      formData.append('bookName', values.bookName);

      const response = await reqwest({
        url: 'http://192.168.1.108:5000/upload-file',
        method: 'post',
        processData: false,
        data: formData,
      });

      // console.log("Response from server:", response);
      notify('File Uploaded Successfully','success',`${values.bookName} added to the books.` );
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    } catch (error) {
      // console.error("Error uploading file:", error);
      notify('Error Uploading File','error');
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const props = {
    onRemove: (file) => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
  };

  return (
    <div className=" p-3 mt-5 d-flex flex-column align-items-center">
      <h1 className="display-6 ">
        Upload a Book <small>(.pdf)</small>{" "}
      </h1>
      <div className="m-4" style={{ width: "510px" }}>
        <Form
          form={form}
          onFinish={onFinish}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            label={<strong><label style={{ padding: '5px' }}>Instructor Name</label></strong>}
            name="instructorName"
            rules={[{ required: true, message: "Please enter instructor name" }]}
          >
            <Input style={{ border: "2px solid black" }} />
          </Form.Item>

          <Form.Item
            label={<strong><label style={{ padding: '5px' }}>Book Name</label></strong>}
            name="bookName"
            rules={[{ required: true, message: "Please enter book name" }]}
          >
            <Input style={{ border: "2px solid black" }} />
          </Form.Item>

          <Form.Item
            label={<strong><label style={{ padding: '5px' }}>File</label></strong>}
            name="file"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Please upload a file" }]}
          >
            <Upload {...props} accept=".pdf" maxCount={1} >
              <Button  icon={<UploadOutlined  />}>Select File</Button>
            </Upload>
          </Form.Item>

          <Form.Item wrapperCol={{ }}>
            
            <Button
              type="primary"
              htmlType="submit"
              disabled={fileList.length === 0}>
              Submit File
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Divider />
    </div>
  );
};

export default UploadBook;
 