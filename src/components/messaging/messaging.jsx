import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";

import useMessaging from "./useMessaging.js";
import styles from './messaging.module.scss';

const Messaging = () => {
    const { projectId } = useParams();
    const user = useSelector((state) => state.user.user);

    const {
        messages,
        newMsg,
        setNewMsg,
        sendMessage,
        uploading,
        handleFileUpload,
        fileUrl,
        fileName,
        removeFile
    } = useMessaging(projectId, user);


    const fileInputRef = useRef(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleEmojiClick = (emojiData) => {
        setNewMsg((prev) => prev + emojiData.emoji);
    };

    const handleFileIconClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    return (
        <section className={styles.messaging}>

            <div className={styles.chatBox}>
                {messages.map((msg, index) => (
                    <div key={index} className={styles.message}>
                        <strong>{msg.sender}:</strong> {msg.text}
                        {msg.file && (
                            <div>
                                📎 <a href={msg.file} target="_blank" rel="noreferrer">View File</a>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className={styles.inputRow}>


                <input
                    type="text"
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    placeholder="Type a message"
                />


                <div className={styles.uploadedMedia}>
                    {uploading && <p>Uploading file...</p>}
                    {fileUrl && (
                        <div className={styles.preview}>
                            {fileUrl.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                                <img src={fileUrl} alt="Uploaded preview" />
                            ) : (
                                <div className={styles.fileInfo}>
                                    <i className="fa-regular fa-file-lines"></i>
                                    <span>{fileName}</span>
                                </div>
                            )}
                            <i className="fa-regular fa-xmark" onClick={removeFile}></i>
                        </div>
                    )}
                </div>


                <div className={`${styles.messagingActions} d-flex justify-content-between mt-3`}>

                    <div className="d-flex gap-3">
                        <input
                            type="file"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={(e) => handleFileUpload(e.target.files[0])}
                        />

                        <div onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                            <i className="fa-regular fa-face-smile"></i>
                        </div>

                        {showEmojiPicker && (
                            <div className={styles.emojiPicker}>
                                <EmojiPicker onEmojiClick={handleEmojiClick} />
                            </div>
                        )}

                        <div onClick={handleFileIconClick}>
                            <i className="fa-regular fa-paperclip-vertical"></i>
                        </div>
                    </div>


                    <div className="sendBtn" onClick={sendMessage} disabled={uploading}>
                        {uploading ? "Uploading..." : <i className="fa-regular fa-paper-plane-top"></i>}
                    </div>

                </div>


            </div>


        </section>
    );
};

export default Messaging;
