import { useSelector } from 'react-redux'
import styles from './projectDetails.module.scss'
import AdminProjectDetails from '../../admin/projectDetails/projectDetails'
import UserProjectDetails from '../../user/projectDetails/projectDetails'

const ProjectDetails = () => {

    const currentUser = useSelector((state) => state.user.user)

    return (
        <>

            <section className={`${styles.projectDetails}`}>
                {currentUser?.role === "Admin" && <AdminProjectDetails />}
                {currentUser?.role === "client" && <UserProjectDetails />}
                {currentUser?.role === "staff" && <UserProjectDetails />}
            </section>

        </>
    )
}

export default ProjectDetails