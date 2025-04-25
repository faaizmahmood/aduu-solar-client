import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import EmojiPicker from "emoji-picker-react";

import useMessaging from "./useMessaging.js";
import styles from './messaging.module.scss';
import groupMessagesByDate from "../../utils/groupMessagesByDate.js";

const Messaging = () => {

    const { projectID } = useParams();

    const user = useSelector((state) => state.user.user);

    const lastReadMessages = user.lastReadMessages;

    const findProjectLastReadMessages = lastReadMessages.find(
        proj => proj.projectId === projectID
    );

    const lastReadAt = findProjectLastReadMessages?.lastReadAt;

    const {
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
        retryMessage
    } = useMessaging(projectID, user);


    const groupedMessages = groupMessagesByDate(messages);


    return (
        <section className={styles.messaging}>

            <div className={styles.chatBox} >

                {
                    messages.length === 0 ? (
                        <>
                            <h3>No message</h3>
                        </>
                    ) : (
                        <>
                            {Object.entries(groupedMessages).map(([date, msgs], i) => (
                                <div key={i}>
                                    <div className={styles.dateSeparator}>
                                        <span>{date}</span>
                                    </div>

                                    {msgs.map((msg, index) => {

                                        const isMine = msg.senderId === user._id;
                                        const isUnread = !isMine && lastReadAt && new Date(msg.createdAt) > new Date(lastReadAt);

                                        return (
                                            <div
                                                key={index}
                                                className={`${styles.message} ${isMine ? styles.myMessage : styles.otherMessage} ${isUnread ? styles.unreadMessage : ""}`}

                                            >
                                                <h5>{msg.senderName} {isMine ? "(You)" : ""}</h5>
                                                {!isMine && <strong>{msg.sender}</strong>}
                                                <p>{msg.text}</p>

                                                {/* File preview */}
                                                {msg.file && (
                                                    <div className={styles.mediaPreview}>
                                                        {msg.file.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                                                            <a href={msg.file} target="_blank" rel="noreferrer">
                                                                <img src={msg.file} alt="file" className={styles.imageThumb} />
                                                            </a>
                                                        ) : msg.file.match(/\.(mp4|webm|ogg)$/i) ? (
                                                            <a href={msg.file} target="_blank" rel="noreferrer">
                                                                <video src={msg.file} className={styles.videoThumb} controls />
                                                            </a>
                                                        ) : (
                                                            <a href={msg.file} target="_blank" rel="noreferrer">
                                                                <div className={styles.fileDownload}>📎 View File</div>
                                                            </a>
                                                        )}
                                                    </div>
                                                )}

                                                <small className={styles.messageMeta}>
                                                    <div className={styles.date}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </div>

                                                    {isMine && msg.status === "sending" && <span className={styles.status}>⏳</span>}
                                                    {isMine && msg.status === "failed" && (
                                                        <span className={styles.status} onClick={() => retryMessage(msg)}>❌ Retry</span>
                                                    )}
                                                </small>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                            <div ref={bottomRef} />

                        </>
                    )
                }


            </div>

            <form onSubmit={sendMessage}>
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
                                    <EmojiPicker onEmojiClick={handleEmojiClick} searchDisabled={false} />
                                </div>
                            )}

                            <div onClick={handleFileIconClick}>
                                <i className="fa-regular fa-paperclip-vertical"></i>
                            </div>
                        </div>


                        <div className="sendBtn" onClick={sendMessage} disabled={uploading}>
                            {uploading ? "..." : <i className="fa-regular fa-paper-plane-top"></i>}
                        </div>

                    </div>


                </div>
            </form>

        </section >
    );
};

export default Messaging;