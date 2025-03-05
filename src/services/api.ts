import axios from "axios";

import { Anime, Genre, AgeRating } from "../types/anime";

const BASE_URL = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const fetchAdditionalAnimeDetails = async (
    animeId: string
): Promise<Partial<Anime>> => {
    try {
        const [
            genresResponse,
            episodesResponse,
            reviewsResponse,
            charactersResponse,
        ] = await Promise.all([
            apiClient.get(`/anime/${animeId}/genres`),
            apiClient.get(`/anime/${animeId}/episodes`),
            apiClient.get(`/anime/${animeId}/reviews`),
            apiClient.get(`/anime/${animeId}/characters`),
        ]);

        const charactersPromises = charactersResponse.data?.data?.map(
            ({ id, attributes }: any) =>
                apiClient.get(`/characters/${id}`).then((response) => ({
                    role: attributes.role,
                    ...response.data.data,
                }))
        );
        const characters = await Promise.all(charactersPromises || [])
            .then((chars) => chars.filter(Boolean))
            .catch(() => []);
        return {
            genres: genresResponse.data.data,
            episodes: episodesResponse.data.data,
            reviews: reviewsResponse.data.data,
            characters: characters,
        };
    } catch (error) {
        console.error(
            `Error fetching additional details for anime ID ${animeId}:`,
            error
        );
        return {};
    }
};

const fetchAnimeWithDetails = async (animeList: Anime[]): Promise<Anime[]> => {
    return Promise.all(
        animeList.map(async (anime: Anime) => {
            const additionalDetails = await fetchAdditionalAnimeDetails(
                anime.id
            );
            return { ...anime, ...additionalDetails };
        })
    );
};

export const searchAnime = async (
    limit: number = 10,
    page: number = 1,
    textName: string = "",
    genres: string[] = [],
    seasonYear: number | null = null,
    ageRating: string | null = null,
    minScore: number | null = null
): Promise<{ data: Anime[]; meta: { count: number } }> => {
    const response = await apiClient.get("/anime", {
        params: {
            page: {
                limit,
                offset: (page - 1) * limit,
            },
            filter: {
                text: textName || undefined,
                genres: genres.length > 0 ? genres.join(",") : undefined,
                seasonYear: seasonYear || undefined,
                ageRating: ageRating || undefined,
                averageRating: minScore ? `${minScore}..` : undefined,
            },
        },
    });

    const animeList = await fetchAnimeWithDetails(response.data.data);
    return {
        data: animeList,
        meta: {
            count: response.data.meta.count,
        },
    };
};

export const seasonalAnime = async (
    season: string,
    year: number
): Promise<Anime[]> => {
    const response = await apiClient.get("/anime", {
        params: {
            filter: {
                season,
                seasonYear: year,
            },
            page: { limit: 20 },
        },
    });

    const animeList = response.data.data;
    return fetchAnimeWithDetails(animeList);
};

export const trendingAnime = async (): Promise<Anime[]> => {
    const response = await apiClient.get("/anime", {
        params: {
            sort: "ratingRank",
            page: { limit: 10 },
        },
    });

    const animeList = response.data.data;
    return fetchAnimeWithDetails(animeList);
};

export const popularAnime = async (): Promise<Anime[]> => {
    const response = await apiClient.get("/anime", {
        params: {
            sort: "popularityRank",
            page: { limit: 20 },
        },
    });

    const animeList = response.data.data;
    return fetchAnimeWithDetails(animeList);
};

export const animeDetails = async (id: string): Promise<Anime> => {
    const response = await apiClient.get(`/anime/${id}`);
    const anime = response.data.data;

    const additionalDetails = await fetchAdditionalAnimeDetails(anime.id);
    return { ...anime, ...additionalDetails };
};

export const relatedAnimes = async (
    genres: string[],
    excludeId: string
): Promise<Anime[]> => {
    const response = await apiClient.get("/anime", {
        params: {
            filter: {
                genres: genres.join(","),
            },
        },
    });

    const animeList = response.data.data;
    const filteredAnimeList = animeList.filter(
        (anime: Anime) => anime.id !== excludeId
    );
    return fetchAnimeWithDetails(filteredAnimeList);
};

export const randomAnime = async (): Promise<Anime> => {
    const totalResponse = await apiClient.get("/anime");
    const totalAnimes = totalResponse.data.meta.count;

    const response = await apiClient.get("/anime", {
        params: {
            page: {
                offset: Math.floor(Math.random() * totalAnimes),
                limit: 1,
            },
        },
    });

    const anime = response.data.data[0];
    const additionalDetails = await fetchAdditionalAnimeDetails(anime.id);
    return { ...anime, ...additionalDetails };
};

export const fetchAllGenres = async (): Promise<Genre[]> => {
    const response = await apiClient.get("/genres");
    return response.data.data;
};

export const fetchAllAgeRatings = async (): Promise<AgeRating[]> => {
    const response = await apiClient.get("/age-ratings");
    return response.data.data;
};
