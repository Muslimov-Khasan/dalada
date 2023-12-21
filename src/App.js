import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./page/Login/Login";
import Category from "./components/category/category";
import ImageUpload from "./components/Banner/Banner";
import News from "./components/News/News";
import Catolog from "./components/catolog/catolog";
import Header from "./components/Header/Header";
import Monitoring from "./components/Monitoring/Monitoring";
import UzbekistanMap from "./components/UzbekistanMap/UzbekistanMap";
// import Moderator from "./components/Moderator/Moderator";
function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Monitoring />} />
        <Route path="/add-category" element={<Catolog />} />
        <Route path="/category" element={<Category />} />
        <Route path="/adminAdd" element={<Header />} />
        <Route path="/news" element={<News />} />
        <Route path="/image-upload" element={<ImageUpload />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Map" element={<UzbekistanMap />} />
      </Routes>
      {/* <Moderator/> */}
    </div>
  );
}

export default App;
