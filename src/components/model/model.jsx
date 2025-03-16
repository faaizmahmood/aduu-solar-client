import { motion, AnimatePresence } from "framer-motion"; //


// eslint-disable-next-line react/prop-types
const Model = ({ showModal, handleClose, children }) => {

    return (
        <>
            <AnimatePresence>
                {showModal && (
                    <>
                        <motion.div
                            className={"modalBackdrop"}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleClose}
                        />

                        <motion.div
                            className={"modalContent"}
                            initial={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%" }}
                            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                            exit={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%" }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >

                            {children}

                            <motion.span
                                className={"closeBtn"}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleClose}
                            >
                                <i className="fa-regular fa-xmark mt-2"></i>
                            </motion.span>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

export default Model