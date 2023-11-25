import "./category.css";
import Modal from "react-modal";
import { useState } from "react";
import Nav from "../Nav/Nav";
import Trush_Icon from "../../Assets/img/Trush_Icon.png";
import Edit from "../../Assets/img/edit.png";
const Category = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sectionData, setSectionData] = useState([]);
  const [sectionNew, setSectionNew] = useState({
    fullName: "",
    phoneNumber: "",
    role: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [showActions, setShowActions] = useState(false);
  const [file, setFile] = useState(null);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    
    if (!sectionNew.fullName || !sectionNew.phoneNumber || !sectionNew.role) {
      alert("Iltimos, barcha Malumot toʻldiring");
      return;
    }

    if (sectionNew.phoneNumber.replace(/\D/g, "").length < 6) {
      alert("Telefon raqami kamida 6 ta belgidan iborat bo'lishi kerak");
      return;
    }

    if (editingIndex !== null) {
      // If editing, update the existing item
      const updatedData = [...sectionData];
      updatedData[editingIndex] = sectionNew;
      setSectionData(updatedData);
      setEditingIndex(null);
    } else {
      setSectionData((prevSectionData) => [...prevSectionData, sectionNew]);
    }

    setSectionNew({
      fullName: "",
      phoneNumber: "",
      role: "",
    });

    closeModal();
  };

  const handleEditClick = (index) => {
    setSectionNew(sectionData[index]);
    setEditingIndex(index);
    openModal();
  };

  const handleDeleteClick = (index) => {
    const updatedData = [...sectionData];
    updatedData.splice(index, 1);
    setSectionData(updatedData);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingIndex(null); // Reset editing index when closing the modal
  };

  const handleActionsClick = () => {
    setShowActions(!showActions);
  };

  Modal.setAppElement("#root"); // Assuming your root element has the id "root"

  return (
    <div className="contianer">
      <Nav />

      <div className="box">
        <button className="modal-btn" onClick={openModal}>
          +
        </button>
      </div>

      <h2>Dehqonchilik</h2>
      <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">Bo’lim qo’shish</h2>
            <button className="close-btn" onClick={closeModal}>
              &#10006;
            </button>
            <form className="modal-form" onSubmit={handleFormSubmit}>
              <label htmlFor="sectionName">Full name</label>
              <input
                type="text"
                className="input-name"
                id="sectionName"
                name="fullName"
                placeholder="Full name"
                autoComplete="off"
                value={sectionNew.fullName}
                onChange={(e) =>
                  setSectionNew({ ...sectionNew, fullName: e.target.value })
                }
              />
              <label htmlFor="phoneNumber">Phone number</label>
              <input
                className="phoneNumber"
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                autoComplete="off"
                placeholder="+998"
                value={sectionNew.phoneNumber}
                onChange={(e) => {
                  setSectionNew({
                    ...sectionNew,
                    phoneNumber: e.target.value
                      .replace(/\D/g, "")
                      .replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"),
                  });
                }}
              />

              <label htmlFor="role">Role</label>
              <input
                className="role"
                type="text"
                id="role"
                name="role"
                autoComplete="off"
                value={sectionNew.role}
                placeholder="Role"
                onChange={(e) =>
                  setSectionNew({ ...sectionNew, role: e.target.value })
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
            <th>Full name</th>
            <th>Teefon raqam</th>
            <th>Category ru</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sectionData.map((section, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{section.fullName}</td>
              <td>{section.phoneNumber}</td>
              <td>{section.role}</td>
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

// import "./category.css";
// import axios from "axios";
// import Modal from "react-modal";
// import { useEffect, useState } from "react";
// import Nav from "../Nav/Nav";
// import Trush_Icon from "../../Assets/img/Trush_Icon.png";
// import Edit from "../../Assets/img/edit.png";
// const Category = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [sectionData, setSectionData] = useState([]);
//   const [sectionNew, setSectionNew] = useState({
//     fullName: "",
//     phoneNumber: "",
//     role: "",
//   });
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [showActions, setShowActions] = useState(false);

//   const token =
//     "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJmMGIwMmYxNC1jOWYwLTQ3NGQtOTI1OS1hY2E4Y2EwYjVmNmQiLCJpYXQiOjE3MDA3NDM2MTcsImV4cCI6MTcwMTM0ODQxNywiaXNzIjoiRGFsYWRhbi51eiBwcm9qZWN0Iiwicm9sZSI6IlJPTEVfQURNSU4iLCJpZCI6ImYwYjAyZjE0LWM5ZjAtNDc0ZC05MjU5LWFjYThjYTBiNWY2ZCJ9.ec7cbl2Tw9MaCOHKSP9YETY17r1jLLZdDTNP1txAbBw";
//   axios.post("http://188.225.10.97:8080/api/v1/category", sectionNew, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   useEffect(() => {
//     // Fetch data from the API when the component mounts
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const response = await axios.get(
//         "http://188.225.10.97:8080/api/v1/category"
//       );
//       setSectionData(response.data);
//     } catch (error) {
//       console.error("Error fetching data:", error.message);
//     }
//   };

//   const handleFormSubmit = async (event) => {
//     event.preventDefault();
  
//     if (!sectionNew.fullName || !sectionNew.phoneNumber || !sectionNew.role) {
//       alert("Please fill in all information");
//       return;
//     }
  
//     try {
//       const response = await axios.post(
//         "http://188.225.10.97:8080/api/v1/category",
//         sectionNew,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
  
//       // Check the response status
//       if (response.status === 200) {
//         console.log("Request successful:", response.data);
//         // Fetch updated data after adding
//         fetchData();
//         setSectionNew({
//           fullName: "",
//           phoneNumber: "",
//           role: "",
//         });
//         closeModal();
//       } else {
//         console.error("Request failed with status code", response.status);
//       }
//     } catch (error) {
//       console.error("Error adding data:", error.message);
//     }
//   };
  

//   const handleEditClick = (index) => {
//     setSectionNew(sectionData[index]);
//     setEditingIndex(index);
//     openModal();
//   };

//   const handleDeleteClick = async (index) => {
//     try {
//       await axios.delete(
//         `http://188.225.10.97:8080/api/v1/category/${sectionData[index]._id}`
//       );
//       fetchData();
//     } catch (error) {
//       console.error("Error deleting data:", error.message);
//     }
//   };

//   const openModal = () => {
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setEditingIndex(null);
//   };

//   const handleActionsClick = () => {
//     setShowActions(!showActions);
//   };

//   Modal.setAppElement("#root"); // Assuming your root element has the id "root"

//   return (
//     <div className="contianer">
//       <Nav />

//       <div className="box">
//         <button className="modal-btn" onClick={openModal}>
//           +
//         </button>
//       </div>

//       <h2>Dehqonchilik</h2>
//       <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
//         <div className="modal-content">
//           <div className="modal-header">
//             <h2 className="modal-title">Bo’lim qo’shish</h2>
//             <button className="close-btn" onClick={closeModal}>
//               &#10006;
//             </button>
//             <form className="modal-form" onSubmit={handleFormSubmit}>
//               <label htmlFor="sectionName">Full name</label>
//               <input
//                 type="text"
//                 className="input-name"
//                 id="sectionName"
//                 name="fullName"
//                 placeholder="Full name"
//                 autoComplete="off"
//                 value={sectionNew.fullName}
//                 onChange={(e) =>
//                   setSectionNew({ ...sectionNew, fullName: e.target.value })
//                 }
//               />
//               <label htmlFor="phoneNumber">Phone number</label>
//               <input
//                 className="phoneNumber"
//                 type="tel"
//                 id="phoneNumber"
//                 name="phoneNumber"
//                 autoComplete="off"
//                 placeholder="+998"
//                 value={sectionNew.phoneNumber}
//                 onChange={(e) => {
//                   setSectionNew({
//                     ...sectionNew,
//                     phoneNumber: e.target.value
//                       .replace(/\D/g, "")
//                       .replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"),
//                   });
//                 }}
//               />

//               <label htmlFor="role">Role</label>
//               <input
//                 className="role"
//                 type="text"
//                 id="role"
//                 name="role"
//                 autoComplete="off"
//                 value={sectionNew.role}
//                 placeholder="Role"
//                 onChange={(e) =>
//                   setSectionNew({ ...sectionNew, role: e.target.value })
//                 }
//               />
//               <button className="save-btn" type="submit">
//                 Saqlash
//               </button>
//             </form>
//           </div>
//         </div>
//       </Modal>

//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Full name</th>
//             <th>Teefon raqam</th>
//             <th>Category ru</th>
//             <th></th>
//           </tr>
//         </thead>
//         <tbody>
//           {sectionData.map((section, index) => (
//             <tr key={index}>
//               <td>{index + 1}</td>
//               <td>{section.fullName}</td>
//               <td>{section.phoneNumber}</td>
//               <td>{section.role}</td>
//               <td>
//                 <button className="category-btn" onClick={handleActionsClick}>
//                   &#x22EE;
//                 </button>
//                 {showActions && (
//                   <div>
//                     <button
//                       className="button-delete"
//                       onClick={() => handleDeleteClick(index)}
//                     >
//                       <img
//                         src={Trush_Icon}
//                         alt="Trush"
//                         width={25}
//                         height={25}
//                       />
//                       O’chirish
//                     </button>
//                     <button
//                       className="button-edit"
//                       onClick={() => handleEditClick(index)}
//                     >
//                       <img src={Edit} alt="Edit" height={25} />
//                       O’zgartirish
//                     </button>
//                   </div>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Category;
