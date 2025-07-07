import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Auth/Login";
import ForgotPassword from "./Pages/Auth/LupaPassword";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Admin from "./Pages/Admin/Admin";
import Chatbot from "./Pages/Chatbot/Chatbot";
import Riwayat from "./Pages/Chatbot/RiwayatChatbot";
import Intent from "./Pages/Komponen/Intent";
import Utterance from "./Pages/Komponen/Utterance";
import Action from "./Pages/Komponen/Action";
import LatihModel from "./Pages/Model/LatihModel";
import KonfigurasiModel from "./Pages/Model/KonfigurasiModel";
import Percakapan from "./Pages/Percakapan/Percakapan";
import Dokumentasi from "./Pages/Dokumentasi/Dokumentasi";
import Profile from "./Pages/Auth/Profile";
import DetailTracker from "./Pages/Chatbot/DetailTracker";
import CreatePercakapan from "./Pages/Percakapan/CreatePercakapan";
import DetailPercakapan from "./Pages/Percakapan/DetailPercakapan";
import { AuthContext } from "./context/AuthContext";
import { useContext, useEffect } from "react";
import ProtectedRoute from "./Components/ProtectedRoute";
import axiosServer from "./Components/Helper/axiosBackend";

function App() {
  const {  dispatch, token, isLoggedIn } = useContext(AuthContext);

  //get ac_token
  useEffect(()=>{
    const _appLogin = localStorage.getItem("_appLogin");
    if(_appLogin){
      const getToken = async () => {
        const res = await axiosServer.post("/api/auth/access", null)
        dispatch({type: "GET_TOKEN", payload: res.data.ac_token})
      }
      getToken()
    }
  }, [dispatch, isLoggedIn])

  //getUserData
  useEffect(()=>{
    if(token){
      const getUser = async () => {
        dispatch({type: "LOGIN"})
        const res = await axiosServer.get("/api/auth/account", {
          headers: {Authorization: token}
        })
        dispatch({type: "GET_USER", payload: res.data})
      }
      getUser()
    }
  }, [token, dispatch])

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={ isLoggedIn ? <Dashboard /> : <Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chatbot"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Chatbot />
            </ProtectedRoute>
          }
        />
        <Route
          path="/riwayat"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Riwayat />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/riwayat/:category/:id"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <DetailTracker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/component/intent"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Intent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/component/utterance"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Utterance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/component/action"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Action />
            </ProtectedRoute>
          }
        />
        <Route
          path="/model/latih"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <LatihModel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/model/konfigurasi"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <KonfigurasiModel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/percakapan"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Percakapan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/percakapan/:type/:name"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <CreatePercakapan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/percakapan/edit/:type/:name"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <DetailPercakapan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dokumentasi"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Dokumentasi />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;