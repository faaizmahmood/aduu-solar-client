import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import apiService from "../../utils/apiClient";


const useProjectOverview = () => {

    const { projectID } = useParams();
    const [projectData, setProjectData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await apiService.get(`/project/get-single-project/${projectID}`);
                setProjectData(response.data);
            } catch (err) {
                toast.error(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectID]);

    return { projectData, loading };
}

export default useProjectOverview