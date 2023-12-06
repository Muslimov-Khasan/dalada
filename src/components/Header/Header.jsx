import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./Header.css";
import Nav from "../Nav/Nav";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminData, setAdminData] = useState([]);
  const [showButtons, setShowButtons] = useState(null);

  const [newAdmin, setNewAdmin] = useState({
    fullName: "",
    phone: "",
    password: "",
    role: "",
  });

  const [modifiedAdmin, setModifiedAdmin] = useState({
    fullName: "",
    phone: "",
    password: "",
    role: "",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchDataAll();
  }, []);

  const fetchDataAll = async () => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const response = await fetch(
        "http://188.225.10.97:8080/api/v1/admin/all",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setAdminData(data);
    } catch (error) {
      console.log("Error fetching admin data:", error);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const storedToken = localStorage.getItem("authToken");
    const response = await fetch(
      "http://188.225.10.97:8080/api/v1/admin/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify(newAdmin),
      }
    );

    const responseData = await response.json();

    setAdminData((prevAdminData) => [...prevAdminData, responseData]);
    setNewAdmin({
      fullName: "",
      phone: "",
      role: "",
    });

    closeModal();
  };

  const handleThreeDotClick = (adminId) => {
    setShowButtons(adminId);
  };

  const handleDelete = async () => {
    const storedToken = localStorage.getItem("authToken");
    const response = await fetch(
      `http://188.225.10.97:8080/api/v1/admin/${showButtons}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    setAdminData((prevAdminData) =>
      prevAdminData.filter((admin) => admin.id !== showButtons)
    );

    setShowButtons(null);
  };

  const handleModify = async () => {
    setIsEditModalOpen(true);

    try {
      const storedToken = localStorage.getItem("authToken");
      const response = await fetch(
        `http://188.225.10.97:8080/api/v1/admin/${showButtons}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const adminDetails = await response.json();

      setModifiedAdmin(adminDetails);
    } catch (error) {
      console.error("Error fetching admin details:", error);
    }
  };

  const handleEditFormSubmit = async (event) => {
    event.preventDefault();

    const storedToken = localStorage.getItem("authToken");
    const response = await fetch(
      `http://188.225.10.97:8080/api/v1/admin/update`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(modifiedAdmin),
      }
    );

    setAdminData((prevAdminData) =>
      prevAdminData.map((admin) =>
        admin.id === showButtons ? { ...admin, ...modifiedAdmin } : admin
      )
    );

    setShowButtons(null);
    setIsEditModalOpen(false);
    setModifiedAdmin({
      fullName: "",
      phone: "",
      password: "",
      role: "",
    });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
  };

  Modal.setAppElement("#root");

  return (
    <>
      <header className="header">
        <div className="container">
          <Nav />
          <div className="box">
            <h1 className="header-title">Admin qo’shish</h1>
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
                <h2 className="modal-title">Admin qo’shish</h2>
                <button className="close-btn" onClick={closeModal}>
                  &#10006;
                </button>
                <form className="modal-form" onSubmit={handleFormSubmit}>
                  <label htmlFor="adminName">To'liq ism Sharif</label>
                  <input
                    type="text"
                    className="input-name"
                    id="adminName"
                    name="fullName"
                    placeholder="To'liq ism Sharif"
                    autoComplete="off"
                    value={newAdmin.fullName}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, fullName: e.target.value })
                    }
                  />
                  <label htmlFor="adminName">Parol</label>

                  <input
                    type="text"
                    className="input-name"
                    id="password"
                    name="password"
                    placeholder="Parol"
                    autoComplete="off"
                    value={newAdmin.password}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, password: e.target.value })
                    }
                  />
                  <label htmlFor="phone">Telefon raqami</label>
                  <input
                    className="phoneNumber"
                    type="tel"
                    id="phone"
                    name="phone"
                    autoComplete="off"
                    placeholder="+998"
                    value={newAdmin.phone}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, phone: e.target.value })
                    }
                  />

                  <label htmlFor="role">Rol</label>
                  <input
                    className="role"
                    type="text"
                    id="role"
                    name="role"
                    autoComplete="off"
                    value={newAdmin.role}
                    placeholder="Role"
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, role: e.target.value })
                    }
                  /> 
                   {/* <select name="select-role" id="select-role" value={newAdmin.role}
                    onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value})}
                  >
                    <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                  </select> */}
                  <button className="save-btn" type="submit">
                    Saqlash
                  </button>
                </form>
              </div>
            </div>
          </Modal>

          {/* Edit Modal */}
          <Modal
            isOpen={isEditModalOpen}
            className="react-modal-content"
            overlayClassName="react-modal-overlay"
            onRequestClose={closeModal}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Admin tahrirlash</h2>
                <button className="close-btn" onClick={closeModal}>
                  &#10006;
                </button>
                <form className="modal-form" onSubmit={handleEditFormSubmit}>
                  <label htmlFor="editedAdminName">To'liq ism Sharif</label>
                  <input
                    type="text"
                    className="input-name"
                    id="editedAdminName"
                    name="fullName"
                    placeholder="To'liq ism Sharif"
                    autoComplete="off"
                    value={modifiedAdmin.fullName}
                    onChange={(e) =>
                      setModifiedAdmin({
                        ...modifiedAdmin,
                        fullName: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="editedPassword">Parol</label>
                  <input
                    type="text"
                    className="input-name"
                    id="editedPassword"
                    name="password"
                    placeholder="Parol"
                    autoComplete="off"
                    value={modifiedAdmin.password}
                    onChange={(e) =>
                      setModifiedAdmin({
                        ...modifiedAdmin,
                        password: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="editedPhone">Telefon raqami</label>
                  <input
                    className="phoneNumber"
                    type="tel"
                    id="editedPhone"
                    name="phone"
                    autoComplete="off"
                    placeholder="+998"
                    value={modifiedAdmin.phone}
                    onChange={(e) =>
                      setModifiedAdmin({
                        ...modifiedAdmin,
                        phone: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="editedRole">Rol</label>
                  <input
                    className="select-role"
                    type="text"
                    id="editedRole"
                    name="role"
                    autoComplete="off"
                    value={modifiedAdmin.role}
                    placeholder="Role"
                    onChange={(e) =>
                      setModifiedAdmin({
                        ...modifiedAdmin,
                        role: e.target.value,
                      })
                    }
                  />

                  {/* <select name="select-role" id="select-role" value={modifiedAdmin.role}
                    onChange={(e) => setModifiedAdmin({...modifiedAdmin, role: e.target.value})}
                  >
                    <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                  </select> */}
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
                <th>To'liq ism Sharif</th>
                <th>Telefon raqami</th>
                <th>Rol</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              {adminData.map((admin, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{admin.fullName}</td>
                  <td>{admin.phone}</td>
                  <td>{admin.role}</td>
                  <td>
                    <div className="three-dot-container">
                      <button
                        className="three-dot"
                        onClick={() => handleThreeDotClick(admin.id)}
                      >
                        &#8942;
                      </button>
                      {showButtons === admin.id && (
                        <div className="buttons-container">
                          <button onClick={handleDelete}>Delete</button>
                          <button onClick={handleModify}>Edit</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </header>
    </>
  );
};

export default Header;
