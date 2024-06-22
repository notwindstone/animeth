import {Avatar, Group, Popover, rem, Stack, Text, Title, UnstyledButton} from "@mantine/core";
import {SignedIn, SignedOut, SignOutButton, useUser} from "@clerk/nextjs";
import classes from './SideBarAccountDropdown.module.css';
import useRipple from "use-ripple-hook";
import NProgress from "nprogress";
import {usePathname, useRouter} from "next/navigation";
import React, {useContext} from "react";
import {SideBarAccountPopoverContext, SideBarPopoverContext} from "@/utils/Contexts/Contexts";
import {IconCloudLockOpen, IconLogin, IconLogout, IconSettings, IconUserCircle} from "@tabler/icons-react";
import {variables} from "@/configs/variables";
import {useTranslations} from "next-intl";

function DropdownButton({
    children,
    func
}: {
    children: React.ReactNode;
    func: () => void;
}) {
    const [ripple, event] = useRipple(variables.rippleColor);

    return (
        <UnstyledButton
            className={classes.popoverButton}
            ref={ripple}
            onPointerDown={event}
            onClick={func}
            p={rem(8)}
        >
            <Group align="center">
                {children}
            </Group>
        </UnstyledButton>
    );
}

export default function SideBarAccountDropdown() {
    const info = useTranslations('Info');
    const locale = info('locale');
    const [ripple, event] = useRipple(variables.rippleColor);
    const { setExpanded } = useContext(
        SideBarPopoverContext
    );
    const { openSettings, openSignIn, openSignUp } = useContext(
        SideBarAccountPopoverContext
    );
    const { user } = useUser();
    const pathname = usePathname();
    const router = useRouter();

    function toggle() {
        setExpanded((expanded) => !expanded);
    }

    function pushToProfile() {
        if (!user) {
            return;
        }

        const accountURL = `/${locale}/account/${user.id}`;

        toggle();
        NProgress.start();
        router.push(accountURL);

        if (accountURL === pathname) {
            return NProgress.done();
        }
    }

    function toggleSettings() {
        openSettings();
        toggle();
    }

    function signOut() {
        NProgress.start();
        NProgress.done();
        toggle();
    }

    function signIn() {
        openSignIn();
        toggle();
    }

    function signUp() {
        openSignUp();
        toggle();
    }

    return (
        <Popover.Dropdown>
            <SignedIn>
                <Stack p={rem(8)} gap={0}>
                    <Group pt={rem(8)} pb={rem(8)}>
                        <Avatar
                            className={classes.avatar}
                            component="a"
                            href={user?.imageUrl ?? '/blurred.png'}
                            target="_blank"
                            src={user?.imageUrl ?? '/blurred.png'}
                            alt={`Аватар пользователя ${user?.username}`}
                            size="lg"
                        >
                            {user?.username?.[0]}
                        </Avatar>
                        <Title className={classes.title} order={4}>{user?.username}</Title>
                    </Group>

                    <DropdownButton func={pushToProfile}>
                        <IconUserCircle stroke={1.5} />
                        <Text className={classes.text}>
                            Мой профиль
                        </Text>
                    </DropdownButton>

                    <DropdownButton func={toggleSettings}>
                        <IconSettings stroke={1.5} />
                        <Text className={classes.text}>
                            Настройки
                        </Text>
                    </DropdownButton>

                    <SignOutButton>
                        {/* It doesn't work with DropdownButton component какого-то хуя */}
                        <UnstyledButton
                            className={classes.popoverButton}
                            onClick={signOut}
                            ref={ripple}
                            onPointerDown={event}
                            p={rem(8)}
                        >
                            <Group align="center">
                                <IconLogout stroke={1.5} />
                                <Text className={classes.text}>
                                    Выйти
                                </Text>
                            </Group>
                        </UnstyledButton>
                    </SignOutButton>
                </Stack>
            </SignedIn>
            <SignedOut>
                <Stack p={rem(8)} gap={0}>
                    <Title className={classes.title} pb={rem(8)} order={2}>Аккаунт</Title>

                    <DropdownButton func={signIn}>
                        <IconLogin stroke={1.5}/>
                        <Text className={classes.text}>
                            Войти
                        </Text>
                    </DropdownButton>

                    <DropdownButton func={signUp}>
                        <IconCloudLockOpen stroke={1.5} />
                        <Text className={classes.text}>
                            Зарегистрироваться
                        </Text>
                    </DropdownButton>
                </Stack>
            </SignedOut>
        </Popover.Dropdown>
    );
}