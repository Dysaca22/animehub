import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

import { relatedAnimes } from "../services/api";
import { Genre, Anime } from "../types/anime";
import { Card } from "./Card";

interface RelatedsProps {
    animeId: string;
    genres: Genre[];
}

const Relateds: React.FC<RelatedsProps> = ({ animeId, genres }) => {
    const [showMore, setShowMore] = useState(false);

    const genresNames = genres ? genres.map((genre) => genre.attributes.name).slice(0, 2) : [""];

    const {
        data: relatedAnimeData,
        isLoading,
        isError,
    } = useQuery<Anime[]>({
        queryKey: ["relateds", animeId, genresNames],
        queryFn: () =>
            animeId
                ? relatedAnimes(genresNames, animeId)
                : Promise.reject("No anime ID provided"),
        enabled: Boolean(animeId),
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center py-8 text-red-500">
                Error loading related anime. Please try again later.
            </div>
        );
    }

    if (!relatedAnimeData || relatedAnimeData.length === 0) {
        return (
            <div className="mt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <h3 className="text-lg md:text-xl font-semibold mb-4">
                    Related Anime
                </h3>
                <div className="text-center py-8 text-gray-500">
                    No related anime available
                </div>
            </div>
        );
    }

    const toggleShowMore = () => {
        setShowMore((prev) => !prev);
    };

    const displayedRelateds = showMore
        ? relatedAnimeData
        : relatedAnimeData.slice(0, 3);

    return (
        <div className="mt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <h3 className="text-lg md:text-xl font-semibold mb-4">
                You Might Also Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedRelateds.map((related: Anime) => (
                    <Card key={related.id} anime={related} />
                ))}
            </div>
            {relatedAnimeData.length > 3 && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={toggleShowMore}
                        className="px-6 py-2 text-primary-500 border border-primary-500 rounded-full hover:bg-primary-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
                    >
                        {showMore
                            ? "Show Less"
                            : `Show More (${relatedAnimeData.length - 3} more)`}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Relateds;
