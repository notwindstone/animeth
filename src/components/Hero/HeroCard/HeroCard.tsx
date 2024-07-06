import {AnimeType} from "@/types/Shikimori/Responses/Types/Anime.type";
import {useDebouncedValue, useInViewport, useViewportSize} from "@mantine/hooks";
import {
    Badge,
    Box,
    Container,
    Group,
    Image,
    Overlay, rem,
    Stack, Title,
    Transition
} from "@mantine/core";
import classes from './HeroCard.module.css';
import {variables} from "@/configs/variables";
import NextImage from "next/image";
import {useCallback, useMemo} from "react";
import {TransitionStylesType} from "@/types/Transition/TransitionStyles.type";
import DecoratedButton from "@/components/DecoratedButton/DecoratedButton";
import {useRouter} from "next/navigation";
import NProgress from "nprogress";
import {getScoreBadgeColor} from "@/utils/Misc/getScoreBadgeColor";
import {useTranslations} from "next-intl";

const TRANSITION_PROPS: TransitionStylesType = {
    transition: "fade-left",
    duration: 1000,
    timingFunction: "ease",
};

export default function HeroCard({
    animeTitle,
    debouncedHeight,
    aspectRatioWidth
}: {
    animeTitle?: AnimeType,
    debouncedHeight: string | number,
    aspectRatioWidth?: string,
}) {
    const info = useTranslations('Info');
    const translate = useTranslations('Translations');
    const currentLocale = info('locale');

    const isHeightLoaded = typeof debouncedHeight === "number";
    const { width: viewportWidth } = useViewportSize();
    const { ref, inViewport } = useInViewport();
    const [debouncedInViewport] = useDebouncedValue(inViewport, 100);
    const [debouncedSlightlyInViewport] = useDebouncedValue(inViewport, 250);
    const [debouncedLongerInViewport] = useDebouncedValue(inViewport, 400);
    const width = isHeightLoaded ? (debouncedHeight) / 0.42 : aspectRatioWidth;
    const responsiveFontScale
        = viewportWidth > 1600 ? 1.8 : viewportWidth / 1000;
    const router = useRouter();

    let size;

    if (viewportWidth < 880) {
        size = "sm";
    } else if (viewportWidth < 1088) {
        size = "md";
    } else if (viewportWidth < 1312) {
        size = "lg";
    } else {
        size = "xl";
    }

    const scoreBadgeColor = getScoreBadgeColor({ score: animeTitle?.score });

    const redirect = useCallback(function redirectUser() {
        router.push(`/titles/${animeTitle?.url.replace('https://shikimori.one/animes/', '')}`);
        NProgress.start();
    }, [animeTitle?.url, router]);

    let animeName;

    switch (currentLocale) {
        case "en":
            animeName = animeTitle?.english;
            break;
        case "ru":
            animeName = animeTitle?.russian;
            break;
        default:
            animeName = animeTitle?.english;
            break;
    }

    return useMemo(
        () => (
            <Container
                w={width}
                h={debouncedHeight}
                maw={2160}
                className={classes.wrapper}
            >
                <Box
                    h={debouncedHeight}
                    className={classes.centerBox}
                    ref={ref}
                />
                <Image
                    className={classes.poster}
                    style={{
                        scale: debouncedInViewport ? 1 : 1.2,
                    }}
                    alt="Anime poster"
                    component={NextImage}
                    src={animeTitle?.poster?.originalUrl}
                    placeholder="blur"
                    blurDataURL={variables.imagePlaceholder}
                    fill
                />
                <Overlay
                    backgroundOpacity={debouncedInViewport ? 0.5 : 0.8}
                    blur={debouncedInViewport ? 0 : 2}
                    className={classes.overlay}
                >
                    <Container
                        pl={rem(96)}
                        className={classes.infoWrapper}
                        fluid
                        h="100%"
                    >
                        <Stack
                            w="fit-content"
                            align="flex-start"
                            justify="flex-start"
                            h="45%"
                        >
                            <Transition
                                mounted={debouncedInViewport}
                                {...TRANSITION_PROPS}
                            >
                                {
                                    (styles) => (
                                        <Title
                                            size={36 * responsiveFontScale}
                                            className={classes.title}
                                            style={styles}
                                        >
                                            {animeName ?? animeTitle?.name}
                                        </Title>
                                    )
                                }
                            </Transition>
                            <Transition
                                mounted={debouncedSlightlyInViewport}
                                {...TRANSITION_PROPS}
                            >
                                {
                                    (styles) => (
                                        <Group style={styles}>
                                            <Badge
                                                size={size}
                                                color={scoreBadgeColor}
                                            >
                                                {animeTitle?.score}
                                            </Badge>
                                            {
                                                animeTitle?.genres.map((genre, index) => {
                                                    if (index >= 3) {
                                                        return;
                                                    }

                                                    let genreName;

                                                    switch (currentLocale) {
                                                        case "en":
                                                            genreName = genre.name;
                                                            break;
                                                        case "ru":
                                                            genreName = genre.russian;
                                                            break;
                                                        default:
                                                            genreName = genre.name;
                                                            break;
                                                    }

                                                    return (
                                                        <Badge
                                                            size={size}
                                                            variant="light"
                                                            color="white"
                                                            key={
                                                                `${animeTitle?.id}_${genre.name}`
                                                            }
                                                        >
                                                            {genreName}
                                                        </Badge>
                                                    );
                                                })
                                            }
                                        </Group>
                                    )
                                }
                            </Transition>
                            <Transition
                                mounted={debouncedLongerInViewport}
                                {...TRANSITION_PROPS}
                            >
                                {
                                    (styles) => (
                                        <DecoratedButton
                                            onClick={redirect}
                                            size={size}
                                            radius="md"
                                            style={styles}
                                        >
                                            {translate('common__open-label')}
                                        </DecoratedButton>
                                    )
                                }
                            </Transition>
                        </Stack>
                    </Container>
                </Overlay>
            </Container>
        ),
        [
            animeName,
            translate,
            currentLocale,
            redirect,
            debouncedHeight,
            ref,
            size,
            responsiveFontScale,
            width,
            animeTitle?.name,
            animeTitle?.poster?.originalUrl,
            animeTitle?.score,
            scoreBadgeColor,
            animeTitle?.genres,
            animeTitle?.id,
            debouncedInViewport,
            debouncedSlightlyInViewport,
            debouncedLongerInViewport,
        ]
    );
}