import { useEffect, useState } from 'react';
import styles from './projects.module.scss';
import apiService from '../../../utils/apiClient';
import { useNavigate } from 'react-router-dom';
import Loading from '../../../components/loading/loading';


const StaffProjects = () => {

    const [projects, setProjects] = useState([]);

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate()

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await apiService.get('/project/staff-projects'); // 🔁 Replace with your actual endpoint
                setProjects(response.data.assignedProjects);
            } catch (error) {
                console.error('Failed to fetch projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);



    const handleNavigation = (projectId) => {

        navigate(`/projects/project-details/${projectId}`)

    }

    return (
        <section className={`${styles.projects}`}>
            <div className='row'>
                {loading ? (
                    <Loading />
                ) : projects.length === 0 ? (
                    <div className="col-12 text-center py-5">
                        <h4>No projects assigned yet.</h4>
                        <p>Please check back later or contact the admin for project assignments.</p>
                    </div>
                ) : (
                    projects.map((project, ind) => (
                        <div className='col-4 p-2' key={ind} onClick={() => handleNavigation(project._id)}>
                            <div className={styles.projectItem} style={{ cursor: 'pointer' }}>
                                <h3>{project?.projectName ?? "N/A"}</h3>
                                <h4>Address: {project?.siteAddress ?? "N/A"}</h4>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );

};

export default StaffProjects;
