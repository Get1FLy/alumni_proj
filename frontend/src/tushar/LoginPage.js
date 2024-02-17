import React, { useState } from "react";
import logo from "../images/logo.png";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";
import "./login.css";

const LoginPage = ({ handleLogin, token }) => {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  function handleSubmit (event){
    event.preventDefault();

    const formEntries = new FormData(event.target);

    // Make a POST request to your backend login route
    axios.post(`${process.env.REACT_APP_BASE_URL}/login`, Object.fromEntries(formEntries))
      .then((response) => {
        const { token } = response.data;
        localStorage.setItem('token', token);
        alert('Logged In Successful')
        window.location.reload();
      })
      .catch((error) => {
        alert('Login failed. Please check your credentials.');
      });
  };


  return ( 
    <div className="mycontainer">
    <div className="container-fluid">
     
    <div className="row">
      <div className="col-lg-6 col-md-12 left">
        <div className="sub-left">
          <img src={logo} alt="GetFly logo" />
          <h1>
            <strong>
              Vasantdada Patil Pratishthan's <br />
              College of Engineering &amp; Visual Arts
            </strong>
          </h1>
        </div>
      </div>

      <div className="col-lg-6 col-md-12 right">
        <div className="sub-right">
          <div className="right-login">
            <h1>Login</h1>
            <p>
              Welcome to Academate. Please <br /> login to your account.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form">
              <div className="mb-3">
                <label for="email" className="form-label">
                  Email Id
                </label>

                <input
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                  type="text"
                  className="form-control"
                  id="email"
                />
              </div>
              <div className="mb-3">
                <label for="password" className="form-label">
                  Password
                </label>
                <input
                  name="password"
                  onChange={handleChange}
                  value={formData.password}
                  type="password"
                  className="form-control"
                  id="password"
                />
              </div>
              <div className="error-message danger">{errorMessage}</div>
              <h6>Don't Have Account <Link to="/registration">Click Here</Link></h6>
              <button type="submit" className="btn">
                <strong>Login</strong>
              </button>
            </div>
          </form>
        </div>
        <div className="foot">
          <p>
            <strong>www.getflytechnologies.com</strong>
          </p>
        </div>
      </div>
    </div>
  </div>
    </div>
  
  );
};

export default LoginPage;
