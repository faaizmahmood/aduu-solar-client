import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiService from "../../../utils/apiClient";
import { toast } from "react-toastify";

const useProjectDetails = () => {
    const { projectID } = useParams();
    const [projectData, setProjectData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [unauthorized, setUnauthorized] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await apiService.get(`/project/get-single-project/${projectID}`);
                setProjectData(response.data);
            } catch (err) {
                if (err.response?.status === 403) {
                    setUnauthorized(true);
                } else {
                    toast.error(err.message || "Something went wrong");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectID]);

    return { projectData, loading, unauthorized };
};

export default useProjectDetails;
