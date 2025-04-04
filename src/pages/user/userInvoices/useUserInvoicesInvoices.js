import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiService from "../../../utils/apiClient";
import { useSelector } from "react-redux";
import NProgress from "nprogress";

const useUserInvoice = () => {
    const [loading, setLoading] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [showModel, setShowModel] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const currentUser = useSelector((state) => state.user.user);

    const handleClose = () => {
        setShowModel(false);
        setSelectedInvoice(null);
    };

    const handleOpen = (invoice) => {
        setSelectedInvoice(invoice);
        setShowModel(true);
    };

    useEffect(() => {
        if (!currentUser?._id || !currentUser?.role) return;

        let isMounted = true;

        const fetchInvoices = async () => {
            try {
                setLoading(true);
                NProgress.start();
                const endpoint = currentUser.role === "admin"
                    ? "/invoice/get-invoices"
                    : `/invoice/get-invoices/${currentUser._id}`;

                const response = await apiService.get(endpoint);

                if (isMounted) {
                    setInvoices(response.data.invoices);
                }
            } catch (error) {
                console.error("Error fetching invoices:", error);
                toast.error(error.response?.data?.message || "Failed to fetch invoices.");
            } finally {
                setLoading(false);
                NProgress.done();
            }
        };

        fetchInvoices();

        return () => {
            isMounted = false;
        };
    }, [currentUser?._id, currentUser?.role]);

    // Mark invoice as Paid
    const handleMarkAsPaid = async (invoiceId) => {
        try {
            NProgress.start();
            const response = await apiService.put(`/invoice/mark-as-paid/${invoiceId}`);

            // Update local state after successful update
            setInvoices((prevInvoices) =>
                prevInvoices.map((inv) =>
                    inv._id === invoiceId ? { ...inv, status: "Paid" } : inv
                )
            );

            toast.success(response.data.message || "Invoice marked as Paid.");
            handleClose();
        } catch (error) {
            console.error("Error marking invoice as paid:", error);
            toast.error(error.response?.data?.message || "Failed to update invoice.");
        } finally {
            NProgress.done();
        }
    };

    return {
        invoices,
        loading,
        showModel,
        selectedInvoice,
        handleClose,
        handleOpen,
        handleMarkAsPaid
    };
};

export default useUserInvoice;
