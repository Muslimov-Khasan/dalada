import "./App.css";
import Moderator from "./components/Moderator/Moderator";
// import Category from "./components/category/category";
// import { Routes, Route } from "react-router-dom";
// import ImageUpload from "./components/Banner/Banner";
// import News from "./components/News/News";
// import Addcategory from "./components/Add-category/Add-category";
// import Header from "./components/Header/Header";
// import Monitoring from "./components/Monitoring/Monitoring";

function App() {
  return (
    <div className="app">
      <Moderator/>
      {/* <Routes>
        <Route path="/" element={<Monitoring />} />
        <Route path="/add-category" element={<Addcategory />} />
        <Route path="/category" element={<Category />} />
        <Route path="/adminAdd" element={<Header />} />
        <Route path="/news" element={<News />} />
        <Route path="/image-upload" element={<ImageUpload />} />
      </Routes> */}
    </div>
  );
}

export default App;
