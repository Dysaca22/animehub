import {
    Plus,
    Star,
    Calendar,
    Clock,
    Tag,
    Users,
    MessageCircle,
    Play,
    Check,
    Waypoints,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import { useNotification } from "../services/context";
import { addAnimeToList } from "../services/utils";
import Characters from "../components/Characters";
import { animeDetails } from "../services/api";
import Episodes from "../components/Episodes";
import Relateds from "../components/Relateds";
import { Watchlist } from "../types/profile";
import { Loading } from "../layouts/Loading";
import Reviews from "../components/Reviews";
import { Anime } from "../types/anime";

type TabType = "episodes" | "characters" | "reviews" | "related";

const AnimeDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
    const [showTrailer, setShowTrailer] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>("episodes");
    const { notification, setNotification } = useNotification();

    const {
        data: anime,
        isLoading: isAnimeLoading,
        isError: isAnimeError,
    } = useQuery<Anime>({
        queryKey: ["details", id],
        queryFn: () =>
            id ? animeDetails(id) : Promise.reject("No ID provided"),
        enabled: !!id,
    });

    useEffect(() => {
        const savedWatchlists = localStorage.getItem("watchlists");
        if (savedWatchlists) {
            setWatchlists(JSON.parse(savedWatchlists));
        }
    }, []);

    const handleAddToList = (listId: string) => {
        console.log("Selected Watchlist ID:", listId);
        if (listId && anime) {
            const watchlist = watchlists.find((list) => list.id === listId);
            if (watchlist) {
                // Add anime to the selected watchlist
                addAnimeToList(listId, anime);
                setNotification(
                    `Successfully added "${anime.attributes.canonicalTitle}" to "${watchlist.name}" watchlist!`
                );

                // Update the watchlists state to reflect the change
                const updatedWatchlists = watchlists.map((list) => {
                    if (list.id === listId) {
                        return {
                            ...list,
                            animes: [...(list.animes || []), anime],
                        };
                    }
                    return list;
                });
                setWatchlists(updatedWatchlists);
            }
        }
    };

    if (isAnimeLoading) {
        return <Loading />;
    }

    if (isAnimeError || !anime) {
        return (
            <div className="flex items-center justify-center min-h-screen text-red-500">
                Error loading data.
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const youtubeId = anime.attributes.youtubeVideoId;
    return (
        <div className="min-h-screen mb-8">
            <div
                className="h-[40vh] md:h-[60vh] bg-cover bg-top bg-no-repeat relative [mask-image:linear-gradient(to_bottom,white,transparent)]"
                style={{
                    backgroundImage: `url(${
                        anime.attributes.coverImage?.large ||
                        anime.attributes.posterImage.large
                    })`,
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 md:-mt-32 relative z-10">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full md:w-72 flex-shrink-0"
                    >
                        <img
                            src={anime.attributes.posterImage.large}
                            alt={anime.attributes.canonicalTitle}
                            className="w-full max-w-[200px] md:max-w-none mx-auto md:mx-0 rounded-xl shadow-lg card-hover"
                        />

                        {youtubeId && (
                            <button
                                onClick={() => setShowTrailer(true)}
                                className="w-full mt-4 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 px-4 sm:px-6 py-3 rounded-xl font-semibold transition-colors text-sm sm:text-base"
                            >
                                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                                Watch Trailer
                            </button>
                        )}

                        <div className="mt-6 space-y-4 bg-gray-800 p-3 sm:p-4 rounded-xl text-sm sm:text-base">
                            <div className="flex items-center gap-2 text-gray-300">
                                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
                                <span>
                                    Released:{" "}
                                    {formatDate(anime.attributes.startDate)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                                <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
                                <span>Status: {anime.attributes.status}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
                                <span>
                                    Age Rating: {anime.attributes.ageRating}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 relative">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                    setIsDropdownOpen(!isDropdownOpen)
                                }
                                className="w-full button-glow flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 sm:px-6 py-3 rounded-xl font-semibold transition-colors text-sm sm:text-base"
                            >
                                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                                Add to List
                            </motion.button>
                            {isDropdownOpen && (
                                <div className="absolute w-full mt-2 bg-gray-800 rounded-xl shadow-lg z-50">
                                    {watchlists.map((list) => (
                                        <button
                                            key={list.id}
                                            onClick={async () => {
                                                handleAddToList(list.id);
                                                setIsDropdownOpen(false);
                                            }}
                                            className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors text-sm sm:text-base first:rounded-t-xl last:rounded-b-xl flex items-center justify-between"
                                        >
                                            {list.name}
                                            {list.animes?.some(
                                                (a) => a.id === anime.id
                                            ) && (
                                                <Check className="w-4 h-4 text-green-500" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>

                    <div className="flex-1 mt-6 md:mt-0">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 gradient-text"
                        >
                            {anime.attributes.canonicalTitle}
                        </motion.h1>

                        <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-6">
                            <div className="flex items-center gap-1 bg-gray-800 px-2 sm:px-3 py-1 rounded-full text-sm">
                                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
                                <span>
                                    {(
                                        parseFloat(
                                            anime.attributes.averageRating
                                        ) / 10
                                    ).toFixed(1)}
                                </span>
                            </div>
                            <div className="bg-gray-800 px-2 sm:px-3 py-1 rounded-full text-sm">
                                {anime.attributes.status}
                            </div>
                            <div className="bg-gray-800 px-2 sm:px-3 py-1 rounded-full text-sm">
                                {anime.attributes.episodeCount} Episodes
                            </div>
                        </div>

                        {anime.genres && (
                            <div className="mb-6">
                                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                                    Genres
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {anime.genres?.map((genre) => (
                                        <span
                                            key={genre.id}
                                            className="px-2 sm:px-3 py-1 bg-gray-800 rounded-full text-xs sm:text-sm hover:bg-gray-700 transition-colors"
                                        >
                                            {genre.attributes.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <p className="text-gray-300 mb-8 text-base sm:text-lg leading-relaxed">
                            {anime.attributes.synopsis}
                        </p>

                        <div className="border-b border-gray-700 mb-6 overflow-x-auto">
                            <div className="flex gap-2 sm:gap-4 min-w-max">
                                <button
                                    onClick={() => setActiveTab("episodes")}
                                    className={`px-3 sm:px-4 py-2 font-semibold transition-colors relative text-sm sm:text-base ${
                                        activeTab === "episodes"
                                            ? "text-primary-500"
                                            : "text-gray-400 hover:text-white"
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                                        Episodes
                                    </div>
                                    {activeTab === "episodes" && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                                        />
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab("characters")}
                                    className={`px-3 sm:px-4 py-2 font-semibold transition-colors relative text-sm sm:text-base ${
                                        activeTab === "characters"
                                            ? "text-primary-500"
                                            : "text-gray-400 hover:text-white"
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                                        Characters
                                    </div>
                                    {activeTab === "characters" && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                                        />
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab("reviews")}
                                    className={`px-3 sm:px-4 py-2 font-semibold transition-colors relative text-sm sm:text-base ${
                                        activeTab === "reviews"
                                            ? "text-primary-500"
                                            : "text-gray-400 hover:text-white"
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                        Reviews
                                    </div>
                                    {activeTab === "reviews" && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                                        />
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab("related")}
                                    className={`px-3 sm:px-4 py-2 font-semibold transition-colors relative text-sm sm:text-base ${
                                        activeTab === "related"
                                            ? "text-primary-500"
                                            : "text-gray-400 hover:text-white"
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Waypoints className="w-4 h-4 sm:w-5 sm:h-5" />
                                        Related
                                    </div>
                                    {activeTab === "related" && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                                        />
                                    )}
                                </button>
                            </div>
                        </div>

                        {activeTab === "episodes" && (
                            <Episodes episodes={anime.episodes} />
                        )}
                        {activeTab === "characters" && (
                            <Characters characters={anime.characters} />
                        )}
                        {activeTab === "reviews" && (
                            <Reviews reviews={anime.reviews} />
                        )}
                        {activeTab === "related" && (
                            <Relateds
                                animeId={anime.id}
                                genres={anime.genres}
                            />
                        )}
                    </div>
                </div>
            </div>

            {showTrailer && youtubeId && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
                    <div className="relative w-full max-w-4xl">
                        <button
                            onClick={() => setShowTrailer(false)}
                            className="absolute -top-8 sm:-top-12 right-0 text-white hover:text-gray-300 transition-colors text-sm sm:text-base"
                        >
                            Close
                        </button>
                        <div className="aspect-video">
                            <iframe
                                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full rounded-xl"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnimeDetails;
