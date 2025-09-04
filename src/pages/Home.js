import "./Home.css";

import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // If user already logged in, redirect to notes
    const user_id = localStorage.getItem("user_id");
    if (user_id) {
      navigate("/notes");
    }
  }, [navigate]);

  return (
    <div className="home-container">
      <h2>Welcome to Simple Notes App</h2>
      <p>Please choose an option:</p>
      <div className="home-buttons">
        <Link to="/login"><button>Login</button></Link>
        <Link to="/register"><button>Register</button></Link>
      </div>
    </div>
  );
};

export default Home;
