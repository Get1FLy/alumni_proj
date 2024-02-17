import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import ProtectedPage from "./ProtectedPage";
import Register from "./tushar/LoginPage";
import Dashboard from "./pages/Dashboard";
import Registration from "./Registration/RegistrationPage";
import NoduesForm from "./nodeusForm/Nodues";
import { Navbar } from "./pages/Navbar";
import AfterEmail from "./Registration/components/AfterEmail";

function App() {
  const [token, setToken] = useState("");

  const handleLogin = (newToken) => {
    // Set the token in the state when the user logs in
    setToken(newToken);
  };

  const handleLogout = () => {
    // Clear the token from the state when the user logs out
    setToken("");
    // Clear the token from local storage as well (optional)
    window.localStorage.removeItem("token");
  };

  

  return (
    <Router>
      <div>

        

        {
           localStorage.getItem('token')?
           <Navbar/>:<></>
        }
        <Routes>
         {
           localStorage.getItem('token')?
           <>
           <Route
              path="/"
              element={<Dashboard handleLogin={handleLogin} token={token} />}
            />
            <Route
              path="/NoduesForm"
              element={<NoduesForm handleLogin={handleLogin} token={token} />}
            />
            <Route
              path="/*"
              element={<h4 className="container text-center">404, Page Not Found</h4>}
            />
           </>
           :
          <>
          <Route
            path="/login"
            element={<Register handleLogin={handleLogin} token={token} />}
          />
          <Route
            path="/registration"
            element={<Registration handleLogin={handleLogin} token={token} />}
          />
          <Route
            path="/newregistration"
            element={<AfterEmail handleLogin={handleLogin} token={token} />}
          />
          </>
         }
          
          {
            localStorage.getItem('isLogin')=='true'?
            <>
            <Route
            path="/Dash"
            element={
              <Dashboard token={token} handleLogout={handleLogout} />
            }
          />
            </>
            :
            <Route
            path="*"
            element={<Register handleLogin={handleLogin} token={token} />}
          />
          }
                  
        </Routes>
      </div>
    </Router>
  );
}

export default App;
