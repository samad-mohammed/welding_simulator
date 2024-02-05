

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "./Alert";
import { Form, Input, Button, message, Divider,notification } from "antd";
import Axios from "axios";


const API_URL = "http://192.168.1.108:5000";

const Login = ({ setAuth,notify }) => {
  const [myArmyId, setmyArmyId] = useState("");
  const [myPassword, setmyPassword] = useState("");
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const onFinish = async (values) => {

    try {
      const response = await Axios.post(`${API_URL}/login`, values);
      if (
        response.data &&
        response.data.message === "Login successful"
        ) {

          // message.success("Login successful");
          
          localStorage.setItem("user", values.myArmyId);
          notify("Login Successful", 'success', '');
          navigate("/");

          setTimeout(() => {
            window.location.reload()
            
          }, 3000);
        // console.log(values)
        
        form.resetFields();
      } else {

        notify("Login Failed", 'error','Enter valid credentials')
      }
    } catch (error) {
      // console.error("Error during login:", error);
      notify("Login Failed", 'error','Please try again')
      // message.error("Login failed. Please try again.");
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100 back"
      style={{ margin: "-50px", }}
    >
      <div className='formbox'>
        <Form style={{padding:'30px'}}
          form={form}
          onFinish={onFinish}
          layout="horizontal" name="complex-form"  labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}
        >
          <img
          src="icon.png"  // Replace with the actual logo image URL
          alt="Company Logo"
          style={{ width: '60px', height: '60px', marginTop: '40px' }}
        />
          <h3>
            Student Login
          </h3>

          <Form.Item
            label={<label style={{ color: "white", padding : '5px' }}>Army ID</label>}
            name="myArmyId"
            // style={{color:'red'}}
            rules={[{ required: true, message: "Please enter your Army ID" }]}
            >
            <Input placeholder="Army ID"/>
          </Form.Item>

          <Form.Item
            label={<label style={{ color: "white", padding : '5px' }}>Password</label>}
            // label="Password"
            name="mySetPassword"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="password"/>
          </Form.Item>
          <Form.Item
        wrapperCol={{ }}
      >
            <Button type="primary" htmlType="submit" >
              Login
            </Button>
          </Form.Item>
          <Divider style={{ color: "white" }}>
            Don't have an account ?{" "}
            <a style={{ color: "red" }} href="/register">
              Register
            </a>
          </Divider>
        </Form>
      </div>
    </div>
  );
};

export default Login;
