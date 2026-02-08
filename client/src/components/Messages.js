import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function Messages() {
    const { userId: urlUserId } = useParams();
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(null);
    const messagesEndRef = useRef(null);

    const fetchConversations = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/api/messages/conversations`, {
                headers: { 'x-auth-token': token }
            });
            setConversations(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching conversations:', error);
            setLoading(false);
        }
    }, []);

    const fetchConversation = useCallback(async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/api/messages/conversation/${userId}`, {
                headers: { 'x-auth-token': token }
            });
            setMessages(res.data);

            // Mark as read
            await axios.put(`${API_URL}/api/messages/conversation/${userId}/read`, {}, {
                headers: { 'x-auth-token': token }
            });

            // Find partner info from conversations or fetch if not present
            const conv = conversations.find(c => c.partner._id === userId);
            if (conv) {
                setSelectedUser(conv.partner);
            } else {
                // Fetch user info if not in conversation list (e.g. starting new chat)
                await axios.get(`${API_URL}/api/auth/me`, {
                    headers: { 'x-auth-token': token }
                });
                // Since there's no getUserById, we'll try to find from the messages
                if (res.data.length > 0) {
                    const firstMsg = res.data[0];
                    const partner = firstMsg.sender._id === userId ? firstMsg.sender : firstMsg.receiver;
                    setSelectedUser(partner);
                }
            }

            fetchConversations(); // Update unread counts
        } catch (error) {
            console.error('Error fetching conversation:', error);
        }
    }, [conversations, fetchConversations]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            setCurrentUserId(decoded.user.id);
        } catch (e) {
            console.error('Error decoding token', e);
            navigate('/login');
        }
        fetchConversations();
    }, [navigate, fetchConversations]);

    useEffect(() => {
        if (urlUserId) {
            fetchConversation(urlUserId);
        } else {
            setMessages([]);
            setSelectedUser(null);
        }
    }, [urlUserId, fetchConversation]);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!content.trim() || !urlUserId) return;

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_URL}/api/messages`, {
                receiver: urlUserId,
                content
            }, {
                headers: { 'x-auth-token': token }
            });
            setMessages([...messages, res.data]);
            setContent('');
            fetchConversations();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const styles = {
        container: {
            display: 'flex',
            height: 'calc(100vh - 80px)',
            marginTop: '80px',
            backgroundColor: '#f0f2f5',
            fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
        },
        sidebar: {
            width: '350px',
            borderRight: '1px solid #ddd',
            backgroundColor: '#fff',
            overflowY: 'auto'
        },
        sidebarHeader: {
            padding: '20px',
            borderBottom: '1px solid #ddd',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            color: '#6815ed'
        },
        convItem: {
            padding: '15px 20px',
            cursor: 'pointer',
            borderBottom: '1px solid #f0f2f5',
            transition: 'background 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
        },
        activeConv: {
            backgroundColor: '#e7f3ff'
        },
        avatar: {
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            backgroundColor: '#6815ed',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            fontWeight: 'bold'
        },
        convInfo: {
            flex: 1,
            overflow: 'hidden'
        },
        convTitle: {
            fontWeight: '600',
            fontSize: '1rem',
            marginBottom: '4px',
            display: 'flex',
            justifyContent: 'space-between'
        },
        lastMsg: {
            color: '#65676b',
            fontSize: '0.85rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        },
        unreadBadge: {
            backgroundColor: '#0084ff',
            color: '#fff',
            borderRadius: '50%',
            padding: '2px 8px',
            fontSize: '0.75rem',
            fontWeight: 'bold'
        },
        chatArea: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#fff'
        },
        chatHeader: {
            padding: '15px 25px',
            borderBottom: '1px solid #ddd',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
        },
        messagesList: {
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
        },
        messageContainer: {
            maxWidth: '70%',
            padding: '10px 15px',
            borderRadius: '18px',
            fontSize: '0.95rem',
            lineHeight: '1.4'
        },
        sent: {
            alignSelf: 'flex-end',
            backgroundColor: '#0084ff',
            color: '#fff',
            borderBottomRightRadius: '4px'
        },
        received: {
            alignSelf: 'flex-start',
            backgroundColor: '#e4e6eb',
            color: '#050505',
            borderBottomLeftRadius: '4px'
        },
        time: {
            fontSize: '0.7rem',
            marginTop: '5px',
            opacity: 0.8,
            textAlign: 'right'
        },
        inputArea: {
            padding: '15px 25px',
            borderTop: '1px solid #ddd',
            display: 'flex',
            gap: '15px'
        },
        input: {
            flex: 1,
            padding: '12px 20px',
            borderRadius: '25px',
            border: 'none',
            backgroundColor: '#f0f2f5',
            fontSize: '1rem',
            outline: 'none'
        },
        sendBtn: {
            backgroundColor: 'transparent',
            border: 'none',
            color: '#0084ff',
            fontSize: '1.5rem',
            cursor: 'pointer',
            fontWeight: 'bold'
        },
        emptyChat: {
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#65676b',
            flexDirection: 'column'
        }
    };

    if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <div style={styles.sidebarHeader}>Messages</div>
                {conversations.length === 0 ? (
                    <div style={{ padding: '20px', color: '#65676b', textAlign: 'center' }}>
                        No conversations yet
                    </div>
                ) : (
                    conversations.map(conv => (
                        <div
                            key={conv.partner._id}
                            style={{
                                ...styles.convItem,
                                ...(urlUserId === conv.partner._id ? styles.activeConv : {})
                            }}
                            onClick={() => navigate(`/messages/${conv.partner._id}`)}
                        >
                            <div style={styles.avatar}>
                                {conv.partner.name.charAt(0).toUpperCase()}
                            </div>
                            <div style={styles.convInfo}>
                                <div style={styles.convTitle}>
                                    <span>{conv.partner.name}</span>
                                    {conv.unreadCount > 0 && (
                                        <span style={styles.unreadBadge}>{conv.unreadCount}</span>
                                    )}
                                </div>
                                <div style={styles.lastMsg}>{conv.lastMessage.content}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div style={styles.chatArea}>
                {urlUserId ? (
                    <>
                        <div style={styles.chatHeader}>
                            <div style={styles.avatar}>
                                {selectedUser?.name.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                {selectedUser?.name || 'Loading...'}
                            </div>
                        </div>
                        <div style={styles.messagesList}>
                            {messages.map(msg => {
                                const isSent = msg.sender._id === currentUserId;
                                return (
                                    <div
                                        key={msg._id}
                                        style={{
                                            ...styles.messageContainer,
                                            ...(isSent ? styles.sent : styles.received)
                                        }}
                                    >
                                        <div>{msg.content}</div>
                                        <div style={styles.time}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>
                        <form style={styles.inputArea} onSubmit={sendMessage}>
                            <input
                                style={styles.input}
                                placeholder="Aa"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                            <button type="submit" style={styles.sendBtn}>➤</button>
                        </form>
                    </>
                ) : (
                    <div style={styles.emptyChat}>
                        <div style={{ fontSize: '4rem', marginBottom: '10px' }}>💬</div>
                        <div>Select a conversation to start messaging</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Messages;
