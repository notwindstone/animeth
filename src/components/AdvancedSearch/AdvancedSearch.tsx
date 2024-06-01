"use client";

import SearchInput from "@/components/SearchInput/SearchInput";
import {Flex} from "@mantine/core";
import AdvancedSearchFilters from "@/components/AdvancedSearch/AdvancedSearchFilters/AdvancedSearchFilters";
import {useSearchParams} from "next/navigation";
import classes from './AdvancedSearch.module.css';
import {AdvancedSearchContext} from "@/utils/Contexts/Contexts";
import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {client} from "@/lib/shikimori/client";
import {OrderType} from "@/types/Shikimori/Queries/Order.type";
import {StatusType} from "@/types/Shikimori/General/Status.type";
import TrendingCard from "@/components/TrendingGrid/TrendingCard/TrendingCard";

const LIMIT = 32;

export default function AdvancedSearch() {
    const shikimori = client();
    const searchParams = useSearchParams();
    const studio = searchParams.get('studio') ?? '';
    const genre = searchParams.get('genre') ?? '';
    const season = searchParams.get('season') ?? '';
    // @ts-ignore
    const order: OrderType = searchParams.get('order') ?? '';
    const kind = searchParams.get('kind') ?? '';
    // @ts-ignore
    const status: StatusType = searchParams.get('status') ?? '';
    const score = searchParams.get('score') ?? '';
    const [input, setInput] = useState('');
    const { data, isPending, error } = useQuery({
        queryKey: [
            'advancedSearch',
            studio,
            genre,
            input,
            season,
            order,
            kind,
            status,
            score,
        ],
        queryFn: getShikimoriData,
    });

    async function getShikimoriData() {
        return (await shikimori
            .animes
            .list({
                search: input,
                studio: studio,
                genre: genre,
                year: season,
                order: order,
                kind: kind,
                status: status,
                score: score,
                limit: LIMIT,
                filter: [
                    "id",
                    "url",
                    "russian",
                    "status",
                    "score",
                    "poster { id originalUrl mainUrl }",
                    "episodes",
                    "episodesAired"
                ]
            })
        ).animes;
    }
    console.log(data);
    return (
        <AdvancedSearchContext.Provider
            value={{
                searchInput: input,
                setSearchInput: setInput
            }}
        >
            <Flex className={classes.wrapper}>
                <SearchInput />
                <AdvancedSearchFilters />
                {
                    data && (
                        <TrendingCard anime={data[0]} />
                    )
                }
            </Flex>
        </AdvancedSearchContext.Provider>
    );
}
