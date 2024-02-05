import {Alert} from 'antd';
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal } from 'antd';
const Header = ({ toggleMode, notify }) => {
  const navigate = useNavigate();

  const hoverStyle = {
    color: "#ffa500",
    textDecoration: "underline",
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);

  useEffect(() => {
    const userInLocalStorage = localStorage.getItem("user");
    const adminInLocalStorage = localStorage.getItem("admin");

    setIsLoggedIn(userInLocalStorage);
    setAdminLoggedIn(adminInLocalStorage);
  }, []);

  const handleLogout = () => {
    const userInLocalStorage = localStorage.getItem("user");
    const adminInLocalStorage = localStorage.getItem("admin");

    // Do not perform logout if not logged in
    if (!userInLocalStorage && !adminInLocalStorage) {
      return;
    }

    // Show a confirmation modal
    Modal.confirm({
      title: "Logout Confirmation",
      content: "Are you sure you want to logout?",
      onOk: () => {
        // Clear the user or admin from localStorage on logout
        localStorage.removeItem(userInLocalStorage ? "user" : "admin");

        // Update the login status to reflect the logout
        if (userInLocalStorage) {
          setIsLoggedIn(false);
        } else if (adminInLocalStorage) {
          setAdminLoggedIn(false);
        }

        // Show a success alert
        // notify("Logged out successfully", userInLocalStorage ? "success" : "warning");

        // Redirect the user to the home page after logout
        navigate("/");

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      onCancel: () => {
        // Handle cancel if needed
      },
    });
  };

  // const handleLogout = () => {
  //   // Check if there is a user or admin in local storage
  //   const userInLocalStorage = localStorage.getItem("user");
  //   const adminInLocalStorage = localStorage.getItem("admin");

  //   if (userInLocalStorage) {
  //     // Show a confirmation alert
  //     const confirmed = window.confirm("Are you sure you want to logout ?");
  //     if (confirmed) {
  //       // Clear the user from localStorage on logout
  //       localStorage.removeItem("user");
  //       // Update the login status to reflect the logout
  //       setIsLoggedIn(false);
  //       // Show a success alert
  //       navigate("/");
  //       notify("Logged out successfully", "success");
  //       // Redirect the user to the home page after logout

  //       setTimeout(() => {
  //         window.location.reload();
          
  //       }, 2000);
  //     }
  //   } else if (adminInLocalStorage) {
  //     // Show a confirmation alert
  //     const confirmed = window.confirm("Are you sure you want to logout?");
  //     if (confirmed) {
  //       // Clear the admin from localStorage on logout
  //       localStorage.removeItem("admin");
  //       // Update the login status to reflect the logout

  //       setAdminLoggedIn(false);
  //       // Show a success alert
  //       notify("Logged out successfully", "warning");
  //       // Redirect the user to the home page after logout
  //       navigate("/");
  //     }
  //   } else {
  //     // Show a disabled logout alert since there is no user or admin in local storage
  //     notify("You're not logged in", "error",'Please login using valid credentials');
  //     // <Alert message="Success Tips" type="error" showIcon />
    
  //     navigate("/");
  //   }
  // };

  return (
    <nav
      className={`navbar navbar-expand-lg `}
      style={{ backgroundColor:  "white"  }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand">
          <div className="image-container">
            <img
              src="../edgeforce_icon.png"
              height="50"
              width="250"
              alt="Logo"
              className="image-with-shadow"
              style={{  marginRight:'50px'}}
            />
          </div>
        </Link>

        {/* Hamburger button for small screens */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <img
            src="../ham-icon.png"
            alt="Hamburger Icon"
            width="30"
            height="30"
            style={{ filter:  "invert(0%)" }}
            
          />
        </button>

        <div className="collapse navbar-collapse  " id="navbarNav">
          <ul className="navbar-nav  me-auto mb-2 mb-lg-0 ms-auto">
            <li className="nav-item">
              <Link className="nav-link hoverStyle" to="/">
                Home
              </Link>
            </li>
            {adminLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link hoverStyle" to="/uploads">
                    Instructor
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link hoverStyle" to="/dashboard">
                    Dashboard
                  </Link>
                </li>
                
              </>
            )}
            {(isLoggedIn  && 
      
              <>
                <li className="nav-item">
                  <Link className="nav-link hoverStyle" to="/activity">
                    Activity
                  </Link>
                </li>
              </>
            )}
            {(isLoggedIn || adminLoggedIn) && (
              <>

                <li className="nav-item">
                  <Link className="nav-link hoverStyle" to="/books">
                    Books
                  </Link>
                </li>
            <li className="nav-item">
              <Link
                className="nav-link hoverStyle"
                id="logout-btn"
                onClick={handleLogout}
                disabled={!isLoggedIn || adminLoggedIn}
              >
                <strong>Logout</strong>
              </Link>
            </li>
              </>
            )}

            {(!isLoggedIn && !adminLoggedIn) && (
              <>
                <li className="nav-item">
                  <Link className="nav-link hoverStyle" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link hoverStyle" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
    
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
