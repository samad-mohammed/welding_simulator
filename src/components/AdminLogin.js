// import React, { useState, useEffect, setState, useParams } from "react";
// import { Button, Divider, Form, Input, message, Typography } from "antd";

// import "../App.css";
// import { Link, useHref } from "react-router-dom";
// // import Header3 from './Header3';
// import Axios from "axios";
// import { useNavigate } from "react-router-dom";
// const API_URL = "http://192.168.1.108:5000";
// const Adminlogin = ({ , notify }) => {
//   const [armyId, setmyArmyId] = useState("");
//   const [setPassword, setmyPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`${API_URL}/admin`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ armyId, setPassword }),
//       });

//       const data = await response.json();
//       if (data.message === "Login successful") {
//         localStorage.setItem("admin", true);
//         // localStorage.setItem('loggedIn', 'true'); // Set loggedIn flag in local storage
//         // Show success alert
//         notify("Successfully Logged in", "success");
//         navigate("/uploads");
//         window.location.reload();

//         // console.log(`User - ${myArmyId} logged in Successfully`);
//       } else {
//         console.log("Authentication failed");
//         // Show error alert
//         notify("Authentication failed", "danger");
//       }
//     } catch (error) {
//       alert("Error during Authentication");
//       console.error("Error during authentication:", error);
//     }
//   };
//   return (
//     <>
//       <div
//         className="container-fluid d-flex justify-content-center align-items-center vh-100"
//         style={{ marginTop: "-60px", backgroundColor: "#1d3b55" }}
//       >
//         {" "}
//         {/* Add top margin here */}
//         <div           style={{
//             width: "600px",
//             height: "500px",
//             backgroundColor:  === "dark" ? "#393f4d" : "#9cbfdd",
//             borderRadius: "10px",
//             boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
//             color:  === "dark" ? "white" : "black",
//           }}>
//             <img
//               src="icon.png" // Replace with the actual logo image URL
//               alt="Company Logo"
//               style={{ width: "60px", height: "60px", margin: "25px",  }}
//               />

//         <div
//           className="row justify-content-center align-items-center"

//           >
//           <div className="col-md-8">
//             <center>
//               <h3
//                 style={{
//                   color:  === "dark" ? "#F7C331" : "#002852",
//                   textDecoration: "underline",
//                   textDecorationColor: "green",
//                 }}
//                 >
//                 Admin Login
//               </h3>
//               <p
//                 className="m-3"
//                 style={{ color:  === "dark" ? "#F7C331" : "#002852" }}
//                 >
//                 <strong>Enter Your Credentials</strong>
//               </p>
//             </center>
//             <form>
//               <div className="form-group row">
//                 <label
//                   htmlFor="armyId"
//                   className="col-sm-auto col-form-label mr-2"
//                   >
//                   Army ID :
//                 </label>
//                 <div className="col-sm-12">
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="armyId"
//                     placeholder="Army ID"
//                     value={armyId}
//                     onChange={(e) => setmyArmyId(e.target.value)}
//                     />
//                 </div>
//               </div>
//               <div className="form-group row">
//                 <label
//                   htmlFor="setPassword"
//                   className="col-sm-auto col-form-label"
//                   >
//                   Password :
//                 </label>
//                 <div className="col-sm-12">
//                   <input
//                     type="password"
//                     className="form-control"
//                     id="setPassword"
//                     placeholder="Password"
//                     value={setPassword}
//                     onChange={(e) => setmyPassword(e.target.value)}
//                     />
//                 </div>
//               </div>

//               <div className="form-group row">
//                 <div className="col-sm-8 offset-sm-2">
//                   <button
//                     type="submit"
//                     className="btn btn-primary"
//                     onClick={handleLogin}
//                     >
//                     Login
//                   </button>
//                 </div>
//               </div>
//             </form>
//             <Divider style={{ color:  === "dark" ? "white" : "black" }}>
//               {" "}
//               Don't have an account ?{" "}
//               <a style={{ color: "red" }} href="/adminregister">
//                 Register
//               </a>
//             </Divider>
//           </div>
//         </div>
//                     </div>
//       </div>
//     </>
//   );
// };

// export default Adminlogin;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "./Alert";
import { Form, Input, Button, message, Divider } from "antd";
import Axios from "axios";

const API_URL = "http://192.168.1.108:5000";

const Login = ({  setAuth, notify }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      const response = await Axios.post(`${API_URL}/admin`, values);
      if (response.data && response.data.message === "Login successful") {
        
        navigate("/uploads");
        notify("Login Successful", 'success', '');
        setTimeout(() => {
          window.location.reload()
          
        }, 3000);

        localStorage.setItem("admin", true);
        form.resetFields();
      } else {
        notify("Login Failed", 'error','Enter valid credentials')
      }
    } catch (error) {
      // console.error("Error during login:", error);
      notify("Login Failed", 'error','Please try again')
    }
  };

  return (
    <div
      className="main d-flex align-items-center justify-content-center vh-100 back"
      style={{ margin: "-50px" }}
    >
      <div className="formbox">
        <Form
          form={form}
          onFinish={onFinish}
          layout="horizontal"
          name="complex-form"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
        >
          <img
            src="icon.png" // Replace with the actual logo image URL
            alt="Company Logo"
            style={{ width: "60px", height: "60px", marginTop: "40px" }}
          />
          <h3>Admin Login</h3>

          <Form.Item
            label={
              <label style={{ color: "white", padding: "5px" }}>Army ID</label>
            }
            name="armyId"
            rules={[{ required: true, message: "Please enter your Army ID" }]}
          >
            <Input placeholder="Army ID"/>
          </Form.Item>

          <Form.Item
            label={<label style={{ color: "white", padding : '5px' }}>Password</label>}
            name="setPassword"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Password"/>
          </Form.Item>
          <Form.Item wrapperCol={{}}>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
          <Divider style={{ color: "white" }}>
            Don't have an account ?{" "}
            <a style={{ color: "red" }} href="/adminregister">
              Register 
            </a>
          </Divider>
        </Form>
      </div>
    </div>
  );
};

export default Login;
