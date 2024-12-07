import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { Anime } from "@/types/anime";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function addAnimeToList(listId: string, anime: Anime) {
    const watchlists = JSON.parse(localStorage.getItem("watchlists") || "[]");
    const updatedWatchlists = watchlists.map((list: any) => {
        if (list.id === listId) {
            const animeExists = list.animes.some(
                (existingAnime: Anime) => existingAnime.id === anime.id
            );
            if (animeExists) {
                return list;
            }
            return {
                ...list,
                animes: [...list.animes, anime],
            };
        }
        return list;
    });
    localStorage.setItem("watchlists", JSON.stringify(updatedWatchlists));
}
