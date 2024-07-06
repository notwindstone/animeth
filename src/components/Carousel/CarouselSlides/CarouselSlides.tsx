import {Carousel} from "@mantine/carousel";
import {Skeleton} from "@mantine/core";
import CarouselCard from "@/components/Carousel/CarouselCard/CarouselCard";
import {AnimeType} from "@/types/Shikimori/Responses/Types/Anime.type";
import useMobileScreen from "@/hooks/useMobileScreen";
import CarouselMobileCard from "@/components/Carousel/CarouselMobileCard/CarouselMobileCard";
import {useTranslations} from "next-intl";

export default function CarouselSlides(
    {
        status,
        carouselSlides,
        error,
        data
    } : {
        status: "success" | "error" | "pending";
        carouselSlides: undefined[];
        error: Error | null;
        data?: AnimeType[];
    }
) {
    const { isMobile } = useMobileScreen();
    const translate = useTranslations('Translations');

    return carouselSlides.map((_slide, index) => {
        return (
            <Carousel.Slide key={index}>
                {
                    (status === 'success' && data !== undefined)
                        ? (
                            <>
                                {
                                    isMobile ? (
                                        <CarouselMobileCard animeTitle={data?.[index]} />
                                    ) : (
                                        <CarouselCard animeTitle={data?.[index]} />
                                    )
                                }
                            </>
                        ) : status === 'error' ? (
                            <>
                                {translate('common__error-label')}: {error?.message}
                            </>
                        ) : (
                            <Skeleton width={209} height={317} />
                        )
                }
            </Carousel.Slide>
        );
    });
}