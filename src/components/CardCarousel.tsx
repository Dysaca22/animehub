import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

import { Anime } from "../types/anime";
import { cn } from "../services/utils";
import { Button } from "./Button";
import { Card } from "./Card";

interface CardCarouselProps {
    animes: Anime[];
    title: string;
    className?: string;
}

const CardCarousel: React.FC<CardCarouselProps> = ({
    animes,
    title,
    className,
}) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start",
        slidesToScroll: 2,
        dragFree: true,
    });
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(true);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on("select", onSelect);
        onSelect();
        return () => {
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi, onSelect]);

    if (!animes.length) {
        return null;
    }

    return (
        <div className={cn("relative", className)}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold capitalize">{title}</h2>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        disabled={!canScrollPrev}
                        onClick={scrollPrev}
                        aria-label="Previous"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        disabled={!canScrollNext}
                        onClick={scrollNext}
                        aria-label="Next"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div ref={emblaRef} className="overflow-hidden rounded-xl">
                <div className="flex gap-4">
                    {animes.map((anime) => (
                        <div
                            key={anime.id}
                            className="flex-[0_0_220px] min-w-0"
                        >
                            <Card anime={anime} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CardCarousel;
