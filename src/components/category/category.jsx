import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { Link, NavLink } from "react-router-dom";
import Nav from "../Nav/Nav";
import "./category.css";

const Category = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Add state for edit modal
  const [selectedItem, setSelectedItem] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showActions, setShowActions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [error, setError] = useState(null);
  const [statusChangeData, setStatusChangeData] = useState({
    id: "",
    status: "",
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [shouldAddClass, setShouldAddClass] = useState(true);
  const [editCategoryData, setEditCategoryData] = useState({
    id: "",
    nameL: "",
    nameK: "",
  });

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const openEditModal = (item) => {
    setEditCategoryData({
      id: item.id,
      nameL: item.nameL,
      nameK: item.nameK,
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditCategoryData({
      id: "",
      nameL: "",
      nameK: "",
    });
    setIsEditModalOpen(false);
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();

    const storedToken = localStorage.getItem("authToken");
    const response = await fetch(
      `http://188.225.10.97:8080/api/v1/sub-category/update/${editCategoryData.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({
          nameL: editCategoryData.nameL,
          nameK: editCategoryData.nameK,
        }),
      }
    );

    fetchDataGetAll();
    closeEditModal();
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditCategoryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const threePointButton = (index) => {
    setShowActions(!showActions);
    setActiveIndex(index);
  };

  const handleDeleteClick = async (deleteID) => {
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

    fetchDataGetAll();
    closeModal();
  };

  const fetchDataGetAll = async () => {
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
    const storedToken = localStorage.getItem("authToken");

    const nameL = e.target.nameL.value.trim();
    const nameK = e.target.nameK.value.trim();
  
    // Check if input lengths are equal to 0
    if (nameL.length === 0 || nameK.length === 0) {
      setError("Barcha malumotlarni to'ldirish shart ?!.");
      return;
    }
    
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
    // If the request is successful, fetch updated data
    fetchDataGetAll();
    closeModal();
  };

  Modal.setAppElement("#root");

  return (
    <div className="container">
      <Nav />

      <div className="subcategory">
        <div className="key-word">
          <div className="po">
            <Link
              className={`wrapper-link ${shouldAddClass ? "" : ""}`}
              to="/add-category"
            >
              Kategoriya
            </Link>
            <Link
              className={`wrapper-link ${shouldAddClass ? "newClass" : ""}`}
              to="/category"
            >
              Bo'lim
            </Link>
            <button className="categoriya-btn" onClick={openModal}>
              +
            </button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Bo’lim nomi</th>
              <th>Бўлим номи</th>
              <th className="mn">Kategoriya nomi</th>
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
                  <span className="ienner">{subCategory.category.name}</span>
                </td>
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
                        onClick={() => openEditModal(subCategory)}
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
            <h3 style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>{error}</h3>
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
      <Modal
        isOpen={isEditModalOpen}
        className="react-modal-content"
        overlayClassName="react-modal-overlay"
        onRequestClose={closeEditModal}
      >
        <div className="modal-content">
          <div className="modal-header">
            <button className="close-btn" onClick={closeEditModal}>
              &#10006;
            </button>
            <h2 className="modal-title">Kategoriyani tahrirlash</h2>
          </div>
          <div className="modal-body">
            <form onSubmit={handleEditFormSubmit}>
              <label>
                Kategoriya nomi
                <input
                  type="text"
                  name="nameL"
                  value={editCategoryData.nameL}
                  onChange={handleEditInputChange}
                  autoComplete="off"
                />
              </label>
              <label>
                Категория номи
                <input
                  type="text"
                  name="nameK"
                  value={editCategoryData.nameK}
                  autoComplete="off"
                  onChange={handleEditInputChange}
                />
              </label>

              <button className="save-btn" type="submit">
                Saqlash
              </button>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Category;
