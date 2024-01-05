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
  };

  useEffect(() => {
    const checkTokenExpiration = () => {
      const storedToken = localStorage.getItem("authToken");
      if (storedToken) {
        const decodedToken = decodeToken(storedToken);

        // Check if the token is expired
        if (decodedToken.exp * 1000 < Date.now()) {
          // Token expired, navigate to login page
          localStorage.removeItem("authToken");
          setToken(null);
          navigate("/");
        } else {
          // Token still valid, set it in the state
          setToken(storedToken);
        }
      }
    };

    const decodeToken = (token) => {
      try {
        return JSON.parse(atob(token.split(".")[1]));
      } catch (error) {
        return {};
      }
    };

    checkTokenExpiration();
  }, [navigate]);

  useEffect(() => {
    const logoutAfterSevenDays = () => {
      const storedToken = localStorage.getItem("authToken");
      if (storedToken) {
        const decodedToken = decodeToken(storedToken);
        const expirationTime = decodedToken.exp * 1000;

        // Save token expiration time in localStorage
        localStorage.setItem("tokenExpirationTime", expirationTime);

        const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;

        // Check if the token will expire within the next 7 days
        if (expirationTime - Date.now() <= sevenDaysInMilliseconds) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("tokenExpirationTime");
          setToken(null);
          navigate("/");
        }
      }
    };

    const decodeToken = (token) => {
      try {
        return JSON.parse(atob(token.split(".")[1]));
      } catch (error) {
        return {};
      }
    };

    logoutAfterSevenDays();
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
    localStorage.removeItem("tokenExpirationTime");
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
                type="tel"
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
                  setLoginData({
                    ...loginData,
                    password: e.target.value.trim(),
                  })
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