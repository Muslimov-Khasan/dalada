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
  
  const [sectionNew, setSectionNew] = useState({
    nameK: "",
    nameL: "",
    photoUrl: imageUrl,
    status: "ACTIVE", // Set the default status
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [showActions, setShowActions] = useState(false);
  const categoryID = localStorage.getItem('catregoryID')
  console.log(categoryID);
  // Fetch data from the API when the component mounts
  const filteredSectionData = sectionData.filter(
    (category) => categoryID === category.catregoryID
  );

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const storedToken = localStorage.getItem("authToken");
      const parentCategoryId = localStorage.getItem("catregoryID");
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
            photoUrl: imageUrl
          }),
        }
      );

      const data = await response.json();

      if (editingIndex !== null) {
        const updatedData = [...sectionData];
        updatedData[editingIndex] = data; // assuming the response contains updated data
        setSectionData(updatedData);
        setEditingIndex(null);
      } else {
        setSectionData((prevSectionData) => [...prevSectionData, data]);
      }

      setSectionNew({
        nameL: "",
        nameK: "",
        photoUrl: "",
        status: "",
      });
      closeModal();
    } catch (error) {
      console.log("Error:", error);
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
      const dataGet = await responseGet.json();  // Await here
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
    setSectionNew(sectionData[index]);
    setEditingIndex(index);
    openModal();
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

  Modal.setAppElement("#root");
  return (
    <div className="contianer">
      <Nav />

      <div className="box">
        <button className="modal-btn" onClick={openModal}>
          +
        </button>
      </div>

      <h2>Dehqonchilik</h2>
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
              <label htmlFor="sectionName">To'liq ism Sharif</label>
              <input
                type="text"
                className="input-name"
                id="sectionName"
                name="nameL"
                placeholder="To'liq ism Sharif"
                autoComplete="off"
                value={sectionNew.nameL}
                onChange={(e) =>
                  setSectionNew({ ...sectionNew, nameL: e.target.value })
                }
              />
              <label htmlFor="sectionName">Тўлиқ исм Шариф</label>
              <input
                type="text"
                className="input-name"
                id="sectionName"
                name="nameK"
                placeholder="Тўлиқ исм Шариф"
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
                value={sectionNew.status} // Add this line to set the default value
                onChange={(e) =>
                  setSectionNew({ ...sectionNew, status: e.target.value })
                }
              >
                <option value="ACTIVE" defaultChecked>
                  ACTIVE
                </option>
                <option value="ACTIVE-NOT">NOT ACTIVE</option>
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
                <button
                  className="btn-file"
                  onClick={handleUploadClick}
                ></button>
                <button className="new-btn" onClick={handleNewButtonClick}>
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
            <th>To'liq ism Sharif</th>
            <th>holat</th>
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
                <button className="category-btn" onClick={handleActionsClick}>
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
                      O’zgartirish
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
};

export default Category;