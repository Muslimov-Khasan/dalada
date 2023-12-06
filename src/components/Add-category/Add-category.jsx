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

  const handleFormSubmitcategory = async (event) => {
    event.preventDefault();

    try {
      const storedToken = localStorage.getItem("authToken");
      const { nameK, nameL, parentCategoryId } = categoryData;
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
            parentCategoryId,
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

  useEffect(() => {
    const parentID = localStorage.getItem("catregoryID"); // Replace with the actual parent ID
    fetchData(parentID);
  }, []);

  const fetchData = async (parentID) => {
    try {
      const response = await fetch(
        `http://188.225.10.97:8080/api/v1/category/all-by-parent-id/${parentID}`
      );
  
      const data = await response.json();
      console.log("Data:", data);
    } catch (error) {
      console.error("Error fetching data:", error);
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
      const id = localStorage.getItem("deleted_id");

      const response = await fetch(
        `http://188.225.10.97:8080/api/v1/category/update/${id}`,
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
      const response = await fetch(
        "http://188.225.10.97:8080/api/v1/category/all",
        {
          method: "GET", // GET method
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      const data = await response.json();
      
      setCategories(data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDataGetcategory();
  }, []);

  const handleEditClick = (index) => {
    setNewCategory(categories[index].name);
    setSelectedCategory(index);

    const idToDelete = categories[index].id;
    handleDeleteClick(index, idToDelete);

    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCategory(null);
    setFormError("");
  };

  const handleDeleteClick = async (index) => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const categoryIDToDelete = categories[index].id; // Assuming your category object has an 'id' property

      const response = await fetch(
        `http://188.225.10.97:8080/api/v1/category/${categoryIDToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      const data = await response.json(); // Log additional error details
     console.log(data);

      // If deletion is successful, update the state to reflect the change
      setCategories((prevCategories) =>
        prevCategories.filter((_, i) => i !== index)
      );
    } catch (error) {
      console.log("Error deleting category:", error);
    }
  };

  function storage(id) {
    localStorage.setItem("category_id", id);
  }
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

  const handleUploadClick = (event) => {
    event.preventDefault();
    document.getElementById("imageUpload").click();
  };

  const handleNewButtonClick = async () => {
    try {
      const imgRef = ref(imageDb, `files/${v4()}`);
      await uploadBytes(imgRef, file);
      const imgUrl = await getDownloadURL(imgRef);

      // Set the state with the URL
      setImageUrl(imgUrl);

      console.log("Download URL:", imgUrl);
    } catch (error) {
      console.error("Error getting download URL:", error.message);
    }
  };

  Modal.setAppElement("#root"); // Assuming your root element has the id "root"

  return (
    <div className="container">
      <Nav />
      <div className="box">
        <h1 className="header-title">Kategoriya qo’shish</h1>
        <button className="modal-btn" onClick={openModal}>
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
              <img className="Shablon" src={Shablon} alt="" />
            </button>
            <button className="new-btn" onClick={handleNewButtonClick}>
              Rasam Yuklash
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        className="react-modal-content"
        overlayClassName="react-modal-overlay"
        isOpen={isEditModalOpen} // Use the new state variable for edit modal
        onRequestClose={closeEditModal}
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

            <button className="save-btn" type="submit" onClick={updateCategory}>
              Yangilash
            </button>
          </form>
          <div>
            <button className="btn-file" onClick={handleUploadClick}>
              <img className="Shablon" src={Shablon} alt="" />
            </button>
            <button className="new-btn" onClick={handleNewButtonClick}>
              Rasm Yuklash
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
