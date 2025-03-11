import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCloudUploadAlt } from "react-icons/fa";

import { InfoProfile } from "../types/profile";

const PersonalInfo: React.FC = () => {
    const [info, setInfo] = useState<InfoProfile>({
        name: "",
        avatar: "",
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const savedInfo = localStorage.getItem("personalInfo");
        if (savedInfo) {
            setInfo(JSON.parse(savedInfo));
        }
    }, []);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newInfo = { ...info, name: e.target.value };
        setInfo(newInfo);
        localStorage.setItem("personalInfo", JSON.stringify(newInfo));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newInfo = { ...info, avatar: reader.result as string };
                setInfo(newInfo);
                localStorage.setItem("personalInfo", JSON.stringify(newInfo));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-xl p-6 mb-8"
        >
            <div className="flex items-center gap-6">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                        {info.avatar ? (
                            <img
                                src={info.avatar}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <FaCloudUploadAlt className="text-gray-400 text-4xl" />
                        )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-primary-500 p-2 rounded-full cursor-pointer hover:bg-primary-600 transition-colors">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                        <FaCloudUploadAlt className="text-white text-sm" />
                    </label>
                </div>
                <div className="flex-1">
                    {isEditing ? (
                        <input
                            type="text"
                            value={info.name}
                            onChange={handleNameChange}
                            onBlur={() => setIsEditing(false)}
                            className="bg-gray-700 text-white px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Enter your name"
                            autoFocus
                        />
                    ) : (
                        <h2
                            className="text-2xl font-semibold text-white cursor-pointer hover:text-primary-500 transition-colors"
                            onClick={() => setIsEditing(true)}
                        >
                            {info.name || "Click to add name"}
                        </h2>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default PersonalInfo;
