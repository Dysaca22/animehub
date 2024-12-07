import React, { useState } from "react";

import { Character } from "../types/anime";

interface CharactersProps {
    characters: Character[];
}

const Characters: React.FC<CharactersProps> = ({ characters }) => {
    const [showMore, setShowMore] = useState(false);
    const [expandedCard, setExpandedCard] = useState<string | null>(null);

    if (!characters || characters.length === 0) {
        return (
            <div className="mt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <h3 className="text-lg md:text-xl font-semibold mb-4">Characters</h3>
                <div className="text-center py-8 text-gray-500">
                    No characters available
                </div>
            </div>
        );
    }

    const toggleShowMore = () => {
        setShowMore(!showMore);
    };

    const handleCardClick = (id: string) => {
        setExpandedCard(expandedCard === id ? null : id);
    };

    const displayedCharacters = characters.length > 3 && !showMore ? characters.slice(0, 3) : characters;

    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Characters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {displayedCharacters.map((character) => (
                    <div
                        key={character.id}
                        className="flex flex-col items-center p-4 border rounded-xl gap-4 cursor-pointer"
                        onClick={() => handleCardClick(character.id)}
                    >
                        <div className="flex flex-row gap-4">
                            <img
                                src={
                                    character.attributes.image?.original ||
                                    "/placeholder-character.jpg"
                                }
                                alt={character.attributes.name || "Character"}
                                className="w-28 h-28 rounded-xl object-cover"
                            />
                            <div className="flex flex-col gap-2">
                                <h4 className="text-md font-bold text-center">
                                    {character.attributes.name || "Unknown Character"}
                                </h4>
                                <p className="capitalize text-gray-400">{character.role || "Unknown Role"}</p>
                            </div>
                        </div>
                        <p className={`${expandedCard === character.id ? '' : 'line-clamp-3'}`}>
                            {character.attributes.description || "No description available."}
                        </p>
                    </div>
                ))}
            </div>
            {characters.length > 3 && (
                <button
                    onClick={toggleShowMore}
                    className="mt-4 text-primary-500 hover:underline"
                >
                    {showMore ? "Show Less" : "Show More"}
                </button>
            )}
        </div>
    );
};

export default Characters;