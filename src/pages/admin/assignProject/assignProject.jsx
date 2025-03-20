import styles from './assignProject.module.scss'
import { AnimatePresence, motion } from "framer-motion";
import Loading from "../../../components/loading/loading";
// import { useNavigate } from "react-router-dom";
import useAssignProjects from './useAssignProjects';
import { toast } from 'react-toastify';

const AssignProject = () => {

  const {
    loading,
    filteredProjects,
    setSearchTerm,
    searchTerm
  } = useAssignProjects();

  // const navigate = useNavigate()

  return (
    <>
      <section className={`${styles.assignProject}`}>

        <>
          {loading ? (
            <Loading />
          ) : (
            <section className={styles.projects}>
              <div className="mt-3">
                <div className="row">
                  <div className="col-6"></div>

                  <div className="col-6">
                    <input
                      type="text"
                      placeholder="Search Projects"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              <div className="row mt-3">
                <AnimatePresence>
                  {filteredProjects.length === 0 ? (
                    <h3 className="text-center mt-5">No Projects Found</h3>
                  ) : (
                    filteredProjects.map((project, index) => (
                      <motion.div
                        key={index}
                        className="col-4 p-2"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        onClick={() => {
                          toast.warning("Service Not Avaiable")
                        }}
                      >
                        <div className={styles.serviceItem}>

                          <div>
                            <h3>{project?.projectName}</h3>
                          </div>

                          <h5>Address: {project?.siteAddress}</h5>

                          <span>Status: {project?.status}</span>

                          <div>
                            <button className='simple-btn mt-3'>Assign Staff</button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </section>
          )}
        </>

      </section>
    </>
  )
}

export default AssignProject