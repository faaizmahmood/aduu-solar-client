import { useSelector } from 'react-redux'
import styles from './projectDetails.module.scss'
import AdminProjectDetails from '../../admin/projectDetails/projectDetails'

const ProjectDetails = () => {

    const currentUser = useSelector((state) => state.user.user)

    return (
        <>

            <section className={`${styles.projectDetails}`}>
                {currentUser?.role && <AdminProjectDetails />}
            </section>

        </>
    )
}

export default ProjectDetails