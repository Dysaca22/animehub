export interface Anime {
    id: string;
    type: string;
    attributes: AnimeAttributes;
    genres: Genre[];
    episodes: Episode[];
    reviews: Review[];
    characters: Character[];
}

interface AnimeAttributes {
    canonicalTitle: string;
    titles: Titles;
    synopsis: string;
    coverImage: Image;
    posterImage: Image;
    startDate: string;
    endDate: string | null;
    status: string;
    episodeCount: number;
    averageRating: string | "0";
    ratingRank: number | null;
    popularityRank: number | null;
    ageRating: string | null;
    ageRatingGuide: string | null;
    youtubeVideoId: string | null;
}

interface Titles {
    en?: string;
    ja_jp?: string;
}

interface Image {
    small: string;
    medium: string;
    large: string;
    original: string;
}

export interface Episode {
    id: string;
    attributes: EpisodeAttributes;
}

interface EpisodeAttributes {
    titles: {
        en_jp: string;
    };
    canonicalTitle: string;
    thumbnail: {
        original: string;
    };
    number: number;
    airdate: string;
    synopsis: string;
    length: string;
}

export interface Review {
    id: string;
    attributes: ReviewAttributes;
}

interface ReviewAttributes {
    content: string;
    rating: number;
    createdAt: string;
}

export interface Character {
    id: string;
    attributes: CharacterAttributes;
    role: string;
}

interface CharacterAttributes {
    name: string;
    description: string;
    image: Image;
}

export interface Genre {
    id: string;
    type: string;
    attributes: GenreAttributes;
}

interface GenreAttributes {
    name: string;
    slug: string;
}

export interface AgeRating {
    id: string;
    type: string;
    attributes: AgeRatingAttributes;
}

interface AgeRatingAttributes {
    name: string;
    slug: string;
}
