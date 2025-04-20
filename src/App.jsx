import { ToastContainer } from "react-toastify";
import "./styles/App.css";
import "nprogress/nprogress.css";
import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setError, setLoading } from "./redux/userSlice";
import Cookies from "js-cookie";
import ProtectedLayout from "./layout/protectedLayout";
import UnProtectedLayout from "./layout/unProtectedLayout";
import NProgress from "nprogress";
import { motion } from "framer-motion";
import apiService from "./utils/apiClient.js";
import Model from "./components/model/model.jsx";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [showRetryModal, setShowRetryModal] = useState(false);


  const fetchUserProfile = useCallback(async () => {

    const authToken = Cookies.get("authToken");
    const isAuthenticated = Boolean(authToken);

    if (!isAuthenticated || user) return;

    dispatch(setLoading(true));
    NProgress.start();

    try {
      const response = await apiService.get("/profile");
      dispatch(setUser(response.data.user));
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setShowRetryModal(false);
    } catch (error) {
      console.error("Error fetching profile:", error);



      dispatch(setError(error.message));
      setShowRetryModal(true);
    } finally {
      dispatch(setLoading(false));
      NProgress.done();
    }
  }, [dispatch, user]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const authToken = Cookies.get("authToken");
  const isAuthenticated = Boolean(authToken);

  return (
    <>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.3 }}
      >
        {isAuthenticated ? <ProtectedLayout /> : <UnProtectedLayout />}
      </motion.main>

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {showRetryModal && (
        <Model showModal={showRetryModal}>
          <div className="p-4 text-center">
            <h3>Something went wrong</h3>
            <p>Please try again.</p>
            <button onClick={fetchUserProfile} className="simple-btn">
              Retry
            </button>
          </div>
        </Model>
      )}
    </>
  );
}

export default App;
