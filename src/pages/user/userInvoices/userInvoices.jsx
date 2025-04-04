import Loading from '../../../components/loading/loading';
import styles from './userInvoices.module.scss';
import useUserInvoice from './useUserInvoicesInvoices';
import Model from '../../../components/model/model';

const getStatusStyles = (status) => {
    switch (status) {
        case "Pending Payment":
            return { borderColor: "#f39c12", badgeClass: styles.pending };
        case "Paid":
            return { borderColor: "#2ecc71", badgeClass: styles.paid };
        case "Overdue":
            return { borderColor: "#e74c3c", badgeClass: styles.overdue };
        default:
            return { borderColor: "#bdc3c7", badgeClass: styles.default };
    }
};

const UserInvoices = () => {
    const {
        invoices,
        loading,
        showModel,
        selectedInvoice,
        handleClose,
        handleOpen,
        handleMarkAsPaid
    } = useUserInvoice();

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <section className={styles.invoice}>
                    <div className="row">
                        {invoices.length === 0 ? (
                            <div className="col-12 text-center">
                                <p>No invoices found.</p>
                            </div>
                        ) : (
                            invoices.map((invoice) => {
                                const { badgeClass } = getStatusStyles(invoice.status);

                                return (
                                    <div key={invoice._id} className="col-4 p-2">
                                        <div className={styles.invoiceItem} onClick={() => handleOpen(invoice)} style={{ cursor: 'pointer' }}>
                                            <div className={`${styles.statusBadge} ${badgeClass}`}>
                                                {invoice.status}
                                            </div>
                                            <p><strong>Invoice ID:</strong> {invoice._id}</p>
                                            <h5><strong>Total Amount:</strong> ${invoice.totalAmount}</h5>
                                            <h5><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</h5>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>
            )}

            {/* Invoice Details Modal */}
            {selectedInvoice && (
                <Model showModal={showModel} handleClose={handleClose}>
                    <div className={`${styles.invoiceDetails}`}>
                        <h4>Invoice Details</h4>
                        <div className='text-start'>
                            <h5><strong>Invoice ID:</strong> {selectedInvoice._id}</h5>
                            <h5><strong>Status:</strong> {selectedInvoice.status}</h5>
                            <h5><strong>Total Amount:</strong> ${selectedInvoice.totalAmount}</h5>
                            <h5><strong>Due Date:</strong> {new Date(selectedInvoice.dueDate).toLocaleDateString()}</h5>
                            <h5><strong>Services:</strong></h5>
                            <ul>
                                {selectedInvoice.services.map((service) => (
                                    <li key={service.serviceId}>
                                        {service.serviceName} - ${service.price}
                                    </li>
                                ))}
                            </ul>

                            {/* Mark as Paid Button (only for Pending/Overdue invoices) */}
                            {(selectedInvoice.status === "Pending Payment" || selectedInvoice.status === "Overdue") && (
                                <button className="simple-btn mt-3" onClick={() => handleMarkAsPaid(selectedInvoice._id)}>
                                    Mark as Paid
                                </button>
                            )}
                        </div>
                    </div>
                </Model>
            )}
        </>
    );
};

export default UserInvoices;
