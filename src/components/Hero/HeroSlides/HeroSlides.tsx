import {Carousel} from "@mantine/carousel";
import HeroCard from "@/components/Hero/HeroCard/HeroCard";
import {Flex, rem, Skeleton, Text} from "@mantine/core";
import {WrapperResponseInterface} from "@/types/Shikimori/Responses/Interfaces/WrapperResponse.interface";
import HeroMobileCard from "@/components/Hero/HeroMobileCard/HeroMobileCard";
import classes from './HeroSlides.module.css';

interface HeroResponseInterface extends WrapperResponseInterface {
    status: "error" | "success" | "pending";
    error: Error | null;
    slidesLength: undefined[];
    debouncedHeight: string | number;
    isMobile?: boolean;
    aspectRatioWidth?: string;
}

export default function HeroSlides({
    data,
    status,
    error,
    slidesLength,
    debouncedHeight,
    isMobile,
                                       aspectRatioWidth,
}: HeroResponseInterface) {
    return slidesLength.map((_slide, index) => {
        let currentSlide;
        switch (status) {
            case "success":
                currentSlide = isMobile && typeof debouncedHeight === "number" ? (
                    <HeroMobileCard animeTitle={data?.animes?.[index]} debouncedHeight={debouncedHeight} />
                ) : (
                    <HeroCard animeTitle={data?.animes?.[index]} debouncedHeight={debouncedHeight} aspectRatioWidth={aspectRatioWidth} />
                );
                break;
            case "pending":
                currentSlide = isMobile && typeof debouncedHeight === "number" ? (
                    <Flex
                        h={debouncedHeight}
                        pl={rem(64)}
                        pr={rem(64)}
                        align="flex-end"
                    >
                        <Skeleton radius={32} h={debouncedHeight - 64} />
                    </Flex>
                ) : (
                    <>
                        <Skeleton className={classes.desktopSkeleton} radius={0} w="100%" h={debouncedHeight} />
                        <Flex
                            className={classes.mobileSkeleton}
                            h={debouncedHeight}
                            pl={rem(64)}
                            pr={rem(64)}
                            align="flex-end"
                        >
                            <Skeleton radius={32} h="calc((100vw * 1.2) - 64px)" />
                        </Flex>
                    </>
                );
                break;
            case "error":
            default:
                currentSlide = (
                    <Text>Error: {error?.message}</Text>
                );
        }

        return (
            <Carousel.Slide
                key={index}
            >
                {currentSlide}
            </Carousel.Slide>
        );
    });
}