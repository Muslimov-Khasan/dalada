import React, { useState } from "react";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import Nav from "../Nav/Nav";
import "./Add-category.css";
import Trush_Icon from "../../Assets/img/Trush_Icon.png";
import Edit from "../../Assets/img/edit.png";
const Addcategory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formError, setFormError] = useState("");
  const [toggleStatus, setToggleStatus] = useState(false);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!newCategory.trim()) {
      setFormError("Kategoriya nomini kiriting");
      return;
    }

    if (selectedCategory !== null) {
      setCategories((prevCategories) =>
        prevCategories.map((category, index) =>
          index === selectedCategory ? newCategory : category
        )
      );
      setSelectedCategory(null);
    } else {
      setCategories((prevCategories) => [...prevCategories, newCategory]);
    }

    setNewCategory("");
    setFormError("");
    closeModal();
  };

  const handleEditClick = (index) => {
    setNewCategory(categories[index]);
    setSelectedCategory(index);
    openModal();
  };

  const handleDeleteClick = (index) => {
    setCategories((prevCategories) =>
      prevCategories.filter((_, i) => i !== index)
    );
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setFormError("");
  };

  const handleToggle = () => {
    setToggleStatus(!toggleStatus); // Toggle the status
  };

  return (
    <div className="container">
      <Nav />
      <div className="box">
        <h1 className="header-title">Kategoriya qo’shish</h1>
        <button className="modal-btn" onClick={openModal}>
          +
        </button>
      </div>
      <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">Kategoriya qo’shish</h2>
            <button className="close-btn" onClick={closeModal}>
              X
            </button>
          </div>
          <form className="modal-form" onSubmit={handleFormSubmit}>
            <label htmlFor="category">Kategoriya nomi</label>
            <input
              className="category-input"
              type="text"
              id="category"
              name="category"
              autoComplete="off"
              placeholder="Kategoriya nomi"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            {formError && <p className="form-error">{formError}</p>}
            <button className="save-btn" type="submit">
              Saqlash
            </button>
          </form>
        </div>
      </Modal>
      <ul className="card-list">
        {categories.map((category, index) => (
          <li className="card-item" key={index}>
            <Link className="category-link" to={`/category`}>
              {category}
            </Link>

            <button
              className="card-btn"
              onClick={() => setSelectedCategory(index)}
            >
              &#x22EE;
            </button>
            {selectedCategory === index && (
              <div className="edit-delete-buttons">
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteClick(index)}
                >
                  <img src={Trush_Icon} alt="Trush_Icon" />
                  Delete
                </button>
                <button
                  className="btn-edit"
                  onClick={() => handleEditClick(index)}
                >
                  <img src={Edit} alt="" />
                  Edit
                </button>
                <div className="toggle-wrapper">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={toggleStatus}
                      onChange={handleToggle}
                    />
                    <span className="slider round"></span>
                  </label>

                  {toggleStatus && <p className="toggle-message">Active</p>}
                </div>
              </div>
            )}
            
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Addcategory;
