import React, { useState } from "react";
import axios from "axios";
import "./Register.css";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
    password: "",
    photoUrl: null, // Initialize the file object as null
    notificationToken: "",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    // If the input is a file input, set the file object in the state
    const inputValue = type === "file" ? files[0] : value;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: inputValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("surname", formData.surname);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("photoUrl", formData.photoUrl);
      formDataToSend.append("notificationToken", formData.notificationToken);

      const response = await axios.post(
        "http://188.225.10.97:8080/api/v1/auth/register/user",
        formDataToSend
      );

      // Assuming the server responds with a token in the "data" property
      const authToken = response.data.token;

      // Store the token in localStorage or sessionStorage
      localStorage.setItem("authToken", authToken);

      console.log("Registration successful:", response.data);

      // Reset the form after successful registration
      setFormData({
        name: "",
        surname: "",
        phone: "+998938221502",
        password: "",
        photoUrl: null,
        notificationToken: "",
      });
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <form className="form-register" onSubmit={handleSubmit}>
      <label>
        Foydalanuvchi nomi:
        <input
          className="name-input"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Familiya:
        <input
          className="surname-input"
          type="text"
          name="surname"
          value={formData.surname}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Telefon raqami:
        <input
          className="phone-input"
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Password:
        <input
          className="password-input"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Rasmdagi URL:
        <input
          className="photoUrl-input"
          type="file"
          name="photoUrl"
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Bildirishnoma tokeni:
        <input
          className="notificationToken-input"
          type="text"
          name="notificationToken"
          value={formData.notificationToken}
          onChange={handleChange}
        />
      </label>
      <br />
      <button className="registration" type="submit">
        Register
      </button>
    </form>
  );
};

export default RegistrationForm;
