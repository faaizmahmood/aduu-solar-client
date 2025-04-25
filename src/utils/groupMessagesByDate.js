const formatDateLabel = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
};

const groupMessagesByDate = (messages) => {
    const grouped = {};
    messages.forEach((msg) => {
        const dateKey = new Date(msg.createdAt).toDateString();
        const label = formatDateLabel(dateKey);
        if (!grouped[label]) grouped[label] = [];
        grouped[label].push(msg);
    });
    return grouped;
};



export default groupMessagesByDate