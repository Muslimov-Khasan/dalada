import "./News.css";
import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import Nav from "../Nav/Nav";

const News = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [comment, setComment] = useState("");
  const [newsItems, setNewsItems] = useState([]);
  const [formError, setFormError] = useState("");

  const [newsaddData, setnewsaddData] = useState({
    titleK: "",
    titleL: "",
    messageK: "",
    messageL: "",
  });
  
  const handleFormSubmitNew = async (event) => {
    event.preventDefault();
  
    if (!fullName.trim() || !comment.trim()) {
      setFormError("Iltimos, barcha Malumot toʻldiring");
      return;
    }
  
    try {
      const storedToken = localStorage.getItem("authToken");
      const { titleK, titleL, messageK, messageL } = newsaddData;
      const response = await fetch("http://188.225.10.97:8080/api/v1/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({
          titleK,
          titleL,
          messageK,
          messageL,
        }),
      });
  
      const responseData = await response.json();
      setNewsItems((prevNewsItems) => [...prevNewsItems, responseData]);
    } catch (error) {
      setFormError("Yangilik qo‘shib bo‘lmadi. Iltimos, yana bir bor urinib ko'ring.", error);
      return;
    }
  
    // Remove the local news item update
    // const newNewsItem = {
    //   title: fullName,
    //   message: comment,
    // };
    // setNewsItems((prevNewsItems) => [...prevNewsItems, newNewsItem]);
    
    const newNewsItem = {
      title: fullName,
      message: comment,
    };

    
    setFullName("");
    setComment("");
    setFormError("");
    closeModal();
  };
  
  
  
  const fetchDataNews = async () => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const response = await fetch(
        "http://188.225.10.97:8080/api/v1/news/all",
        {
          method: "GET", // GET method
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      if (!response.ok) {
        return;
      }
      const data = await response.json();
      setNewsItems(data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

    fetchDataNews()
  

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormError("");
  };

  Modal.setAppElement("#root"); // Assuming your root element has the id "root"

  return (
    <div className="container">
      <Nav />
      <div className="box">
        <h1 className="news-title">Yangiliklar</h1>
        <button className="modal-btn" onClick={openModal}>
          +
        </button>
      </div>

      <Modal isOpen={isModalOpen} className="react-modal-content" overlayClassName="react-modal-overlay" onRequestClose={closeModal}>
        <div className="modal-content">
          <div className="modal-header">
            <button className="close-btn" onClick={closeModal}>
              &#10006;
            </button>
            <h2 className="modal-title">Bo’lim qo’shish</h2>
          </div>
          <form className="modal-form" onSubmit={handleFormSubmitNew}>
            <label htmlFor="adminName">Mavzu</label>
            <input
              className="adminName"
              type="text"
              id="adminName"
              name="fullName"
              autoComplete="off"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <label htmlFor="Comment">Izoh</label>
            <textarea
              className="comment"
              type="text"
              id="Comment"
              name="comment"
              autoComplete="off"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            {formError && <p className="form-error">{formError}</p>}
            <button className="save-btn" type="submit">
              Saqlash
            </button>
          </form>
        </div>
      </Modal>

      <ul className="news-list">
        {newsItems.map((newsItem, index) => (
          <li className="news-item" key={index}>
            <h2 className="new-title">{newsItem.title}</h2>
            <p className="news-content">{newsItem.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default News;
