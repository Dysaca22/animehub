import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "react-router-dom";

import { Button } from "../components/Button";
import { Anime } from "../types/anime";
import { cn } from "../services/utils";

interface HeroCarouselProps {
    animes: Anime[];
    className?: string;
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ animes, className }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        dragFree: true,
        skipSnaps: false,
    });
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        if (!emblaApi) return;

        const onSelect = () => {
            setSelectedIndex(emblaApi.selectedScrollSnap());
        };

        emblaApi.on("select", onSelect);
        return () => {
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;

        const autoplay = setInterval(() => {
            emblaApi.scrollNext();
        }, 8000);

        return () => {
            clearInterval(autoplay);
        };
    }, [emblaApi]);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    const scrollTo = useCallback(
        (index: number) => emblaApi?.scrollTo(index),
        [emblaApi]
    );

    return (
        <div
            className={cn(
                "relative rounded-xl overflow-hidden group",
                className
            )}
        >
            <div ref={emblaRef} className="overflow-hidden">
                <div className="flex">
                    {animes.map((anime) => (
                        <div
                            key={anime.id}
                            className="relative flex-[0_0_100%] min-w-0 h-[400px] md:h-[600px] transition-transform duration-300"
                        >
                            <img
                                src={
                                    anime.attributes.coverImage?.large ||
                                    anime.attributes.posterImage.large
                                }
                                alt={anime.attributes.canonicalTitle}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105 [mask-image:linear-gradient(to_bottom,white,transparent)]"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-8 max-w-2xl">
                                <h2 className="text-4xl font-bold text-white/95 mb-4 line-clamp-2">
                                    {anime.attributes.canonicalTitle}
                                </h2>
                                <p className="text-white/80 line-clamp-3 mb-6 text-lg">
                                    {anime.attributes.synopsis}
                                </p>
                                <Button
                                    asChild
                                    size="lg"
                                    variant="gradient"
                                    className="hover:scale-105 transition-transform rounded-xl"
                                >
                                    <Link to={`/anime/${anime.id}`}>
                                        <Play className="mr-2 h-5 w-5" />
                                        Learn More
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/30 hover:bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                onClick={scrollPrev}
                aria-label="Previous slide"
            >
                <ChevronLeft className="h-8 w-8" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/30 hover:bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                onClick={scrollNext}
                aria-label="Next slide"
            >
                <ChevronRight className="h-8 w-8" />
            </Button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                {animes.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => scrollTo(i)}
                        className={cn(
                            "w-3 h-3 rounded-full transition-all duration-300 cursor-pointer hover:scale-125",
                            i === selectedIndex
                                ? "bg-primary scale-110"
                                : "bg-white/60 hover:bg-white/80"
                        )}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};
export default HeroCarousel;
