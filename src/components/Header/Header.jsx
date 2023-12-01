  import React, { useState, useEffect } from "react";
  import Modal from "react-modal";
  import "./Header.css";
  import Nav from "../Nav/Nav";

  const Header = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [adminData, setAdminData] = useState([]);
    const [newAdmin, setNewAdmin] = useState({
      fullName: "",
      phone: "",
      password: "", // initialize password
      role: "",
    });

    useEffect(() => {
      // Fetch all admins on component mount
      fetchAdmins();
    }, []);
  

    const fetchAdmins = async () => {
      try {
        const response = await fetch("http://188.225.10.97:8080/api/v1/admin/all");
        const data = await response.json().catch(() => null);
    
        if (data) {
          setAdminData(data);
        } 
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };
    
    
    

    const handleFormSubmit = async (event) => {
      event.preventDefault();
    
      if (!newAdmin.fullName || newAdmin.phone.length < 6 || !newAdmin.role) {
        alert("Iltimos, barcha Malumot toʻldiring");
        return;
      }
    
      try {
        const response = await fetch("http://188.225.10.97:8080/api/v1/admin/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newAdmin),
        });
    
        if (response.ok) {
          // If the admin is successfully created, fetch all admins again
          fetchAdmins();
          closeModal();
        } else {
          // Handle error response
          const errorText = await response.text(); // Read the response as text
          console.error("Error creating admin:", errorText);
    
          // Optional: Display a more user-friendly error message
          alert("Error creating admin. Please try again.");
        }
      } catch (error) {
        console.error("Error creating admin:", error);
      }
    };
    

    const openModal = () => {
      setIsModalOpen(true);
    };

    const closeModal = () => {
      setIsModalOpen(false);
    };

    Modal.setAppElement("#root"); // Assuming your root element has the id "root"

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
                      placeholder="Full name"
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
                    <label htmlFor="phoneNumber">Telefon raqami</label>
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
                </tr>
              </thead>
              <tbody>
                {adminData.map((admin, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{admin.fullName}</td>
                    <td>{admin.phone}</td>
                    <td>{admin.role}</td>
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
