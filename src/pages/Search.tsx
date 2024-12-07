import React, { useState, useEffect } from "react";
import { Card } from "../components/Card";
import { searchAnime, fetchAllGenres } from "../services/api";
import { Anime, Genre } from "../types/anime";
import { Search as SearchIcon, Filter, ChevronDown } from "lucide-react";

const Search: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [animes, setAnimes] = useState<Anime[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedAgeRating] = useState<string | null>(null);
    const [minScore, setMinScore] = useState<number | null>(null);
    const [seasonYear, setSeasonYear] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const ITEMS_PER_PAGE = 20;
    const MAX_VISIBLE_PAGES = 5;

    useEffect(() => {
        const loadFilters = async () => {
            try {
                const [genresData] = await Promise.all([fetchAllGenres()]);
                setGenres(genresData);
            } catch (error) {
                console.error("Error loading filters:", error);
            }
        };
        loadFilters();
    }, []);

    useEffect(() => {
        const fetchAnimes = async () => {
            try {
                setIsLoading(true);
                const result = await searchAnime(
                    ITEMS_PER_PAGE,
                    currentPage,
                    searchTerm,
                    selectedGenres,
                    seasonYear,
                    selectedAgeRating,
                    minScore
                );
                setAnimes(result.data);
                setTotalCount(result.meta.count);
            } catch (error) {
                console.error("Error fetching animes:", error);
                setAnimes([]);
                setTotalCount(0);
            } finally {
                setIsLoading(false);
            }
        };

        const debounceTimeout = setTimeout(fetchAnimes, 300);
        return () => clearTimeout(debounceTimeout);
    }, [
        searchTerm,
        selectedGenres,
        seasonYear,
        selectedAgeRating,
        minScore,
        currentPage,
    ]);

    const getPaginationRange = () => {
        const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
        const halfVisible = Math.floor(MAX_VISIBLE_PAGES / 2);

        let startPage = Math.max(currentPage - halfVisible, 1);
        let endPage = Math.min(startPage + MAX_VISIBLE_PAGES - 1, totalPages);

        if (endPage - startPage + 1 < MAX_VISIBLE_PAGES) {
            startPage = Math.max(endPage - MAX_VISIBLE_PAGES + 1, 1);
        }

        return Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
        );
    };

    return (
        <div className="min-h-screen text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Section */}
                    <div className="lg:w-1/4 mb-6 lg:mb-0">
                        <div className="bg-gray-900 backdrop-blur-sm rounded-2xl p-6 sticky top-4 shadow-xl border border-gray-700/50">
                            <button
                                className="lg:hidden w-full flex items-center justify-between mb-4 transition-all duration-300 hover:bg-gray-700/80 p-3 rounded-xl shadow-md active:scale-95"
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                aria-expanded={isFilterOpen}
                            >
                                <span className="flex items-center gap-3 font-medium">
                                    <Filter className="w-5 h-5" />
                                    Filters
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 transition-transform duration-300 ${
                                        isFilterOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            <div
                                className={`space-y-8 transition-all duration-300 ease-in-out ${
                                    isFilterOpen ? "block" : "hidden lg:block"
                                }`}
                            >
                                <div>
                                    <div className="relative group">
                                        <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-primary-400 transition-colors duration-300" />
                                        <input
                                            type="text"
                                            placeholder="Search anime..."
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            className="w-full bg-gray-700/50 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none transition-all duration-300 hover:bg-gray-600/50 placeholder:text-gray-400"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-4 text-lg text-primary-400">
                                        Genres
                                    </h3>

                                    <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-500/50 scrollbar-track-gray-700/30 pr-2">
                                        <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-700/50 p-3 rounded-xl transition-all duration-300 group border-b border-gray-600/50">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    selectedGenres.length ===
                                                    genres.length
                                                }
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedGenres(
                                                            genres.map(
                                                                (genre) =>
                                                                    genre.id
                                                            )
                                                        );
                                                    } else {
                                                        setSelectedGenres([]);
                                                    }
                                                }}
                                                className="w-5 h-5 rounded-lg border-2 border-gray-400 bg-gray-700/50 checked:bg-primary-500 checked:border-primary-500 hover:border-primary-400 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 focus:ring-offset-gray-800 transition-all duration-300 ease-in-out cursor-pointer"
                                            />
                                            <span className="group-hover:text-primary-400 transition-colors duration-300 font-medium">
                                                Select All
                                            </span>
                                        </label>
                                        {genres.map((genre) => (
                                            <label
                                                key={genre.id}
                                                className="flex items-center gap-3 cursor-pointer hover:bg-gray-700/50 p-3 rounded-xl transition-all duration-300 group"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedGenres.includes(
                                                        genre.id
                                                    )}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedGenres([
                                                                ...selectedGenres,
                                                                genre.id,
                                                            ]);
                                                        } else {
                                                            setSelectedGenres(
                                                                selectedGenres.filter(
                                                                    (id) =>
                                                                        id !==
                                                                        genre.id
                                                                )
                                                            );
                                                        }
                                                    }}
                                                    className="w-5 h-5 rounded-lg border-2 border-gray-400 bg-gray-700/50 checked:bg-primary-500 checked:border-primary-500 hover:border-primary-400 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 focus:ring-offset-gray-800 transition-all duration-300 ease-in-out cursor-pointer"
                                                />
                                                <span className="group-hover:text-primary-400 transition-colors duration-300">
                                                    {genre.attributes.name}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-4 text-lg text-primary-400">
                                        Minimum Score
                                    </h3>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="10"
                                        value={minScore || 0}
                                        onChange={(e) =>
                                            setMinScore(
                                                Number(e.target.value) || null
                                            )
                                        }
                                        className="w-full accent-primary-500 cursor-pointer"
                                    />
                                    <div className="text-center text-lg font-medium mt-3 text-primary-300">
                                        {minScore ? `${minScore}%` : "Any"}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-4 text-lg text-primary-400">
                                        Year
                                    </h3>
                                    <input
                                        type="number"
                                        value={seasonYear || ""}
                                        onChange={(e) =>
                                            setSeasonYear(
                                                Number(e.target.value) || null
                                            )
                                        }
                                        placeholder="Enter year..."
                                        min="1900"
                                        max={new Date().getFullYear() + 1}
                                        className="w-full bg-gray-700/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 transition-all duration-300 hover:bg-gray-600/50 placeholder:text-gray-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="lg:w-3/4">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {animes.map((anime) => (
                                        <Card key={anime.id} anime={anime} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalCount > ITEMS_PER_PAGE && (
                                    <div className="mt-8 flex justify-center gap-2 flex-wrap">
                                        <button
                                            onClick={() => setCurrentPage(1)}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
                                        >
                                            First
                                        </button>
                                        {getPaginationRange().map((pageNum) => (
                                            <button
                                                key={pageNum}
                                                onClick={() =>
                                                    setCurrentPage(pageNum)
                                                }
                                                className={`px-4 py-2 rounded-xl ${
                                                    currentPage === pageNum
                                                        ? "bg-primary-500 text-white"
                                                        : "bg-gray-700 hover:bg-gray-600"
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() =>
                                                setCurrentPage(
                                                    Math.ceil(
                                                        totalCount /
                                                            ITEMS_PER_PAGE
                                                    )
                                                )
                                            }
                                            disabled={
                                                currentPage ===
                                                Math.ceil(
                                                    totalCount / ITEMS_PER_PAGE
                                                )
                                            }
                                            className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
                                        >
                                            Last
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Search;
