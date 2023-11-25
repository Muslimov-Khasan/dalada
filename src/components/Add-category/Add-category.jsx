  import React, { useEffect, useState } from "react";
  import Modal from "react-modal";
  import { Link } from "react-router-dom";
  import Nav from "../Nav/Nav";
  import "./Add-category.css";
  import Trush_Icon from "../../Assets/img/Trush_Icon.png";
  import Edit from "../../Assets/img/edit.png";
  import Shablon from "../../Assets/img/imge-add.png";
  const Addcategory = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formError, setFormError] = useState("");
    const [file, setFile] = useState(null);

    const [toggleStatus, setToggleStatus] = useState(true);

    const [categoryData, setcategoryData] = useState({
      nameK: "салом",
      nameL: "salom",
      photoUrl: "",
      parentCategoryId: "",
    });

    const handleFormSubmit = async (event) => {
      event.preventDefault();
      try {

        const storedToken = localStorage.getItem("authToken");
        const categoryId = 1; // Replace with the actual category ID
        const { nameK, nameL, photoUrl, parentCategoryId } = categoryData;
        const response = await fetch(
          `http://188.225.10.97:8080/api/v1/category/${categoryId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${storedToken}`,
            },
            body: JSON.stringify({
              categoryId,
              nameK,
              nameL,
              photoUrl,
              parentCategoryId
            }),
          }
        );

        const responseData = await response.text();
        setcategoryData({ ...categoryData, ...responseData });
        console.log("Response Data:", responseData);
    
      } catch (error) {
        console.log(error);
      }

      if (!newCategory.trim()) {
        setFormError("Kategoriya nomini kiriting");
        return;
      }

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
          { name: newCategory, photoUrl: URL.createObjectURL(file) },
        ]);
      }
      // Cleanup code if needed
      setNewCategory("");
      setFormError("");
      closeModal();
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
        console.log("Fetched data:", data); // Add this line to see the data received
        setCategories(data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    useEffect(() => {
      fetchData();
    }, []);

    console.log(categories); // Add this line to check the structure

    const handleEditClick = (index) => {
      setNewCategory(categories[index].name);
      setSelectedCategory(index);
      openModal();
    };
    
    

    const handleDeleteClick = (index) => {
      setCategories((prevCategories) =>
        prevCategories.filter((_, i) => i !== index)
      );
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

    const handleFileChange = (event) => {
      event.preventDefault();
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
    };

    const handleUploadClick = (event) => {
      event.preventDefault();
      document.getElementById("imageUpload").click();
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
        <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Kategoriya qo’shish</h2>
              <button className="close-btn" onClick={closeModal}>
                &#10006;
              </button>
            </div>
            <form className="modal-form" onSubmit={handleFormSubmit}>
              <input
                type="file"
                id="imageUpload"
                accept=".png, .jpg, .jpeg"
                onChange={handleFileChange}
                style={{ display: "none" }} // Hide the file input
              />

              <label htmlFor="category">Kategoriya nomi</label>
              <input
                 className="category-input"
                 type="text"
                 id="category"
                 name="category.name"
                 autoComplete="off"
                 placeholder="Kategoriya nomi"
                 value={newCategory}
                 onChange={(e) => setNewCategory(e.target.value)}
              />
              {formError && <p className="form-error">{formError}</p>}
              <button className="btn-file" onClick={handleUploadClick}>
                <img className="Shablon" src={Shablon} alt="" />
              </button>
              <button className="save-btn" type="submit">
                Saqlash
              </button>
            </form>
          </div>
        </Modal>
        <ul className="card-list">
          {categories.map((category, index) => (
            <li className="card-item" key={index}>
              <div>
                <img
                    className="add-imag"
                    src={category.photoUrl}
                    alt="Selected"
                    width={120}
                    height={120}
                />

                <Link
                  className="category-link"
                  to={`/category`}  // Adjust the URL to include the index or the category ID
                  onClick={() => storage(index)}
                >
                  {category.name}
                </Link>
              </div>

              <button
                className="card-btn"
                onClick={() => {
                  setSelectedCategory((prevIndex) =>
                    prevIndex === index ? null : index
                  );
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


