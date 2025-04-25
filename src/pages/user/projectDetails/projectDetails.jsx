import { NavLink, Outlet, } from "react-router-dom";
import styles from './projectDetails.module.scss'
import useProjectDetails from "./useProjectDetails";
import Loading from "../../../components/loading/loading";
import { FaLock } from "react-icons/fa";

const UserProjectDetails = () => {

    const {
        loading,
        projectData,
        unauthorized
    } = useProjectDetails()



    if (unauthorized) {
        return (
            <div className={`unauthorized`} style={{ color: 'var(--primary-color)' }}>
                <FaLock size={64} className="text-red-500 mb-4" />
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Access Denied</h2>
                <p className="text-gray-600 mb-4">
                    You do not have permission to view this project.
                </p>
            </div>
        );
    }



    return (
        <>
            {
                loading ? (
                    <Loading />
                ) : (
                    <>
                        <section className={`${styles.projectDetails}`}>

                            <div className={`${styles.projectDetailsBanner} mt-3`}>

                                <div className="text-white">
                                    <h1 >{projectData.project.projectName || "N/A"}</h1>

                                    <h4>{projectData.project.siteOwner || "N/A"}</h4>

                                    <h5>{projectData.project.siteAddress || "N/A"}</h5>
                                </div>


                                {/* Tab Navigation */}
                                <div className={`flex g-4 ${styles.tabs}`}>
                                    <NavLink
                                        to="overview"
                                        className={({ isActive }) =>
                                            `${styles.tabLink} ${isActive ? styles.activeTab : ""}`
                                        }
                                    >
                                        Overview
                                    </NavLink>

                                    <NavLink
                                        to="messaging"
                                        className={({ isActive }) =>
                                            `${styles.tabLink} ${isActive ? styles.activeTab : ""}`
                                        }
                                    >
                                        Messages
                                    </NavLink>

                                </div>

                            </div>

                            {/* Render nested route component here */}
                            <div className={`${styles.tabComponents} mt-3`}>
                                <Outlet />
                            </div>

                        </section>
                    </>
                )
            }
        </>
    );
};

export default UserProjectDetails;
