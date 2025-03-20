import { useEffect, useState } from "react";
import apiService from "../../../utils/apiClient";
import { toast } from "react-toastify";
import NProgress from "nprogress";

const useAssignProjects = () => {
    const [loading, setLoading] = useState(false);

    const [projects, setProjects] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        (async () => {
            try {
                NProgress.start();
                setLoading(true);

                const response = await apiService.get("/project/get-projects");

                if (response.status === 200) {

                    const projectsSlice = response.data.projects.filter((project) => project?.status === "Awaiting Assignment")

                    setProjects(projectsSlice);
                } else {
                    toast.error("Internal Server Error");
                }

            } catch (error) {
                console.error(error);
                toast.error("Internal Server Error");
            } finally {
                setLoading(false);
                NProgress.done();
            }
        })();
    }, []);


    const filteredProjects = projects.filter((project) =>
        project?.projectName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
        loading,
        projects,
        filteredProjects,
        setSearchTerm,
        searchTerm
    };
};

export default useAssignProjects;
