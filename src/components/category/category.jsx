import { useState, useEffect } from "react";
import Modal from "react-modal";
import Edit from "../../Assets/img/edit.png";
import Trush_Icon from "../../Assets/img/Trush_Icon.png";
import Nav from "../Nav/Nav"; // Make sure the path is correct
import "./category.css";
import { v4 } from "uuid";
import { imageDb } from "../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Category = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sectionData, setSectionData] = useState([]);
  const [categories, setCategories] = useState([]);

  const [img, setImg] = useState("");
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [showActions, setShowActions] = useState(false);
  const [sectionNew, setSectionNew] = useState({
    nameK: "",
    nameL: "",
    photoUrl: imageUrl,
    status: "ACTIVE", // Set the default status
  });
  // Fetch data from the API when the component mounts

  const updateCategory = async (categoryIdToUpdate) => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const response = await fetch(
        `http://188.225.10.97:8080/api/v1/category/update/${categoryIdToUpdate}`,
        {
          method: "PUT", // Assuming you use PUT for updates
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify(sectionNew),
        }
      );

      const updatedCategory = await response.json();

      // Update the state to reflect the changes
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === categoryIdToUpdate ? updatedCategory : category
        )
      );

      // Reset the form and close the modal
      setSectionNew({
        nameL: "",
        nameK: "",
        photoUrl: "",
        status: "ACTIVE", // Set the default status
      });
      closeModal();
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const changeCategoryStatus = async (categoryId, newStatus) => {
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
            id: categoryId,
            status: newStatus,
          }),
        }
      );
  
      if (response.ok) {
        // Update the state to reflect the changes
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.id === categoryId
              ? { ...category, status: newStatus }
              : category
          )
        );
      } else {
        console.error("Error changing category status:", response.status);
      }
    } catch (error) {
      console.error("Error changing category status:", error);
    }
  };
  
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const storedToken = localStorage.getItem("authToken");
      const parentCategoryId = localStorage.getItem("catregoryID");

      if (editingIndex !== null) {
        // If editing, call the update function
        await updateCategory(categories[editingIndex].id);
      } else {
        // If creating, call the create function
        const response = await fetch(
          "http://188.225.10.97:8080/api/v1/category",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${storedToken}`,
            },
            body: JSON.stringify({
              ...sectionNew,
              parentCategoryId: parentCategoryId,
              photoUrl: imageUrl,
            }),
          }
        );

        const data = await response.json();
        setSectionData((prevSectionData) => [...prevSectionData, data]);
      }
     // Common cleanup for both creation and update
      setSectionNew({
        nameL: "",
        nameK: "",
        photoUrl: "",
        status: "ACTIVE", // Set the default status
      });
      closeModal();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const parentID = localStorage.getItem("catregoryID");
  useEffect(() => {
    fetchData(parentID);
  }, []);

  const fetchData = async (parentID) => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const responseGet = await fetch(
        `http://188.225.10.97:8080/api/v1/category/all-by-parent-id/${parentID}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      const dataGet = await responseGet.json(); // Await here
      console.log(dataGet);
      setCategories(dataGet);
      // ... rest of the code
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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

  const handleEditClick = (index) => {
    const selectedCategory = sectionData[index];
    if (selectedCategory) {
      setSectionNew({
        ...selectedCategory,
        status: selectedCategory.status || "ACTIVE",
      });
      setEditingIndex(index);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
  };

  const handleActionsClick = () => {
    setShowActions(!showActions);
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
      setSectionNew({ ...sectionNew, photoUrl: imgUrl });
    } catch (error) {
      console.log("Error uploading file:", error.message);
    }
  };

  const handleUploadClick = (event) => {
    event.preventDefault();
    document.getElementById("imageUpload").click();
  };

  const handleNewDownloadImageClick = async () => {
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

  Modal.setAppElement("#root");
  return (
    <div className="contianer">
      <Nav />
      <div className="box">
       <h2 className="catregory-title">Dehqonchilik</h2> 
        <button className="modal-btn" onClick={openModal}>
          +
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        className="react-modal-content"
        overlayClassName="react-modal-overlay"
        onRequestClose={closeModal}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">Bo’lim qo’shish</h2>
              <button className="close-btn" onClick={closeModal}>
                &#10006;
              </button>
            <form className="modal-form" onSubmit={handleFormSubmit}>
              <label htmlFor="sectionName">Mahsulot nomi</label>
              <input
                type="text"
                className="input-name"
                id="sectionName"
                name="nameL"
                placeholder="Mahsulot nomi"
                autoComplete="off"
                value={sectionNew.nameL}
                onChange={(e) =>
                  setSectionNew({ ...sectionNew, nameL: e.target.value })
                }
              />
              <label htmlFor="sectionName">Маҳсулот номи</label>
              <input
                type="text"
                className="input-name"
                id="sectionName"
                name="nameK"
                placeholder="Маҳсулот номи"
                autoComplete="off"
                value={sectionNew.nameK}
                onChange={(e) =>
                  setSectionNew({ ...sectionNew, nameK: e.target.value })
                }
              />
              <label htmlFor="Holat">Holat</label>
              <select
                className="select-status"
                name="status"
                id="status"
                value={sectionNew.status}
                onChange={(e) =>
                  setSectionNew({ ...sectionNew, status: e.target.value })
                }
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="ACTIVE_NOT">NOT ACTIVE</option>
              </select>

              <div>
                {imageUrl && <img src={imageUrl} alt="" className="rasm" />}
              </div>
              <input
                type="file"
                id="imageUpload"
                accept=".png, .jpg, .jpeg"
                onChange={handleFileChange}
              />
              <button className="save-btn" type="submit">
                Saqlash
              </button>
            </form>
            <div>
              <button className="btn-file" onClick={handleUploadClick}></button>
              <button className="new-btn" onClick={handleNewDownloadImageClick}>
                Rasam Yuklash
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Mahsulot nomi</th>
            <th>holat</th>
            <th>Rasm</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{category.name}</td>
              <td>{category.status}</td>
              <td>
                <img src={category.photoUrl} alt="logo" width={100} />
              </td>
              <td>
                <button className="categorys-btn" onClick={handleActionsClick}>
                  &#x22EE;
                </button>
                {showActions && (
                  <div>
                    <button
                      className="button-delete"
                      onClick={() => handleDeleteClick(index)}
                    >
                      <img
                        src={Trush_Icon}
                        alt="Trush"
                        width={25}
                        height={25}
                      />
                      O’chirish
                    </button>
                    <button
                      className="button-edit"
                      onClick={() => handleEditClick(index)}
                    >
                      <img src={Edit} alt="Edit" height={25} />
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
  );
}
export default Category;