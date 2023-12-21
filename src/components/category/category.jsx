import { useState, useEffect } from "react";
import Modal from "react-modal";
import Edit from "../../Assets/img/edit.png";
import Trush_Icon from "../../Assets/img/Trush_Icon.png";
import Nav from "../Nav/Nav"; // Make sure the path is correct
import "./category.css";

const Category = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sectionData, setSectionData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectOptions, setSelectOptions] = useState([]);

  const [editingIndex, setEditingIndex] = useState(null);
  const [showActions, setShowActions] = useState(false);

  const [sectionNew, setSectionNew] = useState({
    nameK: "",
    nameL: "",
    catalogId: "",
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
      const catalogId = localStorage.getItem("catalogID");
      console.log("this is error",catalogId);
      const categoryResponse = await fetch(
        "http://188.225.10.97:8080/api/v1/category",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify({
            ...sectionNew,
            catalogId: catalogId,
          }),
        }
      );
      console.log(categoryResponse);
      const categoryData = await categoryResponse.json();
      setSectionData((prevSectionData) => [...prevSectionData, categoryData]);

      // Common cleanup for both category and catalog creation
      setSectionNew({
        nameL: "",
        nameK: "",
        catalogId,
      });

      closeModal();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchDataGetAll();
  }, []);

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
      // ... rest of the code
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Modify the fetchData function to accept a catalog ID
  const fetchData = async () => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const responseGetcategory = await fetch(
        `http://188.225.10.97:8080/api/v1/catalog/all`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      const dataGet = await responseGetcategory.json();
      setSelectOptions(dataGet);
      // ... rest of the code
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Call fetchData with the catalog ID when the component mounts
  useEffect(() => {
    // const catalogId = localStorage.getItem("catalogID");
    fetchData();
  }, []);

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
              <select
                  onChange={(e) => {
                    const selectedOption = selectOptions.find(
                      (option) => option.nameL === e.target.value
                    );
                
                    setSectionNew({
                      ...sectionNew,
                      selectedOption: e.target.value,
                      selectedOptionId: selectedOption?.id,
                    });
                
                    // Access the selected option's id here
                    const selectedId = selectedOption?.id;
                    console.log("Selected ID:", selectedId); 
                  }}
              >
                {selectOptions.map((a) => (
                  <option key={a.id} value={a.nameL}>
                    {a.nameL}
                  </option>
                ))}
              </select>

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

              <button className="save-btn" type="submit">
                Saqlash
              </button>
            </form>
          </div>
        </div>
      </Modal>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Mahsulot nomi</th>
            <th>Маҳсулот номи</th>
            <th>holat</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{category.nameL}</td>
              <td>{category.nameK}</td>
              <td>{category.status}</td>

              <td>
                <button className="categorys-btn" onClick={handleActionsClick}>
                  &#x22EE;
                </button>
                {showActions && (
                  <div className="wrapper-buttons">
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
};
export default Category;
