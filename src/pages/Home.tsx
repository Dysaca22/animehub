import { useQuery } from "@tanstack/react-query";
import React from "react";

import { trendingAnime, popularAnime, seasonalAnime } from "../services/api";
import HeroCarousel from "../components/HeroCarousel";
import CardCarousel from "../components/CardCarousel";
import { Loading } from "../layouts/Loading";
import { Anime } from "../types/anime";

const Home: React.FC = () => {
    const {
        data: trendingData,
        isLoading: isTrendingLoading,
        isError: isTrendingError,
    } = useQuery<Anime[]>({
        queryKey: ["trending"],
        queryFn: trendingAnime,
    });

    const {
        data: popularData,
        isLoading: isPopularLoading,
        isError: isPopularError,
    } = useQuery<Anime[]>({
        queryKey: ["popular"],
        queryFn: popularAnime,
    });

    const seasons = ["winter", "spring", "summer", "fall"];
    const year = new Date().getFullYear() || 2024;

    const winterQuery = useQuery<Anime[]>({
        queryKey: ["seasonal", "winter"],
        queryFn: () => seasonalAnime("winter", year),
    });

    const springQuery = useQuery<Anime[]>({
        queryKey: ["seasonal", "spring"],
        queryFn: () => seasonalAnime("spring", year),
    });

    const summerQuery = useQuery<Anime[]>({
        queryKey: ["seasonal", "summer"],
        queryFn: () => seasonalAnime("summer", year),
    });

    const fallQuery = useQuery<Anime[]>({
        queryKey: ["seasonal", "fall"],
        queryFn: () => seasonalAnime("fall", year),
    });

    const seasonQueries = [winterQuery, springQuery, summerQuery, fallQuery];
    const isSeasonalLoading = seasonQueries.some((query) => query.isLoading);
    const isSeasonalError = seasonQueries.some((query) => query.isError);
    const seasonData = seasonQueries.map((query) => query.data);

    if (isTrendingLoading || isPopularLoading || isSeasonalLoading) {
        return <Loading />;
    }

    if (isTrendingError || isPopularError || isSeasonalError) {
        return (
            <div className="flex items-center justify-center min-h-screen text-red-500">
                Error loading data.
            </div>
        );
    }

    return (
        <main className="space-y-12 mb-8">
            {trendingData && trendingData.length > 0 && (
                <HeroCarousel
                    animes={trendingData.slice(0, 8)}
                    className="rounded-none"
                />
            )}

            <div className="mx-8 space-y-12">
                <section className="space-y-12">
                    {popularData && popularData.length > 0 && (
                        <CardCarousel
                            title="Popular Animes"
                            animes={popularData}
                        />
                    )}
                </section>

                <section className="space-y-12">
                    {seasonData.map((data, index) => (
                        <div key={seasons[index]}>
                            {data && data.length > 0 && (
                                <CardCarousel
                                    title={`${seasons[index]} Animes`}
                                    animes={data}
                                />
                            )}
                        </div>
                    ))}
                </section>
            </div>
        </main>
    );
};

export default Home;
