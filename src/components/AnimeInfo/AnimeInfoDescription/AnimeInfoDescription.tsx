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

    const nextEpisode = translate('component__anime-info-description__next-episode-label');

    const nextEpisodeAt
        = data?.nextEpisodeAt
            ? `${nextEpisode} ${formatNextEpisodeDate({ nextEpisodeDate: data.nextEpisodeAt, locale: locale })} • `
            : "";
    const airedOn
        = (data?.airedOn?.date && data?.status)
            ? (
                `${translate(
                    translateAnimeStatus({
                        sortingType: data.status,
                        withPrepositions: true,
                    })
                )} ${formatAiredOnDate({ airedOnDate: data.airedOn.date, locale: locale })} • `
            )
            : "";
    const animeKind = data?.kind ? translate(translateAnimeKind(data.kind)) : "";

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
                                <Text className={classes.expandText}>
                                    {translate('component__anime-info-description__expand-label')}
                                </Text>
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
                                        {translate('component__anime-info-description__description-label')}
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
                    <Title className={classes.heading} order={4}>
                        {translate('component__anime-info-description__info-label')}
                    </Title>
                    {
                        !!data?.score && (
                            <Text>
                                {translate('component__anime-info-description__score-label')}: {data.score}
                            </Text>
                        )
                    }
                    {
                        (data?.episodesAired && data?.episodes) > 0 && (
                            <Text>
                                {translate('component__anime-info-description__episodes-label')}: {data.episodesAired} / {data.episodes}
                            </Text>
                        )
                    }
                    {
                        !!data?.duration && (
                            <Text>
                                {translate('component__anime-info-description__episode-duration-label')}: {data.duration} мин.
                            </Text>
                        )
                    }
                    {
                        data?.rating && (
                            <Text>
                                {translate('component__anime-info-description__rating-label')}: {variables.rating[data.rating]}
                            </Text>
                        )
                    }
                    {
                        data?.japanese && (
                            <Text>
                                {translate('component__anime-info-description__japanese-label')}: {data.japanese}
                            </Text>
                        )
                    }
                    {
                        locale === 'ru' ? (
                            <>
                                {
                                    data?.english && (
                                        <Text>
                                            {translate('component__anime-info-description__english-label')}: {data.english}
                                        </Text>
                                    )
                                }
                            </>
                        ) : (
                            <>
                                {
                                    data?.russian && (
                                        <Text>
                                            {translate('component__anime-info-description__russian-label')}: {data.russian}
                                        </Text>
                                    )
                                }
                            </>
                        )
                    }
                    {
                        data?.synonyms?.length > 0 && (
                            <Text>
                                {translate('component__anime-info-description__other-anime-names-label')}: {data.synonyms.map((synonym, index) => (
                                    <span key={synonym}>{index ? ', ' : ''}{synonym}</span>
                                ))}
                            </Text>
                        )
                    }
                    {
                        data?.fandubbers?.length > 0 && (
                            <Text>
                                {translate('component__anime-info-description__fandubs-label')}: {data.fandubbers.map((fandub, index) => (
                                    <span key={fandub}>{index ? ', ' : ''}{fandub}</span>
                                ))}
                            </Text>
                        )
                    }
                    {
                        data?.fansubbers?.length > 0 && (
                            <Text>
                                {translate('component__anime-info-description__fansubs-label')}: {data.fansubbers.map((fansub, index) => (
                                    <span key={fansub}>{index ? ', ' : ''}{fansub}</span>
                                ))}
                            </Text>
                        )
                    }
                    {
                        data?.url && (
                            <Text>
                                {translate('component__anime-info-description__shikimori-page-label')}: <Anchor
                                    c={theme.color} target="_blank"
                                    href={data.url}
                                >{data.name}</Anchor>
                            </Text>
                        )
                    }
                    {
                        data?.related?.length > 0 && (
                            <>
                                <Title className={classes.heading} order={4}>
                                    {translate('component__anime-info-description__related-label')}
                                </Title>
                                <Group>
                                    {
                                        data.related.map((relation) => {
                                            let relationLabel;

                                            switch (locale) {
                                                case "en":
                                                    relationLabel = relation.relationEn;
                                                    break;
                                                case "ru":
                                                    relationLabel = relation.relationRu;
                                                    break;
                                                default:
                                                    relationLabel = relation.relationEn;
                                                    break;
                                            }

                                            return (
                                                <Group align="flex-start" key={relation.id}>
                                                    <Image
                                                        radius="md"
                                                        alt={relationLabel}
                                                        h={rem(48)}
                                                        w="auto"
                                                        src={relation.anime?.poster?.mainUrl ?? relation.manga?.poster?.mainUrl}
                                                    />
                                                    <Stack gap={0} justify="flex-start">
                                                        <Text className={classes.title} lineClamp={1}>
                                                            {relation.anime?.name ?? relation.manga?.name}
                                                        </Text>
                                                        <Text className={classes.relationSubtitle} lineClamp={1}>
                                                            {relationLabel}
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
                                <Title className={classes.heading} order={4}>
                                    {translate('component__anime-info-description__videos-label')}
                                </Title>
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
                        {translate('common__collapse-label')}
                    </UnstyledButton>
                </Stack>
            </Group>
        </>
    );
}