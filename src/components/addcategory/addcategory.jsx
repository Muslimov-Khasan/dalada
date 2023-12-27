import React, { useState, useEffect } from "react";
import "./addAategory.css";
import Modal from "react-modal";
import Nav from "../Nav/Nav";
import { v4 } from "uuid";
import { imageDb } from "../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Edit from "../../Assets/img/edit.png";
import Trush_Icon from "../../Assets/img/Trush_Icon.png";
import Shablon from "../../Assets/img/shablon.png";
import { NavLink } from "react-router-dom";

const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [img, setImg] = useState("");
  const [file, setFile] = useState(null);
  const [showActions, setShowActions] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toggleStatus, setToggleStatus] = useState(true);

  const [activeIndex, setActiveIndex] = useState(null);
  const [categoriesData, setCategoriesData] = useState({
    nameL: "",
    nameK: "",
    photoUrl: "",
  }); // Add imgUrl to your state
  const [editCategoryData, setEditCategoryData] = useState({
    nameL: "",
    nameK: "",
    photoUrl: "",
  });

  const [statusChangeData, setStatusChangeData] = useState({
    id: "",
    status: "",
  });
  const shouldAddClass = true;

  const openEditModal = (index) => {
    const selectedCategory = categories[index];
    setEditCategoryData(selectedCategory);
    setIsEditModalOpen(true);
  };

  // Function to close the edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    // Clear form data after closing the modal
    setEditCategoryData({
      nameL: "",
      nameK: "",
      photoUrl: "",
    });
  };

  const fetchDataGetAll = async () => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const responseGetcategory = await fetch(
        `http://188.225.10.97:8080/api/v1/category/all`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      const dataGet = await responseGetcategory.json();
      setCategories(dataGet);
      console.log(dataGet);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDataGetAll();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Clear form data after closing the modal
    setCategoriesData({
      nameL: "",
      nameK: "",
      photoUrl: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoriesData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const storedToken = localStorage.getItem("authToken");
      const response = await fetch(
        "http://188.225.10.97:8080/api/v1/category",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify(categoriesData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Check if the response content type is JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const newCategory = await response.json();
        // Update the categories state with the new category
        setCategories((prevCategories) => [...prevCategories, newCategory]);
      } else {
        // Handle non-JSON response (maybe success message or HTML)
        console.log("Success:", await response.text());
      }

      // Close the modal after successful submission
      closeModal();
      fetchDataGetAll();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleUploadClick = (event) => {
    event.preventDefault();
    document.getElementById("imageUpload").click();
  };

  const handleFileChange = async (event) => {
    event.preventDefault();
    const selectedFile = event.target.files[0];

    try {
      const imgRef = ref(imageDb, `files/${v4()}`);
      await uploadBytes(imgRef, selectedFile);
      const imgUrl = await getDownloadURL(imgRef);

      setFile(selectedFile);
      setImg(imgUrl);
      setCategoriesData({ ...categoriesData, photoUrl: imgUrl }); // Fix here
    } catch (error) {
      console.log("Error uploading file:", error.message);
    }
  };

  const handleFileUpload = async () => {
    try {
      const imgRef = ref(imageDb, `files/${v4()}`);
      await uploadBytes(imgRef, file);
      const imgUrl = await getDownloadURL(imgRef);

      setImg(imgUrl);
      console.log(imgUrl);
      // Check whether it's the add or edit modal and update the state accordingly
      if (isModalOpen) {
        setCategoriesData({ ...categoriesData, photoUrl: imgUrl });
      } else if (isEditModalOpen) {
        setEditCategoryData({ ...editCategoryData, photoUrl: imgUrl });
      }
    } catch (error) {
      console.log("Error uploading file:", error.message);
    }
  };

  

  const handleDeleteClick = async (index) => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const itemId = categories[index].id; // Assuming your category object has an 'id' property

      const response = await fetch(
        `http://188.225.10.97:8080/api/v1/category/${itemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Remove the deleted category from the state
      setCategories((prevCategories) =>
        prevCategories.filter((_, i) => i !== index)
      );
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleEditClick = (index) => {
    // Implement the logic for editing a category using the index
    openEditModal(index);
  };

  const handleToggle = () => {
    setToggleStatus((prevToggleStatus) => !prevToggleStatus);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditCategoryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Upload the file
      await handleFileUpload();
  
      const storedToken = localStorage.getItem("authToken");
      const response = await fetch(
        `http://188.225.10.97:8080/api/v1/category/update/${editCategoryData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify({
            nameL: editCategoryData.nameL,
            nameK: editCategoryData.nameK,
            photoUrl: editCategoryData.photoUrl, // Ensure this is updated
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Close the edit modal after successful submission
      closeEditModal();
      fetchDataGetAll();
    } catch (error) {
      console.error("Error submitting edit form:", error);
    }
  };
  

  // const handleEditFormSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const storedToken = localStorage.getItem("authToken");
  //     const response = await fetch(
  //       `http://188.225.10.97:8080/api/v1/category/update/${editCategoryData.id}`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${storedToken}`,
  //         },
  //         body: JSON.stringify({
  //           nameL: editCategoryData.nameL,
  //           nameK: editCategoryData.nameK,
  //           photoUrl: editCategoryData.photoUrl,
  //         }),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }

  //     // Upload the file
  //     await handleFileUpload();
  //     // Close the edit modal after successful submission
  //     closeEditModal();
  //     fetchDataGetAll();
  //   } catch (error) {
  //     console.error("Error submitting edit form:", error);
  //   }
  // };

  const handleChangeStatus = async () => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const response = await fetch(
        `http://188.225.10.97:8080/api/v1/category/change-status`,
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

      // Update the status of the category in the state
      setCategories((prevCategories) =>
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

  const threePointButton = (index) => {
    setShowActions((prevShowActions) => !prevShowActions);
    setActiveIndex(index);
  };
  Modal.setAppElement("#root");
  return (
    <div className="container">
      <Nav />
      <NavLink
        className={`wrapper-link ${shouldAddClass ? "newClass" : ""}`}
        to="/add-category"
      >
        Kategoriya
      </NavLink>
      <NavLink
        className={`wrapper-link ${shouldAddClass ? "" : ""}`}
        to="/category"
      >
        Bo'lim
      </NavLink>
      {categories.length === 0 && (
        <p className="loading-text">Yuklanmoqda...</p>
      )}
      <button className="categoriya-btn" onClick={openModal}>
        +
      </button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Rasm</th>
            <th>Kategoriya nomi</th>
            <th>Категория номи</th>
            <th>status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {categories.map((addcategory, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <img
                  src={addcategory.photoUrl}
                  alt=""
                  style={{ width: "50px", height: "50px" }}
                />
              </td>
              <td>{addcategory.nameL}</td>
              <td>{addcategory.nameK}</td>
              <td>
                <div className="toggle-wrapper">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={addcategory.status === "ACTIVE"}
                      onChange={() =>
                        handleStatusChange(
                          addcategory.id,
                          addcategory.status === "ACTIVE"
                            ? "NOT_ACTIVE"
                            : "ACTIVE"
                        )
                      }
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
                {addcategory.status && (
                  <p className="toggle-message">{addcategory.status}</p>
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
                      onClick={() => handleDeleteClick(index)}
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

      <Modal
        isOpen={isModalOpen}
        className="react-modal-content"
        overlayClassName="react-modal-overlay"
        onRequestClose={closeModal}
      >
        <div className="modal-content">
          <div className="modal-header">
            <button className="close-btn" onClick={closeModal}>
              &#10006;
            </button>
            <h2 className="modal-title">Yangi Kategoriya Qo'shish</h2>
          </div>
          <div className="modal-body">
            <form onSubmit={handleFormSubmit}>
              <label>
                Kategoriya nomi
                <input
                  type="text"
                  name="nameL"
                  value={categoriesData.nameL}
                  onChange={handleInputChange}
                  autoComplete="off"
                />
              </label>
              <label>
                Категория номи
                <input
                  type="text"
                  name="nameK"
                  value={categoriesData.nameK}
                  autoComplete="off"
                  onChange={handleInputChange}
                />
              </label>
              <label>
                <input
                  type="file"
                  id="imageUpload"
                  accept=".svg"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <button className="btn-file" onClick={handleUploadClick}>
                  <img className="shablon" src={Shablon} alt="" width={365} />
                </button>
              </label>
              <button className="save-btn" type="submit">
                Saqlash
              </button>
            </form>
          </div>
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
              <input
                type="file"
                id="imageUpload"
                accept=".svg"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <button className="btn-file" onClick={handleUploadClick}>
                <img className="shablon-no" src={Shablon} alt="" width={365} />
              </button>
              <img
                className="edit-img"
                src={editCategoryData.photoUrl}
                alt=""
                style={{ width: "50px", height: "50px" }}
              />
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

export default AddCategory;