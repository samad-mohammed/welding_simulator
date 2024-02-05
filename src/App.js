import "./App.css";
import Header from "./components/Navbar";
import { useState } from "react";
import Home from "./components/Home";
import Alert from "./components/Alert";
import Login from "./components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadBook from "./components/UploadBook";
import StudentApp from "./components/StudentApp";
import InstructorComp from "./components/InstructorComp";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoutes from "./components/PublicRoutes";
import Dashboard from "./components/Dashboard";

import AdminLogin from "./components/AdminLogin";
import AdminRegister from "./components/AdminRegister";
import NoPage from "./components/NoPage";
import UploadImage from "./components/UploadImage";
import ShowImage from "./components/ShowImage";
import RegistrationForm from "./components/RegistrationForm";
import AdminAccess from "./components/AdminAccess";
import StudentActivity from "./components/StudentActivity";

import { Button, notification, Space } from 'antd';


function App() {

  const [alert, setAlert] = useState(null);
  const [auth, setAuth] = useState(false);


  const isAdmin = localStorage.getItem("admin");
  const isUser = localStorage.getItem("user");
  const myArmyId = localStorage.getItem("user");

  const notify = (message,type,desc) => {
    notification[type]({
      message: message,
      description:
        desc,
    });
  };
  document.body.style = "background:#bcc2c5f8";
  return (
    <div
      className="App"
      style={{
        color: "white" ,
      }}
    >
      <Router>
        <Header
          title="Edgeforce Solutions"
         
          // toggleMode={toggleMode}
          notify={notify}
        />
        <Alert alert={alert} />

        <Routes>
          {/** Protected Routes */}
          {/** Wrap all Route under ProtectedRoutes element */}
          <Route path="/" element={<Home />} />


          <Route path="/" element={<AdminAccess />}>
            <Route
              path="/uploads"
              element={<InstructorComp notify={notify} />}
            />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>


          <Route path="/" element={<PrivateRoute />}>
            <Route path="/books" element={<StudentApp />} />
            <Route path="/activity" element={myArmyId && <StudentActivity myArmyId={myArmyId} />}/>
          </Route>


          <Route
            path="/admin"
            element={<AdminLogin notify={notify} />}
          />
          <Route
            path="/adminregister"
            element={<AdminRegister notify={notify} />}
          />
          <Route
            path="/login"
            element={<Login notify={notify} />}
          />

          <Route path="/register" element={<RegistrationForm  notify={notify} />} />
          <Route path="/upim" element={<UploadImage  notify={notify} />} />
          <Route path="*" element={<NoPage />} />
          {/* <Route
            path="/show"
            element={myArmyId && <ShowImage myArmyId={myArmyId} />}
          /> */}
        </Routes>
        {/* <Footer/> */}
      </Router>
    </div>
  );
}

export default App;
