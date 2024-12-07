// src/contexts/NotificationContext.tsx
import React, { createContext, useContext, useState } from "react";

interface NotificationContextType {
    notification: string | null;
    setNotification: (message: string | null) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
    undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [notification, setNotification] = useState<string | null>(null);

    return (
        <NotificationContext.Provider value={{ notification, setNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error(
            "useNotification must be used within a NotificationProvider"
        );
    }
    return context;
};
