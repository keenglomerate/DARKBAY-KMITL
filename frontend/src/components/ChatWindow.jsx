import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext.jsx';
import { useSocketContext } from '../context/SocketContext.jsx';

const ChatWindow = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [conversationPartner, setConversationPartner] = useState(null);
    const { conversationId } = useParams();
    const { user } = useAuth();
    const { socket } = useSocketContext();
    const messageEndRef = useRef(null);

    // Listen for incoming real-time messages
    useEffect(() => {
        socket?.on("newMessage", (newMessage) => {
            // Check if the incoming message belongs to this conversation
            if (newMessage.senderId === conversationPartner?._id) {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            }
        });

        return () => socket?.off("newMessage");
    }, [socket, conversationPartner]);

    // Fetch historical messages for the selected conversation
    useEffect(() => {
        const getMessages = async () => {
            if (!conversationId) {
                setMessages([]);
                setConversationPartner(null);
                return;
            }
            try {
                const { data } = await api.get(`/messages/${conversationId}`);
                setMessages(data.messages || []);
                setConversationPartner(data.otherParticipant);
            } catch (error) {
                console.error("Failed to fetch messages", error);
                setMessages([]);
                setConversationPartner(null);
            }
        };
        getMessages();
    }, [conversationId]);

    // Auto-scroll to the bottom of the chat
    useEffect(() => {
        setTimeout(() => {
            messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }, [messages]);

    // Handle sending a new message
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !conversationPartner) return;
        
        try {
            const { data } = await api.post(`/messages/send/${conversationPartner._id}`, {
                 message: newMessage,
            });
            setMessages([...messages, data]);
            setNewMessage("");
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    if (!conversationId) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <p className="text-medium-text">Select a conversation to start messaging</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="p-4 border-b border-dark-border">
                <p className="font-bold text-lg text-brand-green">{conversationPartner?.username || 'Loading...'}</p>
            </div>

            {/* Message Display Area */}
            <div className="flex-grow p-6 overflow-y-auto">
                <div className="space-y-4">
                    {messages.map((msg) => {
                        const fromMe = msg.senderId._id === user._id;
                        return (
                            <div key={msg._id} className={`flex ${fromMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg break-words ${fromMe ? 'bg-brand-green text-dark-bg' : 'bg-dark-border text-light-text'}`}>
                                    <p>{msg.message}</p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messageEndRef} />
                </div>
            </div>

            {/* Message Input Form */}
            <div className="p-4 border-t border-dark-border">
                <form onSubmit={handleSubmit} className="flex gap-4">
                    <input
                        type="text"
                        value={newMessage}
                        // THIS IS THE FIX - The typo 'e.e' has been corrected to 'e'
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-grow bg-dark-bg border border-dark-border rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-brand-green"
                    />
                    <button type="submit" className="bg-brand-green text-dark-bg font-bold px-6 py-2 rounded-md hover:bg-brand-green-dark transition-colors">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;
