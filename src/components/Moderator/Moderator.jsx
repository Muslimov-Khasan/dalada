import React, { useState } from "react";
import LocationIcon from "../../Assets/img/location.svg";
import Modal from "react-modal";
import Logo from "../../Assets/img/Logo.svg";
import Onion from "../../Assets/img/Onion.png";
import "./Moderator.css";

const Moderator = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpenDelete, setModalIsOpenDelete] = useState(false);

  // State for form inputs within the modal
  const [productName, setProductName] = useState("");
  const [comment, setComment] = useState("");
  const [price, setPrice] = useState("");
  const [region, setRegion] = useState("");
  const [weight, setWeight] = useState("");
  const [district, setDistrict] = useState("");
  const [village, setVillage] = useState("");
  // const [newModerator, setNewModerator] = useState({
  //   productName: "",
  //   price: "",
  //   region: "",
  //   weight: "",
  //   district: "",
  //   village: "",
  // });

  const openModal = () => {
    setModalIsOpen(true);
  };
  const openModalDelete = () => {
    setModalIsOpenDelete(true);
  };

  const closeModalDelete = () => {
    setModalIsOpenDelete(false);
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can perform any additional actions here if needed
    closeModal();
  };
  Modal.setAppElement("#root"); // Assuming your root element has the id "root"

  return (
    <>
      <div className="contianer-fulid">
        <img src={Logo} alt="logo" width={164} height={42} />
        <h2 className="moderator-title">Yangi qo’shilgan</h2>
        <div className="all">
          <ul className="product-list">
            <li className="product-item" onClick={openModal}>
              <img src={Onion} alt="Onion" width={170} height={160} />
              <div className="wrapper-location">
                <h2 className="product-title">Piyoz {productName}</h2>
                <p className="product-text">
                  Poliz ekinlari - oziq-ovqat, yem-xashak va texnika
                  maqsadlarida ekiladigan, palak otib oʻsadigan madaniy ekinlar
                  guruhi. Ayrim olimlar Poliz ekinlariga faqat tarvuz, kovun va
                  qovoqnn kiritadilar; chirmashib yoki yerda yotib usadi.
                  {comment}
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
                    <p className="location-word">
                      Qashqadaryo v. Yakkabog’ t.
                      {region} {district} {village}
                    </p>
                    <p className="kg">33 kg {weight}</p>
                    <p className="price">4 000 So'm {price}</p>
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
        <div className="good">
          <form className="form-product">
            <div>
              <label htmlFor="Nomi *">Nomi *</label>
              <input
                className="input-product"
                type="text"
                placeholder="Kartoshka"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
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
              <h2 className="label-img">Rasm *</h2>
              <img
                src="https://placehold.co/100"
                alt=""
                width={96}
                height={96}
              />
              <img
                src="https://placehold.co/100"
                alt=""
                width={96}
                height={96}
              />
              <img
                src="https://placehold.co/100"
                alt=""
                width={96}
                height={96}
              />
            </form>
          </div>

          <form className="form-price">
            <div>
              <label htmlFor="Narxi (so'm) *">Narxi (so'm) *</label>
              <input
                className="input-price"
                type="text"
                placeholder="3 500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="Miqdori (tonna) *">Miqdori (tonna) *</label>
              <input
                className="input-price"
                type="text"
                placeholder="3"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
          </form>

          <p className="comment">izoh *</p>
          <textarea
            className="comment-word"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <div>
          <form className="province-form">
            <div>
              <label htmlFor="Viloyat *">Viloyat *</label>
              <select
                className="province-select"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option value="Qashqadaryo">Qashqadaryo</option>
                <option value="Surxondaryo">Surxondaryo</option>
                <option value="Namangan">Namangan</option>
                <option value="Samarqand">Samarqand</option>
                <option value="Andijon">Andijon</option>
              </select>
            </div>
            <div>
              <label htmlFor="Tuman *">Tuman *</label>
              <select
                className="province-select"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              >
                <option value="Yakkabog’">Yakkabog’</option>
                <option value="Boysun">Boysun</option>
                <option value="Jalaquduq">Jalaquduq</option>
                <option value="Olamazor">Olamazor</option>
                <option value="Bodomzor">Bodomzor</option>
              </select>
            </div>
            <div>
              <label htmlFor="Neighborhood">Qishloq/tuman nomi</label>
              <input
                className="neighborhood-input"
                type="text"
                id="Neighborhood"
                placeholder="G’urjob"
                autoComplete="off"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
              />
            </div>
          </form>

          <p className="contact-text">Aloqa uchun qo’shimcha telefon raqam</p>
          <p className="contact-text">+998 94 332 00 16</p>

          <div className="wrapper-button">
            <button className="modal-delete" onClick={openModalDelete}>
              Delete
            </button>
            <button
              className="confirmation-confirmation"
              onClick={handleSubmit}
            >
              Tasdiqlash
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={modalIsOpenDelete}
        onRequestClose={closeModalDelete}
        contentLabel="Example Modal"
      >
        <div>
          <form className="form-comment">
            <label htmlFor="Izoh">Izoh</label>
            <textarea cols="30" rows="10" placeholder="Izoh"></textarea>
            <button className="confirmation-btn">Tasdiqlash</button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default Moderator;
