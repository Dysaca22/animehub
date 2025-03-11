import { Anime } from "./anime";

export interface Watchlist {
    id: string;
    name: string;
    animes: Anime[];
}

export interface InfoProfile {
    name: string;
    avatar: string;
}