import React, { useState } from "react";

import { Episode } from "../types/anime";

interface EpisodesProps {
    episodes: Episode[];
}

const Episodes: React.FC<EpisodesProps> = ({ episodes }) => {
    const [showMore, setShowMore] = useState(false);
    const [expandedEpisodeId, setExpandedEpisodeId] = useState<string | null>(
        null
    );

    const toggleShowMore = () => {
        setShowMore(!showMore);
    };

    const handleEpisodeClick = (episodeId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        setExpandedEpisodeId(
            expandedEpisodeId === episodeId ? null : episodeId
        );
    };

    React.useEffect(() => {
        const handleClickOutside = () => {
            setExpandedEpisodeId(null);
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    if (!episodes || episodes.length === 0) {
        return (
            <div className="mt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <h3 className="text-lg md:text-xl font-semibold mb-4">Episodes</h3>
                <div className="text-center py-8 text-gray-500">
                    No episodes available
                </div>
            </div>
        );
    }

    let displayedEpisodes = episodes;
    if (episodes.length > 3) {
        displayedEpisodes = showMore ? episodes : episodes.slice(0, 3);
    }

    return (
        <div className="mt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <h3 className="text-lg md:text-xl font-semibold mb-4">Episodes</h3>
            <div className="space-y-4">
                {displayedEpisodes.map((episode) => (
                    <div
                        key={episode.id}
                        className="flex flex-col sm:flex-row gap-4 border p-4 rounded-xl hover:shadow-lg transition-shadow duration-300"
                        onClick={(e) => handleEpisodeClick(episode.id, e)}
                    >
                        <img
                            src={
                                episode.attributes.thumbnail?.original ||
                                "/placeholder-episode.jpg"
                            }
                            alt={episode.attributes.canonicalTitle || "Episode thumbnail"}
                            className="w-full sm:w-36 h-48 sm:h-24 object-cover rounded-xl my-auto"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/placeholder-episode.jpg";
                            }}
                        />
                        <div className="flex-1 flex flex-col gap-4">
                            <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-10">
                                <h4 className="text-md font-bold line-clamp-2">
                                    {episode.attributes.titles?.en_jp || "Untitled Episode"}
                                </h4>
                                <p className="text-gray-500 text-sm whitespace-nowrap">
                                    {episode.attributes.length ? `${episode.attributes.length} min` : "Duration N/A"}
                                </p>
                            </div>
                            <p className="text-gray-400">
                                {episode.attributes.synopsis || "No synopsis available"}
                            </p>
                            <p className="text-gray-500 text-sm mt-auto">
                                Air Date:{" "}
                                {episode.attributes.airdate
                                    ? new Date(episode.attributes.airdate).toLocaleDateString()
                                    : "Air date not available"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            {episodes.length > 3 && (
                <button
                    onClick={toggleShowMore}
                    className="mt-4 text-primary-500 hover:underline w-full sm:w-auto px-4 py-2 rounded-xl border border-primary-500 hover:bg-primary-50 transition-colors duration-300"
                >
                    {showMore ? "Show Less" : "Show More"}
                </button>
            )}
        </div>
    );
};

export default Episodes;