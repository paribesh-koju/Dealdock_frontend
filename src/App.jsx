import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StartPage from "./pages/Start/Startpage";
import LoginPage from "./pages/login/LoginPage";
import SignUpPage from "./pages/Register/SignUpPage";
import "react-toastify/dist/ReactToastify.css";
import ProfilePage from "./pages/profile/Profile";
import UserRoutes from "./pages/protected_route/UserRoutes";

import Productpage from "./pages/product/Productpage";
import Header from "./components/Header";
import Homepage from "./pages/homepage/Honepage";
import Support from "./pages/contact/support";
import { User } from "lucide-react";
import { socketService } from "./services/socketService";
import Unproduct from "./pages/backproduct/Uncessable";
import UpdateProduct from "./pages/update/ProductUpdate";
import { ToastContainer } from "react-toastify";

function App() {
  useEffect(() => {
    socketService.connect();
    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        {/* Define routes for your pages */}
        <Route path="/" element={<StartPage />} />

        {/* <Route path="/marketplace" element={<MarketplaceUI />} /> */}
        <Route path="/product/:productId" element={<Productpage />} />
        <Route path="/unproduct/:productId" element={<Unproduct />} />
        {/* <Route path="/post" element={<Postpage />} /> */}

        <Route path="/support" element={<Support />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route element={<UserRoutes />}>
          <Route path="/home" element={<Homepage />} />
          <Route path="/updateproduct/:productId" element={<UpdateProduct />} />

          {/* <Route path='/profile/:id' element={<UserProfile/>} /> */}
          <Route path="/profile" element={<ProfilePage />} />
          {/* <Route path="/message" element={<Chat />} /> */}
        </Route>
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
