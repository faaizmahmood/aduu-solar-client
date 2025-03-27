/* eslint-disable no-unused-vars */
import styles from './assignProject.module.scss';
import { AnimatePresence, motion } from "framer-motion";
import Loading from "../../../components/loading/loading";
import useAssignProjects from './useAssignStaff';
import { useState } from "react";
import { toast } from "react-toastify";

const AssignProject = () => {
  const {
    loading,
    project,
    staffList,
    isValidUrl,
    handleSelectStaff,
    handleAssignStaff,
    selectedStaff,
    setSelectedStaff
  } = useAssignProjects();


  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <section className={`${styles.assignProject} mt-4`}>
          <div className="row">
            {/* Left Side: Project Details */}
            <div className={`col-md-6 p-2`}>
              <div className={`${styles.projectDetails}`}>
                <div className={`${styles.model_contant} text-start`}>
                  <h3>Project Name: <span className='fw-medium'>{project?.projectName ?? "N/A"}</span></h3>
                  <h5>Company Name: <span>{project?.companyId ?? "N/A"}</span></h5>
                  <h5>Client Name: <span>{project?.siteOwner ?? "N/A"}</span></h5>
                  <h5>Site Address: <span>{project?.siteAddress ?? "N/A"}</span></h5>

                  <h5>Assigned Staff:{" "}
                    <span>
                      {project?.assignedStaff?.length > 0
                        ? project.assignedStaff.map((ele) => ele.name).join(", ")
                        : "N/A"}
                    </span>
                  </h5>

                  {project?.order?.services?.length > 0 && (
                    <>
                      <h4 className="mt-4">Ordered Services Details</h4>
                      {project.order.services.map((service, index) => (
                        <div key={index} className={`${styles.servicesItem} my-3`}>
                          <hr />
                          <h5 className={`${styles.serviceName}`}>{service.serviceName ?? "N/A"}</h5>
                          {service.formResponses?.length > 0 ? (
                            service.formResponses.map((response, i) => (
                              <h5 key={i}>
                                {response.fieldName ?? "N/A"}:{" "}
                                {isValidUrl(response.fieldValue) ? (
                                  <a href={response.fieldValue} target="_blank" rel="noopener noreferrer" className="text-primary">
                                    {response.fieldValue}
                                  </a>
                                ) : (
                                  response.fieldValue ?? "N/A"
                                )}
                              </h5>
                            ))
                          ) : (
                            <h5 className="text-muted">N/A</h5>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side: Staff List & Assignment */}
            <div className={`col-md-6 p-2`}>
              <div className={`${styles.assignmentDetails}`}>
                <h3>Available Staff</h3>
                <div className="staff-list mt-3">
                  {staffList?.length > 0 ? (
                    staffList.map((member) => {
                      const isSelected = selectedStaff.some((s) => s._id === member._id);

                      return (
                        <div
                          key={member._id}
                          className={`${styles.staffCard} p-3 mb-2 d-flex justify-content-between align-items-center`}
                          style={{
                            border: isSelected ? "2px solid #fff" : "1px solid gray",
                            borderRadius: "8px",
                            cursor: "pointer",
                            backgroundColor: isSelected ? "#1A1E34" : "#fff",
                            color: isSelected ? "#fff" : "",
                            transition: "background-color 0.2s ease-in-out",
                          }}
                          onClick={() => handleSelectStaff(member)}
                        >
                          <div>
                            <h6 className="mb-0">{member.name}</h6>
                            <small >{member.email}</small>
                          </div>
                          <span className="text-primary">{member.role}</span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-muted">No available staff members.</p>
                  )}
                </div>

                {/* Assign Button */}
                <div className="mt-3">
                  <button
                    className='simple-btn'
                    onClick={handleAssignStaff}
                    disabled={selectedStaff.length === 0}
                    style={{
                      backgroundColor: selectedStaff.length > 0 ? "#1A1E34  " : "#ccc",
                      cursor: selectedStaff.length > 0 ? "pointer" : "not-allowed",
                      transition: "background-color 0.2s ease-in-out",
                    }}
                  >
                    {selectedStaff.length > 0
                      ? `Assign (${selectedStaff.length}) Staff`
                      : "Select staff to assign"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default AssignProject;
