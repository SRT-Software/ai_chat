import React, { createContext, useState } from 'react';

export interface ChatInfo {
    Message: string
}

export const defaultChat: ChatInfo = {
    Message: ''
}


const ChatContext = createContext({ chatInfo: defaultChat, setChatInfo: (info: ChatInfo) => {} });

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
    const [chatInfo, setChatInfo] = useState(defaultChat);
    return (
        <ChatContext.Provider value={{ chatInfo, setChatInfo }}>
            {children}
        </ChatContext.Provider>
    );
};

export { ChatContext, ChatProvider }