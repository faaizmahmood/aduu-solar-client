import { ToastContainer } from "react-toastify";
import "./styles/App.css";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setError, setLoading } from "./redux/userSlice";
import axios from "axios";
import Cookies from "js-cookie"; // To read cookies
import ProtectedLayout from "./layout/protectedLayout";
import UnProtectedLayout from "./layout/unProtectedLayout";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user); // Prevent unnecessary API calls if user is already set

  const fetchUserProfile = useCallback(async () => {
    if (user) return;

    dispatch(setLoading(true));
    try {
      const authToken = Cookies.get("authToken");

      if (!authToken) throw new Error("No auth token found");

      const response = await axios.get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      dispatch(setUser(response.data.user));
      localStorage.setItem("user", JSON.stringify(response.data.user));
    } catch (error) {
      console.error("Error fetching profile:", error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, user]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);


  const authToken = Cookies.get("authToken");
  const isAuthenticated = Boolean(authToken);

  return (
    <>

      {
        isAuthenticated ? <ProtectedLayout /> : <UnProtectedLayout />
      }



      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
