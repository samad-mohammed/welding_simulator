import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = (props) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("admin");

  useEffect(() => {
    const userLoggedIn = localStorage.getItem("user") !== null;
    setLoggedIn(userLoggedIn);
  }, []);

  return (
    <div style={{ color: "blue" }}>
      <div
        className="container-fluid d-flex align-items-center justify-content-between vh-100 font-weight-normal m-0"
        style={{ backgroundColor: "#000000", color: "white" }}
      >
        <div className="text-center" style={{ width: "50%", padding: "20px" }}>
          {(loggedIn || isAdmin) ? (
            isAdmin ? (
              <>
                <h1
                  className="display-4 font-weight-normal mb-2"
                  style={{ color: "#F7C331" }}
                >
                  Welcome, Admin!
                </h1>
                <strong style={{ color: "white" }}>
                  You can check the students' activity{" "}
                  <Link to="/dashboard" style={{ color: "#F7C331" }}>
                    here
                  </Link>
                </strong>
              </>
            ) : (
              <>
                <h1
                  className="display-4 font-weight-normal mb-2"
                  style={{ color: "#F7C331" }}
                >
                  Welcome, User!
                </h1>
                <strong style={{ color: "white" }}>
                  You can check the books{" "}
                  <Link to="/books" style={{ color: "#F7C331" }}>
                    here
                  </Link>
                </strong>
              </>
            )
          ) : (
            <>
              <h1
                className="display-4 font-weight-normal mb-2"
                style={{ color: "#F7C331" }}
              >
                Welcome to Edgeforce Solutions
              </h1>
              <p
                className="lead font-weight-normal m-3"
                style={{ color: "white" }}
              >
                To get started with Welding Simulator, please login.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="btn btn-primary my-1"
              >
                <strong>Login</strong>
              </button>
              <p className="my-3 " style={{ color: "white" }}>
                If you are a new user, Please{" "}
                <Link style={{ color: "red", marginLeft: "5px" }} to="/register">
                  Register
                </Link>
              </p>
            </>
          )}
        </div>
        <div className="right" style={{ width: "50%" }}>
          <img src="welding_img.jpg" width="100%" height="100%" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Home;
