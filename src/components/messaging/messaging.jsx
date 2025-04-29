import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import EmojiPicker from "emoji-picker-react";

import useMessaging from "./useMessaging.js";
import styles from './messaging.module.scss';
import groupMessagesByDate from "../../utils/groupMessagesByDate.js";
import Loading from '../../components/loading/loading'
import noMessageImg from '../../assets/no_message_img.png'
import { useState } from "react";

const Messaging = () => {

    const { projectID } = useParams();

    const user = useSelector((state) => state.user.user);

    const lastReadMessages = user.lastReadMessages;

    const findProjectLastReadMessages = lastReadMessages.find(
        proj => proj.projectId === projectID
    );

    const lastReadAt = findProjectLastReadMessages?.lastReadAt;

    const {
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
    } = useMessaging(projectID, user);


    const groupedMessages = groupMessagesByDate(messages);

    const [isCollapsed, setIsCollapsed] = useState(false)


    return (
        <section className={styles.messaging}>

            <div className="row position-relative h-100">

                <div className={`${styles.toggler}`} onClick={() => setIsCollapsed(!isCollapsed)}>
                    <i className="fa-regular fa-bars"></i>
                </div>

                <div className={`col-${isCollapsed ? '12' : '9'} position-relative h-100`}>

                    <div className={`${styles.chatBox}`} >

                        {
                            loading ? <Loading /> : (
                                <>
                                    {
                                        messages.length === 0 ? (
                                            <>
                                                <div className={`${styles.noMessageDetails}`}>
                                                    <img src={noMessageImg} className={styles.noMessageImg} alt="No message Founds" />
                                                    <h3>No messages Found</h3>
                                                </div>
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


                                                                    <div className="d-flex gap-2 flex-wrap justify-content-end text-info mt-1">
                                                                        {msg?.mentions?.map((ele) => {
                                                                            return (
                                                                                <>
                                                                                    <h5>@{ele}</h5>
                                                                                </>
                                                                            )
                                                                        })}
                                                                    </div>

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
                                </>
                            )
                        }

                    </div>

                    <form onSubmit={sendMessage} className="px-5 text-center">
                        <div className={styles.inputRow}>

                            <input
                                type="text"
                                value={newMsg}
                                onChange={(e) => setNewMsg(e.target.value)}
                                placeholder="Type a message"
                            />

                            <div className={styles.uploadedMedia}>
                                {uploading && <p className="text-start">Uploading file...</p>}
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

                            <div className={`${styles.mentionedPerson} d-flex gap-2 mt-3`}>
                                {mentionedPersons.map((person, index) => (
                                    <h5 key={index} className={styles.mentionedTag}>
                                        @{person}
                                        <span
                                            className={styles.removeMention}
                                            onClick={() => handleRemoveMention(person)}
                                            style={{ cursor: 'pointer', color: 'red' }}
                                        >
                                            <i className="fa-regular fa-xmark ms-2 mt-1"></i>
                                        </span>
                                    </h5>
                                ))}
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

                                    <div className="position-relative">

                                        <i className="fa-regular fa-at" onClick={handelMentionClick}></i>

                                        {mention && <>
                                            <div className={`${styles.mentionList}`}>
                                                {projectDetails?.groupMembers?.map((ele, ind) => (
                                                    <h5 key={ind} onClick={() => handelMentionPersonClick(ele)}>{ele}</h5>
                                                ))}
                                            </div>
                                        </>}

                                    </div>

                                </div>


                                <div className="sendBtn" onClick={sendMessage} disabled={uploading}>
                                    {uploading ? "..." : <i className="fa-regular fa-paper-plane-top"></i>}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className={`col-${isCollapsed ? '0' : '3'} ${isCollapsed ? 'd-none' : ''} pb-2`}>
                    <div className={`${styles.messageDetails}`}>

                        {/* Group Photo and Name */}
                        <div style={{ textAlign: 'center', paddingTop: '40px' }}>
                            <h3 style={{ marginTop: '10px' }}>{projectDetails?.name} Group</h3>
                            {/* <p style={{ fontSize: '14px', color: '#777' }}>Created: Jan 12, 2025</p> */}
                        </div>

                        {/* Members */}
                        <div style={{ padding: '10px 20px' }}>
                            <h5>Members ({projectDetails.groupMembers ? projectDetails.groupMembers.length : "N/A"})</h5>

                            <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
                                {projectDetails?.groupMembers?.map((ele, ind) => (
                                    <h5 key={ind}>👤 {ele}</h5>
                                ))}
                            </ul>
                        </div>

                        {/* Media */}
                        <div style={{ padding: '10px 20px' }}>
                            <h5>Shared Media</h5>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '10px' }}>
                                {/* Shared media images */}
                                {files?.latest?.map((img, idx) => (
                                    <a href={img.url} target="_blank" rel="noopener noreferrer" key={idx}>
                                        <img
                                            src={img.url}
                                            alt={`Media ${idx}`}
                                            style={{ width: '100%', height: '70px', objectFit: 'cover', borderRadius: '6px' }}
                                            className={`${styles.media}`}
                                        />
                                    </a>

                                ))}

                                {/* If total files are more than 6, show +count */}
                                {files?.total > 6 && (
                                    <div
                                        style={{
                                            width: '100%',
                                            height: '70px',
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                            borderRadius: '6px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        +{files.total - 6}
                                    </div>
                                )}
                            </div>
                        </div>


                    </div>
                </div>


            </div>
        </section >
    );
};

export default Messaging;