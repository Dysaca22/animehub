import { FaPlus, FaTrash, FaList } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import PersonalInfo from "../components/PersonalInfo";
import { Watchlist } from "../types/profile";
import { Card } from "../components/Card";

const Profile: React.FC = () => {
    const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
    const [newListName, setNewListName] = useState("");
    const [selectedList, setSelectedList] = useState<Watchlist | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        const savedWatchlists = localStorage.getItem("watchlists");
        if (savedWatchlists) {
            setWatchlists(JSON.parse(savedWatchlists));
        }
    }, []);

    const saveWatchlists = (updatedWatchlists: Watchlist[]) => {
        setWatchlists(updatedWatchlists);
        localStorage.setItem("watchlists", JSON.stringify(updatedWatchlists));
    };

    const addWatchlist = () => {
        if (newListName.trim()) {
            const newWatchlist: Watchlist = {
                id: crypto.randomUUID(),
                name: newListName.trim(),
                animes: [],
            };
            saveWatchlists([...watchlists, newWatchlist]);
            setNewListName("");
        }
    };

    const removeWatchlist = (id: string) => {
        const updatedWatchlists = watchlists.filter((list) => list.id !== id);
        saveWatchlists(updatedWatchlists);
    };

    const removeAnimeFromList = (listId: string, animeId: string) => {
        const updatedWatchlists = watchlists.map((list) => {
            if (list.id === listId) {
                return {
                    ...list,
                    animes: list.animes.filter((anime) => anime.id !== animeId),
                };
            }
            return list;
        });
        saveWatchlists(updatedWatchlists);
        if (selectedList?.id === listId) {
            setSelectedList(
                updatedWatchlists.find((list) => list.id === listId) || null
            );
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            addWatchlist();
        }
    };

    const openDialog = (list: Watchlist) => {
        setSelectedList(list);
        setIsDialogOpen(true);
    };

    return (
        <div className="min-h-screen mb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10 gradient-text flex items-center gap-3"
                >
                    <FaList className="text-primary-500" /> Profile
                </motion.h1>
                <PersonalInfo></PersonalInfo>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10 gradient-text flex items-center gap-3"
                >
                    <FaList className="text-primary-500" /> Watchlists
                </motion.h1>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 mb-8"
                >
                    <input
                        type="text"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="New Watchlist Name"
                        className="flex-1 px-4 py-3 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all max-w-[300px]"
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addWatchlist}
                        className="px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:hover:bg-primary-600"
                        disabled={!newListName.trim()}
                    >
                        <FaPlus />
                    </motion.button>
                </motion.div>
                <div className="grid gap-6">
                    {watchlists.length === 0 ? (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-gray-400 text-center py-8"
                        >
                            No watchlists created yet.
                        </motion.p>
                    ) : (
                        watchlists.map((list, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                key={list.id}
                                className="bg-gray-800 rounded-xl p-6"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h2
                                        className="text-xl font-semibold text-white cursor-pointer hover:text-primary-500 transition-colors"
                                        onClick={() => openDialog(list)}
                                    >
                                        {list.name}
                                    </h2>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => removeWatchlist(list.id)}
                                        className="text-red-500 hover:text-red-400 p-2 rounded-full hover:bg-red-500/10 transition-colors"
                                    >
                                        <FaTrash size={14} />
                                    </motion.button>
                                </div>
                                <div className="flex flex-row flex-nowrap overflow-hidden gap-4">
                                    {list.animes.length > 0 ? (
                                        list.animes.slice(0, 5).map((anime) => (
                                            <div
                                                key={anime.id}
                                                className="relative max-w-[250px]"
                                            >
                                                <Card anime={anime} />
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeAnimeFromList(
                                                            list.id,
                                                            anime.id
                                                        );
                                                    }}
                                                    className="absolute top-2 right-2 z-10 text-red-500 hover:text-red-400 p-2 rounded-full bg-black/50 hover:bg-red-500/10 transition-colors"
                                                >
                                                    <FaTrash size={12} />
                                                </motion.button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-sm text-center py-3 col-span-full">
                                            No animes in this list.
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {isDialogOpen && selectedList && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[80vh]"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-white">
                                {selectedList.name}
                            </h2>
                            <button
                                onClick={() => setIsDialogOpen(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                ×
                            </button>
                        </div>
                        <div className="overflow-y-auto max-h-[calc(80vh-100px)]">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {selectedList.animes.length > 0 ? (
                                    selectedList.animes.map((anime) => (
                                        <div
                                            key={anime.id}
                                            className="relative"
                                        >
                                            <Card anime={anime} />
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeAnimeFromList(
                                                        selectedList.id,
                                                        anime.id
                                                    );
                                                }}
                                                className="absolute top-2 right-2 z-10 text-red-500 hover:text-red-400 p-2 rounded-full bg-black/50 hover:bg-red-500/10 transition-colors"
                                            >
                                                <FaTrash size={12} />
                                            </motion.button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-sm text-center py-3 col-span-full">
                                        No animes in this list.
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};
export default Profile;
