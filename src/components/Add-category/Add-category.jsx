import React, { useEffect, useState } from "react";
import { imageDb } from "../firebase/firebase";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import Edit from "../../Assets/img/edit.png";
import Shablon from "../../Assets/img/imge-add.png";
import Trush_Icon from "../../Assets/img/Trush_Icon.png";
import { v4 } from "uuid";
import Nav from "../Nav/Nav";
import "./Add-category.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
const Addcategory = () => {
  const [img, setImg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formError, setFormError] = useState("");
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [toggleStatus, setToggleStatus] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [categoryData, setcategoryData] = useState({
    nameK: "",
    nameL: "",
    photoUrl: "",
  });

  const [editCategoryData, setEditCategoryData] = useState({
    nameK: "",
    nameL: "",
    photoUrl: "",
  });
  const handleFormSubmitcategory = async (event) => {
    event.preventDefault();

    try {
      const storedToken = localStorage.getItem("authToken");
      const { nameK, nameL } = categoryData;
      const response = await fetch(
        `http://188.225.10.97:8080/api/v1/category`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify({
            nameK,
            nameL,
            status: "ACTIVE",
            photoUrl: imageUrl,
          }),
        }
      );

      const responseData = await response.json();

      const imgRef = ref(imageDb, responseData.photoStoragePath);
      const imgUrl = await getDownloadURL(imgRef);
      setcategoryData({ ...categoryData, photoUrl: imgUrl });
      setCategories((prevCategories) => [
        ...prevCategories,
        { name: newCategory, photoUrl: imgUrl },
      ]);
      setcategoryData({ ...categoryData, photoUrl: imgUrl });

      setCategories((prevCategories) => [
        ...prevCategories,
        { name: newCategory, photoUrl: imgUrl },
      ]);

      if (selectedCategory !== null) {
        setCategories((prevCategories) =>
          prevCategories.map((category, index) =>
            index === selectedCategory
              ? { ...category, name: newCategory }
              : category
          )
        );
        setSelectedCategory(null);
      } else {
        setCategories((prevCategories) => [
          ...prevCategories,
          { name: newCategory, photoUrl: imgUrl },
        ]);
      }

      setNewCategory("");
      setFormError("");
      closeModal();
    } catch (error) {
      console.log(error);
    } finally {
      window.location.reload();
    }
  };

  const updateCategory = async () => {
    try {
      const storedToken = localStorage.getItem("authToken");

      if (
        categories.length === 0 ||
        selectedCategory === null ||
        !categories[selectedCategory]
      ) {
        return;
      }

      const { nameK, nameL, parentCategoryId } = categoryData;

      // Get the ID of the selected category
      const categoryIdToUpdate = categories[selectedCategory].id;

      const response = await fetch(
        `http://188.225.10.97:8080/api/v1/category/update/${categoryIdToUpdate}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify({
            nameK,
            nameL,
            parentCategoryId,
            photoUrl: imageUrl,
          }),
        }
      );
      // Successfully updated category
      const responseData = await response.json();

      // Additional logic if needed after successful update
    } catch (error) {
      console.log("Error updating category:", error);
    }
  };

  useEffect(() => {
    updateCategory();
  }, []);

  const fetchDataGetcategory = async () => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const responseGet = await fetch(
        "http://188.225.10.97:8080/api/v1/category/all",
        {
          method: "GET", // GET method
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      const data = await responseGet.json();
      setCategories(data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDataGetcategory();
  }, []);

  const openEditModal = (category) => {
    setEditCategoryData({
      nameK: category.nameK,
      nameL: category.nameL,
      photoUrl: category.photoUrl,
    });
    setSelectedCategory(category.id);
    setIsEditModalOpen(true);
  };

  const handleEditClick = (index) => {
    setEditCategoryData({
      nameK: categories[index].nameK,
      nameL: categories[index].nameL,
      photoUrl: categories[index].photoUrl,
    });
    setSelectedCategory(index);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditCategoryData({
      nameK: "",
      nameL: "",
      photoUrl: "",
    });
    setSelectedCategory(null);
    setFormError("");
  };

  const handleDeleteClick = async (index) => {
    const storedToken = localStorage.getItem("authToken");
    const categoryIDToDelete = categories[index].id;

    const responseDelete = await fetch(
      `http://188.225.10.97:8080/api/v1/category/${categoryIDToDelete}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
      }
    );

    // Check if the deletion was successful (status code 200)
    if (responseDelete.ok) {
      // If deletion is successful, update the state to reflect the change
      setCategories((prevCategories) =>
        prevCategories.filter((_, i) => i !== index)
      );
    } else {
      // Handle the case where deletion was not successful
      console.error("Error deleting category:", responseDelete.status);
    }
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
  const handleFileChange = async (event) => {
    event.preventDefault();
    const selectedFile = event.target.files[0];

    try {
      const imgRef = ref(imageDb, `files/${v4()}`);
      await uploadBytes(imgRef, selectedFile);
      const imgUrl = await getDownloadURL(imgRef);

      setFile(selectedFile);
      setImg(imgUrl); // Set the state img with the URL of the uploaded image
      setcategoryData({ ...categoryData, photoUrl: imgUrl });
    } catch (error) {
      console.log("Error uploading file:", error.message);
    }
  };

  const handleUploadClick = async (event) => {
    event.preventDefault();
    document.getElementById("imageUpload").click();
    const imgRef = ref(imageDb, `files/${v4()}`);
    await uploadBytes(imgRef, file);
    const imgUrl = await getDownloadURL(imgRef);
    setImageUrl(imgUrl);
    console.log("Download URL:", imgUrl);
  };

  Modal.setAppElement("#root"); // Assuming your root element has the id "root"

  return (
    <div className="container">
      <Nav />
      <div className="box">
        <h1 className="header-title">Kategoriya qo’shish</h1>
        <button className="category-btn" onClick={openModal}>
          +
        </button>
      </div>
      <Modal
        className="react-modal-content"
        overlayClassName="react-modal-overlay"
        isOpen={isModalOpen}
        onRequestClose={closeModal}
      >
        <div className="modal-content">
          <div className="modal-header">
            <button className="close-btn" onClick={closeModal}>
              &#10006;
            </button>
            <h2 className="modal-title">Kategoriya qo’shish</h2>
          </div>
          <form className="modal-form" onSubmit={handleFormSubmitcategory}>
            <input
              type="file"
              id="imageUpload"
              accept=".png, .jpg, .jpeg"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <label htmlFor="categoryL">Kategoriya nomi (L)</label>
            <input
              className="category-input"
              type="text"
              id="categoryL"
              name="category.nameL"
              autoComplete="off"
              placeholder="Kategoriya nomi (L)"
              value={categoryData.nameL}
              onChange={(e) =>
                setcategoryData({ ...categoryData, nameL: e.target.value })
              }
            />

            {formError && <p className="form-error">{formError}</p>}

            <label htmlFor="categoryK">Kategoriya nomi (K)</label>
            <input
              className="category-input"
              type="text"
              id="categoryK"
              name="category.nameK"
              autoComplete="off"
              placeholder="Kategoriya nomi (K)"
              value={categoryData.nameK}
              onChange={(e) =>
                setcategoryData({ ...categoryData, nameK: e.target.value })
              }
            />
            <div>
              {imageUrl && <img src={imageUrl} alt="" className="rasm" />}
            </div>

            <button className="save-btn" type="submit">
              Saqlash
            </button>
          </form>
          <div>
            <button className="btn-file" onClick={handleUploadClick}>
              <img className="Shablon" src={Shablon} alt="" width={465} />
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        className="react-modal-content"
        overlayClassName="react-modal-overlay"
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
      >
        <div className="modal-content">
          <div className="modal-header">
            <button className="close-btn" onClick={() => closeEditModal()}>
              &#10006;
            </button>
            <h2 className="modal-title">Kategoriya qo’shish</h2>
          </div>
          <form className="modal-form" onSubmit={updateCategory}>
            <input
              type="file"
              id="imageUpload"
              accept=".png, .jpg, .jpeg"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <label htmlFor="categoryL">Kategoriya nomi (L)</label>
            <input
              className="category-input"
              type="text"
              id="categoryL"
              name="category.nameL"
              autoComplete="off"
              placeholder="Kategoriya nomi (L)"
              value={categoryData.nameL}
              onChange={(e) =>
                setcategoryData({ ...categoryData, nameL: e.target.value })
              }
            />
            {formError && <p className="form-error">{formError}</p>}

            <label htmlFor="categoryK">Kategoriya nomi (K)</label>
            <input
              className="category-input"
              type="text"
              id="categoryK"
              name="category.nameK"
              autoComplete="off"
              placeholder="Kategoriya nomi (K)"
              value={categoryData.nameK}
              onChange={(e) =>
                setcategoryData({ ...categoryData, nameK: e.target.value })
              }
            />
            <div>
              {imageUrl && <img src={imageUrl} alt="" className="rasm" />}
            </div>

            <button className="save-btn" type="submit" onClick={updateCategory}>
              Yangilash
            </button>
          </form>
          <div>
            <button className="btn-file" onClick={handleUploadClick}>
              <img
                className="Shablon"
                src={Shablon}
                alt="Shablon"
                width={465}
              />
            </button>
          </div>
        </div>
      </Modal>

      <ul className="card-list">
        {categories.map((category, index) => (
          <li className="card-item" key={index}>
            <Link
              className="category-link"
              to={`/category`}
              onClick={() => localStorage.setItem("catregoryID", category.id)}
            >
              <div>
                <img
                  className="new-image"
                  src={category.photoUrl}
                  alt="Selected"
                  width={120}
                  height={120}
                />
              </div>
              {category.name}
            </Link>

            <button
              className="card-btn"
              onClick={() => {
                setSelectedCategory((prevIndex) => {
                  const indexToStore = prevIndex !== null ? prevIndex : 0;
                  localStorage.setItem("deleted_id", category.id);
                  return prevIndex === index ? null : index;
                });
              }}
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
                  <img src={Edit} alt="edit" />
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
                  {toggleStatus && (
                    <p className="toggle-message">{category.status}</p>
                  )}
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
export { imageDb };