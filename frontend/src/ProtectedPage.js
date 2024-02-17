import React from "react";
import { useNavigate } from "react-router-dom";

function ProtectedPage({ token }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the token from local storage
    window.localStorage.removeItem("token");

    // Show a logout message (optional)
    alert("Logged out successfully.");

    // Navigate to the login page
    navigate("/login");
  };

  if (!token) {
    return <p>You must log in to access this page.</p>;
  }

  return (
    <div>
      <h2>Protected Page</h2>
      <p>This page can only be accessed by authenticated users.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default ProtectedPage;
