// src/hooks/useMessaging.js
import { useEffect, useRef, useState } from "react";
import socket from "../../utils/socket";
import s3UploadFile from "../../utils/s3Upload";// make sure this path is correct
import apiService from '../../utils/apiClient'

const useMessaging = (projectId, user) => {

    const [loading, setLoading] = useState(false)

    const [messages, setMessages] = useState([]);

    const [projectDetails, setProjectDetails] = useState([]);

    const [files, setFiles] = useState([]);

    const [newMsg, setNewMsg] = useState("");

    const [uploading, setUploading] = useState(false);

    const [fileUrl, setFileUrl] = useState(null); // uploaded file

    const [fileName, setFileName] = useState(""); // show file name

    const bottomRef = useRef(null);

    const fileInputRef = useRef(null);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const [mention, setMention] = useState(false)

    const [mentionedPersons, setMentionedPersons] = useState([])

    // Emit 'updateLastReadMessage' when a new message arrives or when user scrolls to bottom
    useEffect(() => {
        if (messages.length > 0) {
            const payload = {
                projectId,
                userId: user?._id,
                userType: user.role === 'client' || user.role === 'admin' ? 'simple' : "staff"
            };
            // Emit update when a new message is received
            socket.emit("updateLastReadMessage", payload);
        }
    }, [messages, projectId, user?._id, user.role]);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);


    useEffect(() => {
        if (!projectId) return;


        const fetchMessages = async () => {
            try {
                setLoading(true)
                const res = await apiService.get(`/message/${projectId}`);
                setMessages(res.data.messages || []);
                setProjectDetails(res.data.project || []);
                setFiles(res.data.files || []);
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            } finally {
                setLoading(false)
            }
        };

        fetchMessages();

        socket.emit("joinProject", projectId);

        socket.on("receiveMessage", (msg) => {
            setMessages((prev) => [...prev, { ...msg, status: 'sent' }]);
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [projectId]);

    const handleFileUpload = async (file) => {
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

    const sendMessage = (e) => {

        e.preventDefault()

        if (!newMsg.trim() && !fileUrl) return;

        const tempId = Date.now();

        const msgData = {
            sender: user.name,
            senderId: user._id,
            text: newMsg,
            file: fileUrl,
            mentions: mentionedPersons,
            projectId,
            createdAt: new Date().toISOString(),
            status: 'sending',
        };

        // Optimistic UI
        // setMessages((prev) => [...prev, msgData]);

        // Reset input
        setNewMsg("");
        setFileUrl(null);
        setFileName("");
        setMentionedPersons([]); 

        // Emit to server
        socket.emit("sendMessage", msgData, (ack) => {
            if (ack?.success) {
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg._id === tempId ? { ...msg, status: 'sent' } : msg
                    )
                );
            } else {
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg._id === tempId ? { ...msg, status: 'failed' } : msg
                    )
                );
            }
        });
    };


    const retryMessage = (msg) => {
        socket.emit("sendMessage", msg, (ack) => {
            if (ack?.success) {
                setMessages((prev) =>
                    prev.map((m) => (m._id === msg._id ? { ...m, status: 'sent' } : m))
                );
            } else {
                setMessages((prev) =>
                    prev.map((m) => (m._id === msg._id ? { ...m, status: 'failed' } : m))
                );
            }
        });

        // Update status to 'sending' temporarily
        setMessages((prev) =>
            prev.map((m) => (m._id === msg._id ? { ...m, status: 'sending' } : m))
        );
    };


    const handleEmojiClick = (emojiData) => {
        setNewMsg((prev) => prev + emojiData.emoji);
    };

    const handleFileIconClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const handelMentionClick = () => {
        setMention(!mention)
    }

    const handelMentionPersonClick = (name) => {
        if (!mentionedPersons.includes(name)) { // Avoid duplicate mentions
            setMentionedPersons(prev => [...prev, name]);
        }
        setMention(false);
    }

    const handleRemoveMention = (name) => {
        setMentionedPersons(prev => prev.filter(person => person !== name));
    };

    return {
        loading,
        messages,
        newMsg,
        setNewMsg,
        sendMessage,
        uploading,
        handleFileUpload,
        fileUrl,
        fileName,
        removeFile,
        bottomRef,
        fileInputRef,
        handleFileIconClick,
        handleEmojiClick,
        showEmojiPicker,
        setShowEmojiPicker,
        retryMessage,
        projectDetails,
        files,
        handelMentionClick,
        mention,
        handelMentionPersonClick,
        mentionedPersons,
        handleRemoveMention
    };
};

export default useMessaging;