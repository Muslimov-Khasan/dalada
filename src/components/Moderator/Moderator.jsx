import React, { useState } from "react";
import LocationIcon from "../../Assets/img/location.svg";
import Modal from "react-modal";

import Logo from "../../Assets/img/Logo.svg";
import Onion from "../../Assets/img/Onion.png";
import "./Moderator.css";
const Moderator = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  Modal.setAppElement("#root"); // Assuming your root element has the id "root"

  return (
    <>
      <div className="contianer">
        <img src={Logo} alt="logo" width={164} height={42} />
        <h2 className="moderator-title">Yangi qo’shilgan</h2>
        <div className="all">
          <ul className="product-list">
            <li className="product-item" onClick={openModal}>
              <img src={Onion} alt="Onion" width={170} height={160} />
              <div className="wrapper-location">
                <h2 className="product-title">Piyoz</h2>
                <p className="product-text">
                  Poliz ekinlari - oziq-ovqat, yem-xashak va texnika
                  maqsadlarida ekiladigan, palak otib oʻsadigan madaniy ekinlar
                  guruhi. Ayrim olimlar Poliz ekinlariga faqat tarvuz, kovun va
                  qovoqnn kiritadilar; chirmashib yoki yerda yotib usadi.
                </p>
                <div className="voydod">
                  <img
                    className="location-icon"
                    src={LocationIcon}
                    alt="Location-Icon"
                    width={18}
                    height={23}
                  />
                  <div className="go">
                    <p className="location-word">Qashqadaryo v. Yakkabog’ t.</p>
                    <p className="kg">3.5 tonna</p>
                    <p className="price">2 200 so’m</p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
        <button className="close-btn" onClick={closeModal}>
          &#10006;
        </button>

        <form className="form-product">
          <div>
            <label htmlFor="Nomi *">Nomi *</label>
            <input
              className="input-product"
              type="text"
              placeholder="Kartoshka"
            />
          </div>
          <div>
            <label htmlFor="Kategoriya *">Kategoriya *</label>
            <select className="products-select">
              <option value="Dala maxsilotlari">Dala maxsilotlari</option>
              <option value="Dala maxsilotlari">Ekin maxsilotlari</option>
              <option value="Dala maxsilotlari">Meva maxsilotlari</option>
            </select>
          </div>
        </form>
        <div className="imgages">
          <form className="form-lord">
            <h2 className="label-img" >Rasm *</h2>
            <img src="https://placehold.co/100" alt="" width={96} height={96} />
            <img src="https://placehold.co/100" alt="" width={96} height={96} />
            <img src="https://placehold.co/100" alt="" width={96} height={96} />
          </form>
        </div>
      </Modal>
    </>
  );
};

export default Moderator;
