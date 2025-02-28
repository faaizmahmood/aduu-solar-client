import { useSelector } from "react-redux";
import AdminProjects from "../../admin/projects/projects"
import StaffProjects from "../../staff/projects/projects"
import UserProjects from "../../user/projects/projects"



const Projects = () => {

    const { user } = useSelector((state) => state.user);
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const currentUser = user || storedUser;
    const userRole = currentUser?.role || "";

    return (
        <>

            <section className='projects'>

                {userRole === "admin" && <AdminProjects />}
                {userRole === "staff" && <StaffProjects />}
                {userRole === "client" && <UserProjects />}

            </section>

        </>
    )
}

export default Projects