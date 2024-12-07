// src/pages/GachaPon.tsx
import React, { useEffect, useState } from "react";
import { Anime } from "../types/anime";
import { fetchAllGenres, searchAnime } from "../services/api";
import { Card } from "../components/Card";

const GachaPon: React.FC = () => {
    const [animeList, setAnimeList] = useState<Anime[]>([]);
    const [collection, setCollection] = useState<Anime[]>([]);

    useEffect(() => {
        const loadCollection = () => {
            const savedCollection = localStorage.getItem("animeCollection");
            if (savedCollection) {
                setCollection(JSON.parse(savedCollection));
            }
        };

        loadCollection();
        fetchAnimePosters();
    }, []);

    const fetchAnimePosters = async () => {
        try {
            const response = await searchAnime(10, 1); // Fetch 10 random anime
            setAnimeList(response.data);
        } catch (error) {
            console.error("Error fetching anime posters:", error);
        }
    };

    const addToCollection = (anime: Anime) => {
        const updatedCollection = [...collection, anime];
        setCollection(updatedCollection);
        localStorage.setItem(
            "animeCollection",
            JSON.stringify(updatedCollection)
        );
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-4">
                GachaPon - Anime Posters
            </h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {animeList.map((anime) => (
                    <div key={anime.id} className="relative">
                        <Card anime={anime} />
                        <button
                            onClick={() => addToCollection(anime)}
                            className="absolute bottom-2 right-2 bg-primary-500 text-white px-2 py-1 rounded"
                        >
                            Add to Collection
                        </button>
                    </div>
                ))}
            </div>
            <h2 className="text-2xl font-bold mt-8">Your Collection</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {collection.map((anime) => (
                    <Card key={anime.id} anime={anime} />
                ))}
            </div>
        </div>
    );
};

export default GachaPon;
