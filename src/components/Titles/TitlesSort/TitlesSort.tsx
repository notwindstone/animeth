"use client";

import {SegmentedControl} from "@mantine/core";
import { variables } from '@/configs/variables';
import {useContext} from "react";
import {TitlesSortContext} from "@/utils/Contexts/Contexts";
import classes from './TitlesSort.module.css';
import {useViewportSize} from "@mantine/hooks";
import useCustomTheme from "@/hooks/useCustomTheme";
import {useTranslations} from "next-intl";

const sorting = variables.sorting;
const LATEST_TITLES = sorting.latest;
const ANNOUNCED_TITLES = sorting.anons;
const ONGOING_TITLES = sorting.ongoing;
const RELEASED_TITLES = sorting.released;

export default function TitlesSort() {
    const translate = useTranslations('Translations');
    const { width: viewportWidth } = useViewportSize();
    const { sortingType, setSortingType } = useContext(TitlesSortContext);
    const { theme } = useCustomTheme();

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

    const translatedData = [
        LATEST_TITLES,
        ANNOUNCED_TITLES,
        ONGOING_TITLES,
        RELEASED_TITLES,
    ].map((data) => {
        return {
            label: translate(data.label),
            value: data.value
        };
    });

    return (
        <SegmentedControl
            p={0}
            size={size}
            autoContrast
            color={theme.color}
            classNames={{
                root: classes.root
            }}
            withItemsBorders={false}
            value={sortingType}
            // @ts-ignore
            onChange={setSortingType}
            data={translatedData}
        />
    );
}