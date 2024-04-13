'use client';

import VideoPlayer from '@/components/VideoPlayer/VideoPlayer';
import {useQuery} from "@tanstack/react-query";
import {anilibria} from "@/lib/anilibria/anilibria";
import React from "react";
import {Skeleton} from "@mantine/core";
import {AnimeTitleResponseType} from "@/types/AnimeTitleResponseType";
import {kodik} from "@/lib/kodik/kodik";

export default function VideoEmbed({ code }: { code: string }) {
    const { isFetching, data } = useQuery({
        queryKey: ['anime', code],
        queryFn: async () => fetchAnime(code),
    });

    async function fetchAnime(code: string) {
        const anilibriaResponse: AnimeTitleResponseType = await anilibria.title.code(code)
        const kodikResponse = await kodik.code(code)

        return { anilibria: anilibriaResponse, kodik: kodikResponse }
    }

    if (!data) {
        return (
            <Skeleton visible={isFetching} height="56.25vw" width="100vw" />
        )
    }

    const anilibriaData = data.anilibria
    const kodikData = data.kodik

    const anilibriaTitle = anilibriaData.names.ru
    const anilibriaPlayer = anilibriaData.player;
    const anilibriaPreview = "https://anilibria.tv/storage/releases/episodes/previews/9542/1/DMzcnlKyg89dRv5f__86bf22cbc0faac3d42cc7b87ea8c712f.jpg"

    const kodikPlayer = kodikData.results[0].link

    // Некоторые аниме тайтлы не имеют плеера
    if (Object.keys(anilibriaPlayer.list).length === 0) {
        return (
            <>
                <div>{code}</div>
                <div>К сожалению, онлайн-плеер для данного аниме недоступен.</div>
            </>
        );
    }

    return (
        <>
            <iframe
                src={kodikPlayer}
                width="610"
                height="370"
                allow="autoplay *; fullscreen *"
            />
            <VideoPlayer
                title={anilibriaTitle}
                player={anilibriaPlayer}
                preview={anilibriaPreview}
            />
        </>
    );
}