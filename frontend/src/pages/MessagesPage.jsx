import React from 'react';
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';
import { useParams } from 'react-router-dom';

const MessagesPage = () => {
    const { conversationId } = useParams();

    return (
        <div className="flex h-[calc(100vh-120px)] bg-dark-card border border-dark-border rounded-lg">
            {/* Sidebar with list of conversations */}
            <ConversationList />

            {/* Main chat window */}
            <div className="flex-grow flex flex-col">
                {conversationId ? (
                    <ChatWindow />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-medium-text">Select a conversation to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagesPage;