import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNotifications } from './NotificationContext';

const MessagingContext = createContext();

export const MessagingProvider = ({ children, socket }) => {
    const { addNotification } = useNotifications();
    const [myPhone, setMyPhone] = useState(localStorage.getItem('andro_phone') || null);
    const [contacts, setContacts] = useState(JSON.parse(localStorage.getItem('andro_contacts') || '[]'));
    const [messages, setMessages] = useState(JSON.parse(localStorage.getItem('andro_messages') || '{}')); // { phone: [msg, msg] }
    const [activeNodes, setActiveNodes] = useState([]);

    // Generate random phone if not exists
    useEffect(() => {
        if (!myPhone) {
            const newPhone = `555-${Math.floor(1000 + Math.random() * 9000)}`;
            setMyPhone(newPhone);
            localStorage.setItem('andro_phone', newPhone);
        }
    }, [myPhone]);

    // Register with server on connect or phone change
    useEffect(() => {
        if (socket && myPhone) {
            socket.emit('register_phone', myPhone);
        }
    }, [socket, myPhone]);

    useEffect(() => {
        if (!socket) return;

        socket.on('receive_message', (data) => {
            const { from, message, timestamp } = data;

            setMessages(prev => {
                const thread = prev[from] || [];
                const updated = {
                    ...prev,
                    [from]: [...thread, { from, text: message, timestamp, own: false }]
                };
                localStorage.setItem('andro_messages', JSON.stringify(updated));
                return updated;
            });

            addNotification({
                title: 'Messenger: Incoming',
                message: `Node ${from}: ${message}`,
                type: 'info'
            });
        });

        socket.on('active_nodes', (nodes) => {
            setActiveNodes(nodes.filter(n => n !== myPhone));
        });

        return () => {
            socket.off('receive_message');
            socket.off('active_nodes');
        };
    }, [socket, myPhone, addNotification]);

    const sendMessage = useCallback((to, text) => {
        if (!socket || !myPhone) return;

        const timestamp = new Date().toISOString();
        const msgObj = { from: myPhone, text, timestamp, own: true };

        socket.emit('send_message', { to, from: myPhone, message: text });

        setMessages(prev => {
            const thread = prev[to] || [];
            const updated = {
                ...prev,
                [to]: [...thread, msgObj]
            };
            localStorage.setItem('andro_messages', JSON.stringify(updated));
            return updated;
        });
    }, [socket, myPhone]);

    const addContact = useCallback((name, phone) => {
        setContacts(prev => {
            const updated = [...prev, { name, phone }];
            localStorage.setItem('andro_contacts', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const deleteThread = useCallback((phone) => {
        setMessages(prev => {
            const updated = { ...prev };
            delete updated[phone];
            localStorage.setItem('andro_messages', JSON.stringify(updated));
            return updated;
        });
    }, []);

    return (
        <MessagingContext.Provider value={{
            myPhone,
            contacts,
            messages,
            activeNodes,
            sendMessage,
            addContact,
            deleteThread
        }}>
            {children}
        </MessagingContext.Provider>
    );
};

export const useMessaging = () => {
    const context = useContext(MessagingContext);
    if (!context) throw new Error('useMessaging must be used within MessagingProvider');
    return context;
};
