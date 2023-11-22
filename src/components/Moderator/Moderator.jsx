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
        <div className="good">
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
              <label htmlFor="Narx (so’m) *">Narx (so’m) *</label>
              <input className="input-price" type="text" placeholder="3 500" />
            </div>
            <div>
              <label htmlFor="Miqdori (tonna) *">Miqdori (tonna) *</label>
              <input className="input-price" type="text" placeholder="3" />
            </div>
          </form>

          <p className="comment">Izoh *</p>
          <p className="comment-word">
            Kartoshka dunyoning turli mintaqalarida etishtiriladi, ularning eng
            yirik ishlab chiqaruvchilari Xitoy, Hindiston, Rossiya va AQShdir.
            Ular odatda bahorda ekilgan va kuzda yig'ib olinadi. Kartoshka
            moslashuvchanligi bilan mashhur va uni turli iqlim va tuproq
            turlarida etishtirish mumkin. Kartoshka turli zararkunandalar va
            kasalliklarga, jumladan kartoshka qo'ng'izlari, kech blight va erta
            blightga moyil. Fermerlar ko'pincha o'z ekinlarini himoya qilish
            uchun zararkunandalarga qarshi kurash usullari va kasalliklarga
            chidamli kartoshka navlarini qo'llashadi.
          </p>
        </div>
        <div>
          <form className="province-form">
            <label htmlFor="Viloyat *">Viloyat *</label>
            <select className="province-select">
              <option value="Qashqadaryo">Qashqadaryo</option>
              <option value="Surxondaryo">Surxondaryo</option>
              <option value="Namangan">Namangan</option>
              <option value="Samarqand">Samarqand</option>
              <option value="Andijon">Andijon</option>
            </select>
            <label htmlFor="Tuman *">Tuman *</label>
            <select className="province-select">
              <option value="Qashqadaryo">Qashqadaryo</option>
              <option value="Surxondaryo">Surxondaryo</option>
              <option value="Namangan">Namangan</option>
              <option value="Samarqand">Samarqand</option>
              <option value="Andijon">Andijon</option>
            </select>
            <label htmlFor="Qishloq / Mahalla nomi">
              Qishloq / Mahalla nomi
            </label>
            <input type="text" placeholder="G’urjob" />
          </form>

          <p className="contact-text">Aloqa uchun qo’shimcha telefon raqam</p>
          <p className="contact-text">+998 94 332 00 16</p>

          <div className="wrapper-button">
            <button className="modal-delete">O’chirish</button>
            <button className="confirmation-confirmation">Tasdiqlash</button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Moderator;
