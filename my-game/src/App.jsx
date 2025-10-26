import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useGameLogic } from "./hooks/useGameLogic";
import MainPage from "./pages/MainPage";
import BoostPage from "./pages/BoostPage";
import FriendsPage from "./pages/FriendsPage";
import TasksPage from "./pages/TasksPage";
import Wallets from "./pages/Wallets"; // ✅ اضافه شد
import Snackbar from "./components/Snackbar";
import Navbar from "./components/Navbar";
import { useState } from "react";

function App() {
  const game = useGameLogic();
  const [snackbar, setSnackbar] = useState("");

  const showSnackbar = (msg) => {
    setSnackbar(msg);
    setTimeout(() => setSnackbar(""), 2500);
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex flex-col">
      <div className="flex-grow overflow-auto">
        <Routes>
          <Route
            path="/"
            element={<MainPage {...game} showSnackbar={showSnackbar} />}
          />
          <Route
            path="/boost"
            element={<BoostPage {...game} showSnackbar={showSnackbar} />}
          />
          <Route
            path="/friends"
            element={<FriendsPage {...game} showSnackbar={showSnackbar} />}
          />
          <Route
            path="/tasks"
            element={<TasksPage {...game} showSnackbar={showSnackbar} />}
          />
          <Route
            path="/wallets"
            element={<Wallets />} // ✅ مسیر جدید اضافه شد
          />
        </Routes>
      </div>
      <Navbar />
      {snackbar && <Snackbar message={snackbar} />}
    </div>
  );
}

export default App;
