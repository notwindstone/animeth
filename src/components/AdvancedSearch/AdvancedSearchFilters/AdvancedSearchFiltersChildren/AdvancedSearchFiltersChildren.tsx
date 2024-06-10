import GenreFilter from "@/components/Filters/GenreFilter/GenreFilter";
import OrderFilter from "@/components/Filters/OrderFilter/OrderFilter";
import KindFilter from "@/components/Filters/KindFilter/KindFilter";
import LimitFilter from "@/components/Filters/LimitFilter/LimitFilter";
import StatusFilter from "@/components/Filters/StatusFilter/StatusFilter";
import SeasonFilter from "@/components/Filters/SeasonFilter/SeasonFilter";
import ScoreFilter from "@/components/Filters/ScoreFilter/ScoreFilter";
import DurationFilter from "@/components/Filters/DurationFilter/DurationFilter";
import RatingFilter from "@/components/Filters/RatingFilter/RatingFilter";
import StudioFilter from "@/components/Filters/StudioFilter/StudioFilter";
import CensoredFilter from "@/components/Filters/CensoredFilter/CensoredFilter";
import {useContext} from "react";
import {AdvancedSearchFiltersContext} from "@/utils/Contexts/Contexts";
import classes from './AdvancedSearchFiltersChildren.module.css';
import {Accordion, rem, Stack} from "@mantine/core";

export default function AdvancedSearchFiltersChildren() {
    const {
        censored,
        toggleCensored,
        durations,
        setDurations,
        demographicGenresValue,
        setDemographicGenresValue,
        genreGenresValue,
        setGenreGenresValue,
        themeGenresValue,
        setThemeGenresValue,
        kinds,
        setKinds,
        limit,
        setLimit,
        order,
        setOrder,
        ratings,
        setRatings,
        score,
        setScore,
        year,
        setYear,
        rangedYears,
        setRangedYears,
        yearStart,
        setYearStart,
        yearsRanged,
        toggleYearsRanged,
        seasons,
        setSeasons,
        statuses,
        setStatuses,
        studio,
        setStudio,
    } = useContext(AdvancedSearchFiltersContext);

    const filterGroups = [
        {
            type: 'Основные',
            filters: (
                <>
                    <OrderFilter
                        order={order}
                        setOrder={setOrder}
                    />
                    <KindFilter
                        kinds={kinds}
                        setKinds={setKinds}
                    />
                    <StatusFilter
                        statuses={statuses}
                        setStatuses={setStatuses}
                    />
                    <StudioFilter
                        studio={studio}
                        setStudio={setStudio}
                    />
                </>
            ),
        },
        {
            type: 'Жанры',
            filters: (
                <>
                    <GenreFilter
                        demographicGenresValue={demographicGenresValue}
                        setDemographicGenresValue={setDemographicGenresValue}
                        genreGenresValue={genreGenresValue}
                        setGenreGenresValue={setGenreGenresValue}
                        themeGenresValue={themeGenresValue}
                        setThemeGenresValue={setThemeGenresValue}
                    />
                </>
            ),
        },
        {
            type: 'Сезон',
            filters: (
                <>
                    <SeasonFilter
                        seasons={seasons}
                        setSeasons={setSeasons}
                        year={year}
                        setYear={setYear}
                        setRangedYears={setRangedYears}
                        rangedYears={rangedYears}
                        setYearStart={setYearStart}
                        yearsRanged={yearsRanged}
                        toggleYearsRanged={toggleYearsRanged}
                        yearStart={yearStart}
                    />
                </>
            ),
        },
        {
            type: 'Прочее',
            filters: (
                <>
                    <RatingFilter
                        ratings={ratings}
                        setRatings={setRatings}
                    />
                    <DurationFilter
                        durations={durations}
                        setDurations={setDurations}
                    />
                    <ScoreFilter
                        score={score}
                        setScore={setScore}
                    />
                    <LimitFilter
                        limit={limit}
                        setLimit={setLimit}
                    />
                    <CensoredFilter
                        censored={censored}
                        toggleCensored={toggleCensored}
                    />
                </>
            ),
        },
    ];

    const items = filterGroups.map((group) => (
        <Accordion.Item key={group.type} value={group.type}>
            <Accordion.Control>
                {group.type}
            </Accordion.Control>
            <Accordion.Panel>
                <Stack>
                    {group.filters}
                </Stack>
            </Accordion.Panel>
        </Accordion.Item>
    ));

    return (
        <>
            <Accordion
                p={rem(8)}
                defaultValue="Apples"
                classNames={classes}
            >
                {items}
            </Accordion>
        </>
    );
}