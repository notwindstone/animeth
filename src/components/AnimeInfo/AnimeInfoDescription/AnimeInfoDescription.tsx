import {AnimeType} from "@/types/Shikimori/Responses/Types/Anime.type";
import classes from "@/components/AnimeInfo/AnimeInfo.module.css";
import {
    Anchor,
    Box, Container,
    Group,
    Image,
    Overlay,
    rem,
    Stack,
    Text,
    Title,
    UnstyledButton
} from "@mantine/core";
import React from "react";
import translateAnimeStatus from "@/utils/Translates/translateAnimeStatus";
import translateAnimeKind from "@/utils/Translates/translateAnimeKind";
import {useDisclosure, useHotkeys} from "@mantine/hooks";
import DOMPurify from "isomorphic-dompurify";
import {variables} from "@/configs/variables";
import NextImage from "next/image";
import Link from "next/link";
import {formatNextEpisodeDate} from "@/utils/Misc/formatNextEpisodeDate";
import {formatAiredOnDate} from "@/utils/Misc/formatAiredOnDate";
import useCustomTheme from "@/hooks/useCustomTheme";
import {useTranslations} from "next-intl";
import sanitizeHTML from "@/utils/Misc/sanitizeHTML";

export default function AnimeInfoDescription({ data }: { data: AnimeType }) {
    const info = useTranslations('Info');
    const translate = useTranslations('Translations');
    const locale = info('locale');
    const [opened, { open, close }] = useDisclosure(false);
    const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
    const { theme } = useCustomTheme();

    useHotkeys([
        ['escape', closeModal]
    ]);

    let cleanDescription;

    if (data?.descriptionHtml && locale === 'ru') {
        cleanDescription = sanitizeHTML({ color: theme.color, descriptionHtml: data.descriptionHtml });
    }

    function descriptionOpen() {
        if (!opened) {
            open();
        }
    }

    function zoomImage() {
        if (opened) {
            openModal();
        }
    }

    const nextEpisodeAt
        = data?.nextEpisodeAt ? `Следующий эпизод ${formatNextEpisodeDate(data.nextEpisodeAt)} • ` : "";
    const airedOn
        = (data?.airedOn?.date && data?.status)
        ? (
            `${translateAnimeStatus({ 
                sortingType: data.status, 
                withPrepositions: true,
            })} ${formatAiredOnDate(data.airedOn.date)} • `
        ) : "";
    const animeKind
        = data?.kind ? `${translateAnimeKind(data.kind)}` : "";

    let description;

    switch (locale) {
        case "en":
            description = (
                <Text {...opened ? null : { lineClamp: 1 }}>
                    {data?.synopsis}
                </Text>
            );
            break;
        case "ru":
            if (!cleanDescription || !data?.description) {
                description = null;
                break;
            }

            description = (
                <Text
                    {...opened ? null : { lineClamp: 1 }}
                    dangerouslySetInnerHTML={{ __html: cleanDescription }}
                />
            );
            break;
        default:
            description = (
                <Text {...opened ? null : { lineClamp: 1 }}>
                    {data?.synopsis}
                </Text>
            );
            break;
    }

    return (
        <>
            {
                modalOpened && (
                    <Box onClick={closeModal} className={classes.imageModal}>
                        <Image
                            fit="contain"
                            h="100%"
                            alt="Anime poster"
                            src={data?.poster?.originalUrl}
                        />
                    </Box>
                )
            }
            <Group
                onClick={descriptionOpen}
                className={`
                    ${classes.description} ${opened && classes.expandedDescription}
                `}
            >
                <Stack w="100%" gap={rem(8)}>
                    <Group wrap="nowrap" justify="space-between">
                        <Text
                            lineClamp={opened ? 4 : 1}
                            className={classes.statsText}
                        >
                            {`${nextEpisodeAt}${airedOn}${animeKind}`}
                        </Text>
                        {
                            !opened && (
                                <Text className={classes.expandText}>Нажмите, чтобы раскрыть</Text>
                            )
                        }
                    </Group>
                    <Group
                        w="100%"
                        justify="space-between"
                        align="flex-start"
                        wrap="nowrap"
                        className={classes.descriptionGroup}
                    >
                        {
                            ((cleanDescription && data?.description) || description) && (
                                <Stack gap={rem(8)}>
                                    <Title className={classes.heading} pt={rem(8)} order={4}>
                                        Описание
                                    </Title>
                                    {description}
                                </Stack>
                            )
                        }
                        <Container className={classes.imageWrapper}>
                            <Overlay
                                onClick={zoomImage}
                                gradient={
                                    opened ? "#00000000" : "linear-gradient(to bottom, light-dark(#f3f3f488, #14151688) 0%, light-dark(#f3f3f4, #141516) 25%)"
                                }
                                className={`${classes.imageOverlay} ${opened && classes.imageOverlayZoom}`}
                            />
                            <Image
                                alt="Anime poster"
                                src={data?.poster?.originalUrl}
                                placeholder="blur"
                                blurDataURL={variables.imagePlaceholder}
                                width={225}
                                height={317}
                                w={225}
                                h={317}
                                component={NextImage}
                                radius="md"
                            />
                        </Container>
                    </Group>
                    <Title className={classes.heading} order={4}>Информация</Title>
                    {
                        !!data?.score && (
                            <Text>
                                Оценка: {data.score}
                            </Text>
                        )
                    }
                    {
                        (data?.episodesAired && data?.episodes) > 0 && (
                            <Text>
                                Эпизоды: {data.episodesAired} / {data.episodes}
                            </Text>
                        )
                    }
                    {
                        !!data?.duration && (
                            <Text>
                                Длительность эпизода: {data.duration} мин.
                            </Text>
                        )
                    }
                    {
                        data?.rating && (
                            <Text>
                                Возрастной рейтинг: {variables.rating[data.rating]}
                            </Text>
                        )
                    }
                    {
                        data?.japanese && (
                            <Text>
                                Японское название: {data.japanese}
                            </Text>
                        )
                    }
                    {
                        data?.english && (
                            <Text>
                                Английское название: {data.english}
                            </Text>
                        )
                    }
                    {
                        data?.synonyms?.length > 0 && (
                            <Text>
                                Другие названия: {data.synonyms.map((synonym, index) => (
                                    <span key={synonym}>{index ? ', ' : ''}{synonym}</span>
                                ))}
                            </Text>
                        )
                    }
                    {
                        data?.fandubbers?.length > 0 && (
                            <Text>
                                Фанатский дубляж: {data.fandubbers.map((fandub, index) => (
                                    <span key={fandub}>{index ? ', ' : ''}{fandub}</span>
                                ))}
                            </Text>
                        )
                    }
                    {
                        data?.fansubbers?.length > 0 && (
                            <Text>
                                Фанатские субтитры: {data.fansubbers.map((fansub, index) => (
                                    <span key={fansub}>{index ? ', ' : ''}{fansub}</span>
                                ))}
                            </Text>
                        )
                    }
                    {
                        data?.url && (
                            <Text>
                                Страница на Shikimori: <Anchor
                                    c={theme.color} target="_blank"
                                    href={data.url}
                                >{data.name}</Anchor>
                            </Text>
                        )
                    }
                    {
                        data?.related?.length > 0 && (
                            <>
                                <Title className={classes.heading} order={4}>Связанное</Title>
                                <Group>
                                    {
                                        data.related.map((relation) => {
                                            return (
                                                <Group align="flex-start" key={relation.id}>
                                                    <Image
                                                        radius="md"
                                                        alt={relation.relationRu}
                                                        h={rem(48)}
                                                        w="auto"
                                                        src={relation.anime?.poster?.mainUrl ?? relation.manga?.poster?.mainUrl}
                                                    />
                                                    <Stack gap={0} justify="flex-start">
                                                        <Text className={classes.title} lineClamp={1}>
                                                            {relation.anime?.name ?? relation.manga?.name}
                                                        </Text>
                                                        <Text className={classes.relationSubtitle} lineClamp={1}>
                                                            {relation.relationRu}
                                                        </Text>
                                                        <Text lineClamp={1}></Text>
                                                    </Stack>
                                                </Group>
                                            );
                                        })
                                    }
                                </Group>
                            </>
                        )
                    }
                    {
                        data?.videos?.length > 0 && (
                            <>
                                <Title className={classes.heading} order={4}>Видео</Title>
                                <Group className={classes.videosGroup}>
                                    {
                                        data.videos.map((video) => {
                                            return (
                                                <React.Fragment key={video.id}>
                                                    <Link
                                                        target="_blank"
                                                        href={video.url}
                                                    >
                                                        <Image
                                                            radius="md"
                                                            alt={video.kind}
                                                            src={`https:${video.imageUrl}`}
                                                            h={128}
                                                            w="auto"
                                                        />
                                                    </Link>
                                                </React.Fragment>
                                            );
                                        })
                                    }
                                </Group>
                            </>
                        )
                    }
                    <UnstyledButton className={classes.button} onClick={close}>
                        Свернуть
                    </UnstyledButton>
                </Stack>
            </Group>
        </>
    );
}