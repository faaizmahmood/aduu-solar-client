import { NavLink, Outlet, } from "react-router-dom";
import styles from './projectDetails.module.scss'
import useProjectDetails from "./useProjectDetails";
import Loading from "../../../components/loading/loading";

const UserProjectDetails = () => {

    const {
        loading,
        projectData
    } = useProjectDetails()

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
