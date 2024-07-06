import classes from './SideBarSettingsTarget.module.css';
import {Group, Popover, rem, Text, Tooltip, UnstyledButton} from "@mantine/core";
import {useContext} from "react";
import {SideBarContext, SideBarPopoverContext} from "@/utils/Contexts/Contexts";
import useRipple from "use-ripple-hook";
import {variables} from "@/configs/variables";
import {IconChevronRight, IconSettings} from "@tabler/icons-react";
import SideBarItemExpanded from "@/components/SideBar/SideBarItemExpanded/SideBarItemExpanded";
import {useHover} from "@mantine/hooks";
import {useTranslations} from "next-intl";

export default function SideBarSettingsTarget() {
    const translate = useTranslations('Translations');
    const settingsLabel = translate('common__settings-placeholder');
    const { expanded, setExpanded } = useContext(
        SideBarPopoverContext
    );
    const { opened } = useContext(
        SideBarContext
    );
    const [ripple, event] = useRipple({
        duration: 700,
        ...variables.rippleColor
    });
    const { hovered, ref } = useHover();

    function toggleDropdown() {
        setExpanded((expanded) => !expanded);
    }

    return (
        <Popover.Target>
            <Tooltip
                position="right"
                transitionProps={{ transition: 'fade-right' }}
                ref={ref}
                label={settingsLabel}
                opened={hovered && !opened && !expanded}
            >
                <UnstyledButton
                    ref={ripple}
                    onPointerDown={event}
                    className={classes.button}
                    w={opened ? rem(288) : rem(64)}
                    h={rem(64)}
                    p={rem(8)}
                    onClick={toggleDropdown}
                >
                    <Group wrap="nowrap">
                        <Group
                            className={classes.iconWrapper}
                            wrap="nowrap"
                            w={rem(48)}
                            h={rem(48)}
                            justify="center"
                            align="center"
                        >
                            <IconSettings {...variables.iconProps} />
                        </Group>
                        <SideBarItemExpanded mounted={opened}>
                            <Text size="lg" inline>
                                {settingsLabel}
                            </Text>
                            <IconChevronRight
                                className={
                                    `${classes.chevron} ${expanded && classes.chevronRotated}`
                                }
                                size={24}
                                stroke={1.5}
                            />
                        </SideBarItemExpanded>
                    </Group>
                </UnstyledButton>
            </Tooltip>
        </Popover.Target>
    );
}