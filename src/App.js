import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./page/Login/Login";
import Category from "./components/category/category";
import ImageUpload from "./components/Banner/Banner";
import News from "./components/News/News";
import Header from "./components/Header/Header";
import AddCategory from "./components/addcategory/addcategory";
import Monitoring from "./components/Monitoring/Monitoring";
import UzbekistanMap from "./components/UzbekistanMap/UzbekistanMap";
import FAQ from "./components/FAQ/FAQ";
import Moderator from "./components/Moderator/Moderator";
import Users from "./components/users/users";
function App() {
  const userRole = "ROLE_MODERATOR"; // Replace with your actual logic

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Monitoring />} />
        <Route path="/add-category" element={<AddCategory />} />
        <Route path="/category" element={<Category />} />
        <Route path="/adminAdd" element={<Header />} />
        <Route path="/news" element={<News />} />
        <Route path="/users" element={<Users />} />
        <Route path="/faq" element={<FAQ />} />
        <Route
          path="/Moderator"
          element={
            userRole === "ROLE_MODERATOR" ? (
              <Moderator />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="/image-upload" element={<ImageUpload />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Map" element={<UzbekistanMap />} />
      </Routes>
    </div>
  );
}

export default App;
