import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../../images/logo.png";

const AfterEmail = ({ handleLogin, token }) => {
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

    axios.post(`${process.env.REACT_APP_BASE_URL}/register`, Object.fromEntries(formEntries))
    .then((response) => {
      alert(response.data.message);
    })
    .catch((error) => {
      console.log(error)
      alert(error.response.data.message);
    });
  };

  if(localStorage.getItem('token')){
    navigate('/Dash');
  }

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
            <h1>Registration</h1>
            <p>
              Welcome to Academate. Please <br /> Register for an account.
            </p>
          </div>
    <form onSubmit={handleSubmit}>
    {/* email, name, contact, branch, batch, password, collegeId, confirmPassword */}
      <div className="form">
        <div className="mb-3">
          <label for="email" className="form-label">
            Email Id
          </label>

          <input
            name="email"
            onChange={handleChange}
            type="text"
            className="form-control"
            id="email"
          />
        </div>
        <div className="mb-3">
          <label for="collegeId" className="form-label">
          College ID
          </label>

          <input
            name="collegeId"
            onChange={handleChange}
            type="text"
            className="form-control"
            id="collegeId"
          />
        </div>
        <div className="mb-3">
          <label for="name" className="form-label">
          name
          </label>

          <input
            name="name"
            onChange={handleChange}
            type="text"
            className="form-control"
            id="name"
          />
        </div>
        <div className="mb-3">
          <label for="contact" className="form-label">
          contact
          </label>

          <input
            name="contact"
            onChange={handleChange}
            type="text"
            className="form-control"
            id="contact"
          />
        </div>
        <div className="mb-3">
          <label for="branch" className="form-label">
          Branch
          </label>

          <input
            name="branch"
            onChange={handleChange}
            type="text"
            className="form-control"
            id="branch"
          />
        </div>
        <div className="mb-3">
          <label for="batch" className="form-label">
          Year Of Passing
          </label>

          <input
            name="batch"
            onChange={handleChange}
            type="text"
            className="form-control"
            id="batch"
          />
        </div>
        <div className="mb-3">
          <label for="password" className="form-label">
            Password
          </label>
          <input
            name="password"
            onChange={handleChange}
            type="password"
            className="form-control"
            id="password"
          />
        </div>
        <div className="mb-3">
          <label for="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            name="confirmPassword"
            onChange={handleChange}
            type="password"
            className="form-control"
            id="confirmPassword"
          />
        </div>
        <div className="error-message danger">{errorMessage}</div>
        <button type="submit" className="btn">
          <strong>Register</strong>
        </button>
      </div>
    </form>
    </div>
        <div className="foot mt-3">
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

export default AfterEmail;
