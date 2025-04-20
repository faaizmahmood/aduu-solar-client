// src/hooks/useMessaging.js
import { useEffect, useState } from "react";
import socket from "../../utils/socket";
import s3UploadFile from "../../utils/s3Upload";// make sure this path is correct

const useMessaging = (projectId, user) => {
    const [messages, setMessages] = useState([]);
    const [newMsg, setNewMsg] = useState("");
    const [uploading, setUploading] = useState(false);

    const [fileUrl, setFileUrl] = useState(null); // uploaded file
    const [fileName, setFileName] = useState(""); // show file name

    useEffect(() => {
        if (!projectId) return;

        socket.emit("joinProject", projectId);

        socket.on("receiveMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [projectId]);

    const handleFileUpload = async (file) => {
        alert("hi")
        if (!file) return;
        try {
            console.log("Uploading file:", file); // ✅ Debug: show file
            setUploading(true);
            const uploadedUrl = await s3UploadFile(file);
            console.log("Uploaded URL:", uploadedUrl); // ✅ Debug: show URL
            setFileUrl(uploadedUrl);
            setFileName(file.name);
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setUploading(false);
        }
    };
    

    const removeFile = () => {
        setFileUrl(null);
        setFileName("");
    };

    const sendMessage = () => {
        if (!newMsg.trim() && !fileUrl) return;

        const msgData = {
            sender: user.name,
            senderId: user._id,
            text: newMsg,
            file: fileUrl,
            timestamp: new Date(),
            projectId,
        };

        socket.emit("sendMessage", msgData);
        setMessages((prev) => [...prev, msgData]);

        // reset
        setNewMsg("");
        setFileUrl(null);
        setFileName("");
    };

    return {
        messages,
        newMsg,
        setNewMsg,
        sendMessage,
        uploading,
        handleFileUpload,
        fileUrl,
        fileName,
        removeFile
    };
};

export default useMessaging;
