import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext.jsx';

const ConversationList = () => {
    const [conversations, setConversations] = useState([]);
    const { conversationId } = useParams();
    const { user } = useAuth();

    useEffect(() => {
        const getConversations = async () => {
            try {
                const { data } = await api.get('/messages/conversations');
                setConversations(data);
            } catch (error) {
                console.error("Failed to fetch conversations", error);
            }
        };
        if (user) getConversations();
    }, [user, conversationId]); // Re-fetch when the active conversation changes

    return (
        <div className="w-1/3 border-r border-dark-border overflow-y-auto">
            <div className="p-4 border-b border-dark-border">
                <input type="text" placeholder="Search conversations..." className="w-full bg-dark-bg border border-dark-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-green" />
            </div>
            <ul>
                {conversations.map((convo) => {
                    // Find the other person in the chat
                    const otherParticipant = convo.participants.find(p => p._id !== user._id);
                    return (
                        <li key={convo._id}>
                            <Link 
                                to={`/messages/${convo._id}`}
                                className={`flex items-center p-4 border-b border-dark-border hover:bg-dark-bg transition-colors ${conversationId === convo._id ? 'bg-dark-bg' : ''}`}
                            >
                                <div className="flex-grow">
                                    <p className="font-bold text-light-text">{otherParticipant?.username || 'Unknown User'}</p>
                                    <p className="text-sm text-medium-text truncate">{convo.listing?.title || 'General Chat'}</p>
                                </div>
                            </Link>
                        </li>
                    )
                })}
                 {conversations.length === 0 && (
                    <p className="text-center text-medium-text p-4">No conversations yet.</p>
                )}
            </ul>
        </div>
    );
};

export default ConversationList;