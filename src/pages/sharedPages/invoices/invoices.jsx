import { useSelector } from "react-redux";
import UserInvoices from "../../user/userInvoices/userInvoices";


const Invoices = () => {

    // Get user details from Redux store or localStorage
    const { user } = useSelector((state) => state.user);
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const currentUser = user || storedUser;
    const userRole = currentUser?.role || "";


    return (
        <>
            {userRole === "admin" && <UserInvoices />}
            {userRole === "client" && <UserInvoices />}
        </>
    )
}

export default Invoices