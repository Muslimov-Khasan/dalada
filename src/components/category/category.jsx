import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Edit from "../../Assets/img/edit.png";
import Trush_Icon from "../../Assets/img/Trush_Icon.png";
import Nav from "../Nav/Nav";
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

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const storedToken = localStorage.getItem("authToken");
      const catalogId = localStorage.getItem("catalogID");
      // console.log("Selected ID for submission:", sectionNew.selectedOptionId);
      console.log("this is error", catalogId);

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
    fetchData();
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
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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

    if (responseDelete.ok) {
      setCategories((prevCategories) =>
        prevCategories.filter((_, i) => i !== index)
      );
    } else {
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

  const handleSelectChange = (e) => {
    const selectedOption = selectOptions.find(
      (option) => option.nameL === e.target.value
    );

    setSectionNew({
      ...sectionNew,
      selectedOption: e.target.value,
      selectedOptionId: selectedOption?.id,
    });

    const selectedId = selectedOption?.id;
    console.log("Selected ID:", selectedId);
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
    <div className="container">
      <Nav />
      <div className="box">
        <h2 className="category-title">Dehqonchilik</h2>
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
              <select onChange={handleSelectChange} value={sectionNew.selectedOption}>
                {selectOptions.map((a) => (
                  <option key={a.id} value={a.nameL} data-id={a.id}>
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
                <button className="categories-btn" onClick={handleActionsClick}>
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
                        alt="Trash"
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
