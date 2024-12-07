import { motion } from "framer-motion";
import { Film } from "lucide-react";
import React from "react";

export const Loading: React.FC = () => {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-50">
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 180],
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="relative"
            >
                <Film className="w-16 h-16 text-primary" />
                <motion.div
                    animate={{
                        scale: [1.1, 1.3, 1.1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute inset-0 bg-primary rounded-full blur-xl -z-10"
                />
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="mt-8 text-xl font-semibold text-white"
            >
                Loading...
            </motion.div>
        </div>
    );
};
