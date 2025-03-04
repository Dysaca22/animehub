import React, { useEffect } from "react";

import { useNotification } from "../services/context";

const Notification: React.FC = () => {
    const { notification, setNotification } = useNotification();

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [notification, setNotification]);

    return notification ? (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white rounded-xl shadow-xl transition-all duration-300 transform hover:scale-102 z-[999999] overflow-hidden">
            <div className="flex flex-col gap-2 relative p-4">
                <p className="text-sm" dangerouslySetInnerHTML={{ __html: notification }} />

                <div className="w-full h-1 bg-gray-700 absolute bottom-0 left-0">
                    <div
                        className="h-full bg-white"
                        style={{
                            width: "100%",
                            animation: "progress 4s linear",
                        }}
                    />
                </div>
            </div>
            <style>{`
                @keyframes progress {
                    0% {
                        width: 0%;
                    }
                    100% {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    ) : null;
};
export default Notification;
