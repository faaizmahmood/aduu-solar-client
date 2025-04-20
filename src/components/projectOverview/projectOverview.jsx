import Loading from "../loading/loading";
import styles from "./projectOverview.module.scss";
import useProjectOverview from "./useProjectOverview";

const ProjectOverview = () => {
    const { loading, projectData } = useProjectOverview();

    const services = projectData?.project?.order?.services || [];

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <section className={styles.projectOverview}>
                    <div className={styles.orderedServiceList}>
                        {services.length === 0 ? (
                            <p>No services found for this project.</p>
                        ) : (
                            services.map((order, i) => (
                                <div key={i} className={styles.serviceBlock}>
                                    <h3>{order.serviceName}</h3>

                                    {order.formResponses && order.formResponses.length > 0 ? (
                                        order.formResponses.map((response, idx) => (
                                            <div key={idx} className={styles.formResponse}>
                                                <h5>
                                                    <b>{response.fieldName}: </b>
                                                    {typeof response.fieldValue === "string" &&
                                                    response.fieldValue.startsWith("http") ? (
                                                        <a
                                                            href={response.fieldValue}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className={styles.link}
                                                        >
                                                            {response.fieldValue}
                                                        </a>
                                                    ) : (
                                                        response.fieldValue
                                                    )}
                                                </h5>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No responses submitted for this service.</p>
                                    )}

                                    <hr />
                                </div>
                            ))
                        )}
                    </div>
                </section>
            )}
        </>
    );
};

export default ProjectOverview;
