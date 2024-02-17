import React, { useState } from "react";
import logo from "../images/logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../tushar/login.css";
import AfterEmail from "./components/AfterEmail";

const Registration = ({ handleLogin, token }) => {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");
  const [alumni, setAlumni] = useState("");

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

    console.log(formEntries)
    axios.post(`${process.env.REACT_APP_BASE_URL}/emailCheck`, Object.fromEntries(formEntries))
    .then((response) => {
      if(Number(response.data.alumni)==1){
        alert(response.data.message);
        window.open('/login','_self')
      }
      else{
        window.open('/newregistration','_self')
        setAlumni(response.data.alumni)
      }
    })
    .catch((error) => {
      console.log(error)
      setAlumni(error.response.data.alumni)
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
                
                  <div className="error-message danger">{errorMessage}</div>
                  <button type="submit" className="btn">
                    <strong>Create Account</strong>
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

export default Registration;