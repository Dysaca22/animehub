import { motion } from "framer-motion";
import { Star } from "lucide-react";
import React from "react";

import type { Anime } from "../types/anime";

interface CardProps {
    anime: Anime;
}

const DEFAULT_POSTER =
    "https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=800&auto=format&fit=crop";

export const Card: React.FC<CardProps> = ({ anime }) => {
    const onClick = () => {
        window.location.href = `/anime/${anime.id}`;
    };

    const rating = parseFloat(anime.attributes.averageRating || "0");
    const displayRating = !isNaN(rating)
        ? (rating / 10).toFixed(1)
        : "Not rated";
    const posterImage = anime.attributes.posterImage?.medium || DEFAULT_POSTER;
    const title = anime.attributes.canonicalTitle || "Untitled Anime";

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
            }}
            className="group relative overflow-hidden rounded-xl bg-gray-800/50 backdrop-blur-sm cursor-pointer shadow-lg hover:shadow-primary-500/20 transition-all duration-300"
            onClick={onClick}
        >
            <div className="aspect-[2/3] w-full overflow-hidden">
                <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                    src={posterImage}
                    alt={title}
                    className="h-full w-full object-cover"
                    onError={(e: { currentTarget: { src: string } }) => {
                        e.currentTarget.src = DEFAULT_POSTER;
                    }}
                />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-semibold line-clamp-2 mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    {title}
                </h3>

                <div className="flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-sm">{displayRating}</span>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-radial from-primary-500/20 to-transparent pointer-events-none"
            />
        </motion.div>
    );
};
