import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { NavLink } from "react-router-dom";
import Nav from "../Nav/Nav";
import "./category.css";

const Category = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showActions, setShowActions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [statusChangeData, setStatusChangeData] = useState({
    id: "",
    status: "",
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [shouldAddClass, setShouldAddClass] = useState(true);

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const threePointButton = (index) => {
    setShowActions(!showActions);
    setActiveIndex(index);
  };

  const handleDeleteClick = async (deleteID) => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const response = await fetch(
        `http://188.225.10.97:8080/api/v1/sub-category/${deleteID}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      if (response.ok) {
        // If the request is successful, fetch updated data
        fetchDataGetAll();
        closeModal();
      } else {
        console.error("Failed to delete sub-category");
      }
    } catch (error) {
      console.error("Error deleting sub-category:", error);
    }
  };

  const handleEditClick = (index) => {
    // Define your edit logic here
  };

  const fetchDataGetAll = async () => {
    try {
      const storedToken = localStorage.getItem("authToken");

      const responseGetSubCategory = await fetch(
        `http://188.225.10.97:8080/api/v1/sub-category/all`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      const dataGetSubCategory = await responseGetSubCategory.json();
      setSubCategories(dataGetSubCategory);

      const responseGetCategory = await fetch(
        `http://188.225.10.97:8080/api/v1/category/all`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      const dataGetCategory = await responseGetCategory.json();
      setCategories(dataGetCategory);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDataGetAll();
  }, []);

  const handleChangeStatus = async () => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const response = await fetch(
        `http://188.225.10.97:8080/api/v1/sub-category/change-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify({
            id: statusChangeData.id,
            status: statusChangeData.status,
          }),
        }
      );

      setSubCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === statusChangeData.id
            ? { ...category, status: statusChangeData.status }
            : category
        )
      );
    } catch (error) {
      console.error("Error changing status:", error);
    }
  };

  const handleStatusChange = (id, status) => {
    setStatusChangeData({ id, status });
    handleChangeStatus();
  };

  const handleCategoryChange = (e) => {
    setSelectedCategoryId(e.target.value);
  };

  const handleAddSubCategory = async (e) => {
    e.preventDefault();

    try {
      const storedToken = localStorage.getItem("authToken");
      const response = await fetch(
        `http://188.225.10.97:8080/api/v1/sub-category`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify({
            nameL: e.target.nameL.value,
            nameK: e.target.nameK.value,
            categoryId: selectedCategoryId,
          }),
        }
      );

      if (response.ok) {
        // If the request is successful, fetch updated data
        fetchDataGetAll();
        closeModal();
      } else {
        console.error("Failed to add sub-category");
      }
    } catch (error) {
      console.error("Error adding sub-category:", error);
    }
  };

  Modal.setAppElement("#root");

  return (
    <div className="container">
      <Nav />

      <div className="subcategory">
        <NavLink
          className={`wrapper-link ${shouldAddClass ? "" : ""}`}
          to="/add-category"
        >
          Kategoriya
        </NavLink>
        <NavLink
          className={`wrapper-link ${shouldAddClass ? "newClass" : ""}`}
          to="/category"
        >
          Bo'lim
        </NavLink>
        <button className="categoriya-btn" onClick={() => openModal()}>
          +
        </button>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Bo’lim nomi</th>
              <th>Бўлим номи</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {subCategories.map((subCategory, index) => (
              <tr key={index + 1}>
                <td>{index + 1}</td>
                <td>{subCategory.nameL}</td>
                <td>{subCategory.nameK}</td>
                <td>
                  <div className="toggle-wrapper">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={subCategory.status === "ACTIVE"}
                        onChange={() =>
                          handleStatusChange(
                            subCategory.id,
                            subCategory.status === "ACTIVE"
                              ? "NOT_ACTIVE"
                              : "ACTIVE"
                          )
                        }
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  {subCategory.status && (
                    <p className="toggle-message">{subCategory.status}</p>
                  )}
                </td>

                <td>
                  <button
                    className="categories-btn"
                    onClick={() => threePointButton(index)}
                  >
                    &#x22EE;
                  </button>

                  {showActions && activeIndex === index && (
                    <div className="wrapper-buttons">
                      <button
                        className="button-delete"
                        onClick={() => handleDeleteClick(subCategory.id)}
                      >
                        O’chirish
                      </button>
                      <button
                        className="button-edit"
                        onClick={() => handleEditClick(index)}
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        className="react-modal-content"
        overlayClassName="react-modal-overlay"
        onRequestClose={closeModal}
      >
        <div>
          <form className="form-category" onSubmit={handleAddSubCategory}>
            <button className="close-button" onClick={closeModal}>
              &#10006;
            </button>
            <label htmlFor="Kategoriya">Kategoriya</label>
            <select
              className="select-category"
              value={selectedCategoryId}
              onChange={handleCategoryChange}
            >
              <option value="">Tanlang</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <label htmlFor="Bo’lim nomi">Bo’lim nomi</label>
            <input
              className="sub-catgory"
              type="text"
              name="nameL"
              id="nameL"
              autoComplete="off"
            />
            <label htmlFor="Bo’lim nomi">Бўлим номи</label>
            <input
              className="sub-catgory"
              type="text"
              name="nameK"
              id="nameK"
              autoComplete="off"
            />

            <button className="category-save" type="submit">
              Saqlash
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Category;
