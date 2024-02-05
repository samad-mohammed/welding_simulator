import React, { useState } from "react";
import { Form, Input, Button, message, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

const API_URL = "http://192.168.1.108:5000"; // Replace with your actual API URL

const AdminRegister = ({notify  }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      const response = await Axios.post(`${API_URL}/register`, values);
      if (
        response.data &&
        response.data.message === "Registration successful"
      ) {
        message.success("Registration successful");
        navigate("/admin");
        form.resetFields();
      } else {
        message.error("Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      message.error("Registration failed. Please try again.");
    }
  };

  return (
    <div
      className="container-fluid"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        marginTop: "-40px",
      }}
    >
      <div className="formbox">
        <Form
          form={form}
          onFinish={onFinish}
          layout="horizontal"
          name="complex-form"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          style={{paddingLeft:'20px'}}
        >
          <img
            src="icon.png" // Replace with the actual logo image URL
            alt="Company Logo"
            style={{ width: "60px", height: "60px", marginTop: "20px" }}
          />
          <h3>Admin Registration</h3>
          <Form.Item
            label={
              <label style={{ color: "white", padding: "5px", paddingRight:'18px'}}>
                Username    {" "}
              </label>
            }
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input placeholder="Username"/>
          </Form.Item>
          <Form.Item
            label={
              <label style={{ color: "white", padding: "5px", paddingRight:'25px' }}>
                Army ID {" "}
              </label>
            }
            name="armyId"
            rules={[{ required: true, message: "Please enter your Army ID" }]}
          >
            <Input placeholder="Army ID"/>
          </Form.Item>
          <Form.Item
            label={
              <label style={{ color: "white", padding: "5px" }}>
                Batch Number  {" "}
              </label>
            }
            name="batchNo"
            rules={[
              { required: true, message: "Please enter your Batch Number" },
            ]}
          >
            <Input placeholder="Batch Number"/>
          </Form.Item>
          <Form.Item
            label={
              <label style={{ color: "white", padding: "5px",paddingRight:'20px' }}>Password  </label>
            }
            name="setPassword"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Password"/>
          </Form.Item>
          <Form.Item
        wrapperCol={{ }}
      >
            <Button type="primary" htmlType="submit" >
              Register
            </Button>
          </Form.Item>
          <Divider style={{ color: "white" }}>
            Already an Admin ?{" "}
            <a style={{ color: "red" }} href="/admin">
              Login
            </a>
          </Divider>
        </Form>
      </div>
    </div>
  );
};

export default AdminRegister;
