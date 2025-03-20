/* eslint-disable react/prop-types */
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import s3UploadFile from "../../utils/s3Upload";
import styles from './DynamicIntakeForm.module.scss';

const DynamicIntakeForm = ({ service, formData, handleFormChange, errors }) => {

    const onDrop = useCallback(async (acceptedFiles, fieldLabel, setLoading) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];

            try {
                setLoading(true);
                const fileUrl = await s3UploadFile(file);
                handleFormChange(service._id, fieldLabel, fileUrl);
            } catch (error) {
                console.log(error)
                toast.error("File upload failed..");
            } finally {
                setLoading(false);
            }
        }
    }, [handleFormChange, service._id]);

    return (
        <div className="container">
            <h4 className="mt-3">{service.serviceName} Intake Form</h4>
            {service.intakeForm.map((field) => (
                <div key={field._id} className="mt-3">
                    <label className="form-label">{field.label}</label>

                    {(field.fieldType === "text" || field.fieldType === "number") && (
                        <input
                            type={field.fieldType}
                            value={formData[field.label] || ""}
                            onChange={(e) => handleFormChange(service._id, field.label, e.target.value)}
                            className="form-control"
                            placeholder={field.label}
                        />
                    )}

                    {field.fieldType === "select" && Array.isArray(field.options ?? []) && (
                        <select
                            value={formData[field.label] || ""}
                            onChange={(e) => handleFormChange(service._id, field.label, e.target.value)}
                            className="form-select"
                        >
                            <option value="">Select an option</option>
                            {field.options.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                    )}

                    {field.fieldType === "file" && (
                        <FileDropzone field={field} onDrop={onDrop} selectedFile={formData[field.label]} />
                    )}

                    {errors[field.label] && <p className="error mt-2">{errors[field.label]}</p>}
                </div>
            ))}
        </div>
    );
};

const FileDropzone = ({ field, onDrop, selectedFile }) => {
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(false);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => {
            setFileName(acceptedFiles[0]?.name || "");
            onDrop(acceptedFiles, field.label, setLoading);
        },
        multiple: false,
        accept: "image/*, application/pdf",
    });

    return (
        <div className={`mt-2 p-4 rounded text-center ${styles.dragDropFile} ${isDragActive ? styles.activeDrag : ''}`} {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
                <p className="text-secondary">Drop the file here...</p>
            ) : (
                <p className="text-muted">Drag & drop a file here, or click to select</p>
            )}

            {loading ? (
                <p className="text-primary mt-2">Uploading file... ⏳</p>
            ) : selectedFile ? (
                <h5 className="text-success mt-2">
                    Uploaded File: <a href={selectedFile} target="_blank" rel="noopener noreferrer">View File</a>
                </h5>
            ) : fileName && (
                <h5 className="text-success mt-2">Selected File: {fileName}</h5>
            )}
        </div>
    );
};

export default DynamicIntakeForm;
