  import "./Login.css";
  import loginImage from "../../Assets/img/loginimage.svg";
  import React, { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";

  const Login = () => {
    const navigate = useNavigate(); // Hook for navigation
    const [token, setToken] = useState(null);
    const [loginData, setLoginData] = useState({
      phone: "",
      password: "",
    });
    const [error, setError] = useState(null);

    const handleFormSubmitLogin = async (event) => {
      event.preventDefault();
    }
    // Move useEffect outside of handleLogin
    useEffect(() => {
      // Check if an authentication token is already stored in localStorage
      const storedToken = localStorage.getItem("authToken");
      if (storedToken) {
        setToken(storedToken);
        navigate("/"); // Navigate to the Monitoring page
      }
    }, [navigate]);

    const handleLogin = async () => {
      try {
        const { phone, password } = loginData;

        // Trim input values
        const trimmedPhone = phone.trim();
        const trimmedPassword = password.trim();

        const response = await fetch(
          "http://188.225.10.97:8080/api/v1/auth/login/admin",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              phone: trimmedPhone,
              password: trimmedPassword,
            }),
          }
        );

        const data = await response.json();
        if (!response.ok) {
          if (response.status === 404) {
            setError(
              "Admin topilmadi. Iltimos, telefon raqamingizni yoki Parol tekshiring."
            );
          } else {
            setError(data.errorMessage || "Login failed");
          }
          return;
        }

        const authToken = data.token;
        localStorage.setItem("authToken", authToken);
        setToken(authToken);

        navigate("/");
      } catch (error) {
        console.error("Login failed:", error.message);
        setError("An unexpected error occurred. Please try again.");
      }
    };

    const handleLogout = () => {
      localStorage.removeItem("authToken");
      setToken(null);
    };

    return (
      <div>
        {token ? (
          <div>
            <p>User is logged in</p>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <div className="wrapper-login">
            
            <img src={loginImage} alt="image" width={500} height={500} />
            <form className="form-login" onSubmit={handleFormSubmitLogin}>

            <p className="useer-msg">Foydalanuvchi tizimga kirmagan</p>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <label className="label-phone">
              Telefon raqamingizni:
              <input
                className="phone-input"
                type="text"
                value={loginData.phone}
                onChange={(e) =>
                  setLoginData({ ...loginData, phone: e.target.value.trim() })
                }
              />
            </label>
            <br />
            <label>
              Parol:
              <input
                className="password-input"
                type="password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value.trim() })
                }
              />
            </label>
            <br />
            <button className="login-btn" onClick={handleLogin}>
              Login
            </button>
            </form>
          </div>
        )}
      </div>
    );
  };

  export default Login;

