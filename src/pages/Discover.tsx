import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle, Film, Star } from "lucide-react";

import { randomAnime } from "../services/api";
import { Anime } from "../types/anime";

const Discover: React.FC = () => {
    const [anime, setAnime] = useState<Anime | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRandomAnime = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await randomAnime();
            await new Promise((resolve) => setTimeout(resolve, 3000));
            setAnime(result);
        } catch (error) {
            console.error("Error fetching random anime:", error);
            setError("Failed to fetch anime. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container space-y-12 p-8"
        >
            <div className="space-y-12">
                <div className="flex flex-col items-center justify-center">
                    <motion.button
                        onClick={handleRandomAnime}
                        disabled={loading}
                        whileHover={{ scale: 1.05, rotate: 3 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Get random anime"
                        className={`${
                            anime
                                ? "absolute bottom-8 right-8 w-12 h-12 text-xl"
                                : "w-16 h-16 text-xl"
                        } mb-8 text-primary-foreground font-bold bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-full hover:bg-primary/90 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.3)] flex items-center justify-center text-center overflow-hidden border-4 border-primary/20 backdrop-blur-sm`}
                    >
                        <div className="inset-0 flex items-center justify-center">
                            {loading ? (
                                <Film className="w-7 h-7 animate-spin" />
                            ) : (
                                <motion.span
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="drop-shadow-xl"
                                >
                                    <Shuffle className="w-5 h-5" />
                                </motion.span>
                            )}
                        </div>
                        <motion.div
                            className="inset-0 bg-gradient-to-tr from-primary/30 to-transparent rounded-full"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.6, 0.3],
                                rotate: [0, 180, 360],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-bl from-primary/20 to-transparent rounded-full"
                            animate={{
                                scale: [1.2, 1, 1.2],
                                opacity: [0.2, 0.4, 0.2],
                                rotate: [360, 180, 0],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    </motion.button>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-destructive/10 text-destructive p-4 rounded-xl mb-4"
                        >
                            {error}
                        </motion.div>
                    )}

                    <AnimatePresence mode="wait">
                        {anime && (
                            <motion.div
                                key={anime.attributes?.canonicalTitle}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -50 }}
                                transition={{ duration: 0.5 }}
                                className="max-w-4xl w-full bg-card rounded-2xl shadow-2xl hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] transition-all duration-500"
                            >
                                <motion.h2
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-4xl font-bold mb-6 text-card-foreground hover:text-primary transition-colors duration-300"
                                >
                                    {anime.attributes?.canonicalTitle}
                                </motion.h2>
                                <div className="flex flex-col md:flex-row gap-8 items-start">
                                    {anime.attributes?.posterImage && (
                                        <motion.img
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.3 }}
                                            src={
                                                anime.attributes.posterImage
                                                    .medium
                                            }
                                            alt={
                                                anime.attributes.canonicalTitle
                                            }
                                            loading="lazy"
                                            className="rounded-xl shadow-xl hover:shadow-xl transition-all duration-300 object-cover w-full md:w-1/3 hover:scale-[1.02]"
                                        />
                                    )}
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="flex-1 space-y-6"
                                    >
                                        <p className="text-muted-foreground text-xl leading-relaxed prose max-w-none">
                                            {anime.attributes?.synopsis}
                                        </p>
                                        {anime.attributes?.averageRating && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.5 }}
                                                className="flex items-center bg-accent/10 p-4 rounded-xl"
                                            >
                                                <motion.span
                                                    animate={{
                                                        rotate: [0, 360],
                                                    }}
                                                    transition={{
                                                        duration: 10,
                                                        repeat: Infinity,
                                                        ease: "linear",
                                                    }}
                                                    className="text-primary mr-3"
                                                >
                                                    <Star className="w-6 h-6" />
                                                </motion.span>
                                                <span className="font-bold text-2xl text-foreground">
                                                    {(() => {
                                                        const rating =
                                                            parseFloat(
                                                                anime.attributes
                                                                    .averageRating ||
                                                                    "0"
                                                            );
                                                        const displayRating =
                                                            !isNaN(rating)
                                                                ? (
                                                                      rating /
                                                                      10
                                                                  ).toFixed(1)
                                                                : "Not rated";
                                                        return displayRating;
                                                    })()}{" "}
                                                </span>
                                            </motion.div>
                                        )}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 }}
                                            className="flex justify-center"
                                        >
                                            <a
                                                href={`/anime-details?id=${anime.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                            >
                                                <span className="font-semibold">
                                                    View Details
                                                </span>
                                            </a>
                                        </motion.div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.main>
    );
};

export default Discover;
