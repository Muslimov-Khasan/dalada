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
  const [categoryData, setcategoryData] = useState({
    nameK: "",
    nameL: "",
    photoUrl: "",
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // if (!newCategory.trim()) {
    //   setFormError("Kategoriya nomini kiriting");
    //   return;
    // }
    try {
      const storedToken = localStorage.getItem("authToken");
      const { nameK, nameL, parentCategoryId } = categoryData;
      const Datas = { nameK, nameL, parentCategoryId };
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

      if (!response.ok) {
        console.log("Error submitting form:", response.status);
        const errorData = await response.json(); // Log additional error details
        console.log("Error details:", errorData);

        // Check specific HTTP status codes
        if (response.status === 401) {
          // Unauthorized
          setFormError("Bu amalni bajarishga ruxsatingiz yo‘q.");
        } else if (response.status === 403) {
          // Forbidden
          setFormError("Kirish taqiqlangan.");
        } else {
          // Handle other errors
          setFormError(
            "Shaklni yuborishda xatolik yuz berdi. Iltimos, yana bir bor urinib ko'ring."
          );
        }

        return;
      }

      const responseData = await response.json();
      console.log("Response:", responseData);

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
  const fetchData = async () => {
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

      if (!response.ok) {
        console.log("Error fetching data:", response.status);
        return;
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // const handleEditClick = (index) => {
  //   setNewCategory(categories[index].name);
  //   setSelectedCategory(index);
  //   openModal();
  // };

  const handleEditClick = async (index) => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const categoryIDToUpdate = categories[index].id;
  
      // Upload the new image file
      const imgRef = ref(imageDb, `files/${v4()}`);
      await uploadBytes(imgRef, file);
      const imgUrl = await getDownloadURL(imgRef);
  
      // Log the updated image URL
      console.log("Updated Image URL:", imgUrl);
  
      // Make a PUT request to update the category
      const response = await fetch(
        `http://188.225.10.97:8080/api/v1/category/update/${categoryIDToUpdate}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify({
            nameK: categoryData.nameK,
            nameL: categoryData.nameL,
            photoUrl: imgUrl,
          }),
        }
      );
  
      // Check if the request was successful
      if (!response.ok) {
        console.log("Error updating category:", response.status);
        const errorData = await response.json().catch(() => ({}));
        console.log("Error details:", errorData);
  
        if (response.status === 403) {
          setFormError("You do not have permission to update this category.");
        } else {
          setFormError(
            "An error occurred while updating the category. Please try again."
          );
        }
  
        return;
      }
  
      // Check the response format
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        // Parse and log the response data
        const responseData = await response.json();
        console.log("Response:", responseData);
  
        // Update the state with the new category data
        setCategories((prevCategories) =>
          prevCategories.map((category, i) =>
            i === index ? { ...category, ...categoryData } : category
          )
        );
  
        // Close the modal after successful update
        closeModal();
      } else {
        console.log("Unexpected response format:", response);
        setFormError("Unexpected response format");
      }
    } catch (error) {
      console.log("Error updating category:", error);
    }
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

      if (!response.ok) {
        console.log("Error deleting category:", response.status);
        const errorData = await response.json(); // Log additional error details

        // Handle specific HTTP status codes if needed
        if (response.status === 401) {
          // Unauthorized
          setFormError("Bu amalni bajarishga ruxsatingiz yo‘q.");
        } else if (response.status === 403) {
          // Forbidden
          setFormError("Kirish taqiqlangan.");
        } else {
          // Handle other errors
          setFormError(
            "Kategoriyani o'chirishda xatolik yuz berdi. Iltimos, yana bir bor urinib ko'ring."
          );
        }

        return;
      }

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
    console.log("Download URL:", selectedFile);

    if (!selectedFile) {
      console.error("No file selected");
      return;
    }

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
          <form className="modal-form" onSubmit={handleFormSubmit}>
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
              id="categoryL" // Use a unique id for this field
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
              id="categoryK" // Use a unique id for this field
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
              New Button
            </button>
          </div>
        </div>
      </Modal>
      <ul className="card-list">
        {categories.map((category, index) => (
          <li className="card-item" key={index}>
            <div>
              <img
                className="add-image"
                src={category.photoUrl} // Set the image source to the URL from the API
                alt="Selected"
                width={120}
                height={120}
              />

              <Link
                className="category-link"
                to={`/category`} // Adjust the URL to include the index or the category ID
                onClick={() => storage(index)}
              >
                {category.name}
              </Link>
            </div>

            <button
              className="card-btn"
              onClick={() => {
                setSelectedCategory((prevIndex) => {
                  const indexToStore = prevIndex !== null ? prevIndex : 0; // Provide a default value if prevIndex is null
                  localStorage.setItem("deleted_id", indexToStore.toString());
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
export { imageDb };
