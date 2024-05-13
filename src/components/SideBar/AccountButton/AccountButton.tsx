import classes from './AccountButton.module.css';
import {SignedIn, SignedOut, SignIn, SignOutButton, SignUp, UserProfile, useUser} from "@clerk/nextjs";
import {
    Avatar,
    Button,
    Center,
    Flex,
    Group,
    Popover,
    rem,
    Stack,
    Text,
    Title,
    Transition,
    UnstyledButton
} from "@mantine/core";
import Link from "next/link";
import NProgress from "nprogress";
import {
    IconChevronRight,
    IconCloudLockOpen,
    IconLogin,
    IconLogout,
    IconSettings,
    IconUserCircle
} from "@tabler/icons-react";
import useRipple from "use-ripple-hook";
import {useContext, useEffect, useState} from "react";
import {SideBarLinkContext} from "@/components/SideBar/SideBar";
import {useDisclosure} from "@mantine/hooks";
import {usePathname, useRouter} from "next/navigation";
import {SideBarLink} from "@/types/SideBarLink";

const rippleColor = {
    color: "var(--animeth-ripple-color)",
}

export default function AccountButton({ link }: { link: SideBarLink }) {
    const { user } = useUser();
    const [rippleFirst, eventFirst] = useRipple(rippleColor);
    const [rippleSecond, eventSecond] = useRipple(rippleColor);
    const [rippleThird, eventThird] = useRipple(rippleColor);
    const [rippleFourth, eventFourth] = useRipple(rippleColor);
    const { opened } = useContext(SideBarLinkContext)
    const [settingsOpened, { open: openSettings, close: closeSettings }] = useDisclosure(false);
    const [signInOpened, { open: openSignIn, close: closeSignIn }] = useDisclosure(false);
    const [signUpOpened, { open: openSignUp, close: closeSignUp }] = useDisclosure(false);
    const [expanded, setExpanded] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const isActive = link.pathname === pathname
    const isPopover = link.content !== undefined

    useEffect(() => {
        router.push(pathname)

        if (!user) {
            return
        }

        closeSignUp()
        closeSignIn()
        NProgress.start()
        NProgress.done()
    }, [user]);

    const button = (
        <UnstyledButton
            ref={rippleFourth}
            onPointerDown={eventFourth}
            className={
                `
                    ${classes.button} 
                    ${isActive && classes.activeButton}
                    ${opened && classes.expandedButton}
                `
            }
            onClick={() => {
                setExpanded(!expanded)

                if (link.pathname !== undefined) {
                    NProgress.start()
                    router.push(link.pathname)
                }

                if (link.pathname === pathname) {
                    return NProgress.done()
                }
            }}
        >
            <Center className={classes.iconWrapper} w={64} h={64}>
                {
                    isActive
                        ? link.activeIcon
                        : link.icon
                }
            </Center>
            <Transition
                mounted={opened}
                transition="fade-right"
                duration={150}
                timingFunction="ease"
            >
                {
                    (styles) =>
                        <Group pr={rem(16)} wrap="nowrap" w="100%" justify="space-between" align="center">
                            <Text fw={500} size="lg" style={styles}>
                                {link.label}
                            </Text>
                            {
                                isPopover && (
                                    <IconChevronRight
                                        className={
                                            `${classes.chevron} ${expanded && classes.chevronRotated}`
                                        }
                                        size={24}
                                        stroke={1.5}
                                        style={styles}
                                    />
                                )
                            }
                        </Group>
                }
            </Transition>
        </UnstyledButton>
    )

    const dropdown = (
        <>
            <SignedIn>
                <Stack p={rem(8)} gap={0}>
                    <Group pt={rem(8)} pb={rem(8)}>
                        <Avatar
                            className={classes.avatar}
                            component={Link}
                            href={user?.imageUrl ?? '/blurred.png'}
                            src={user?.imageUrl ?? '/blurred.png'}
                            alt={`Аватар пользователя ${user?.username}`}
                            size="lg"
                        >
                            {user?.username?.[0]}
                        </Avatar>
                        <Title className={classes.title} order={4}>{user?.username}</Title>
                    </Group>
                    <UnstyledButton
                        className={classes.popoverButton}
                        ref={rippleFirst}
                        onPointerDown={eventFirst}
                        onClick={() => {
                            if (!user) {
                                return
                            }

                            const accountURL = `/account/${user.id}`

                            setExpanded(!expanded)
                            NProgress.start()
                            router.push(accountURL)

                            if (accountURL === pathname) {
                                return NProgress.done()
                            }
                        }}
                        p={rem(8)}
                    >
                        <Group align="center">
                            <IconUserCircle stroke={1.5} />
                            <Text className={classes.text}>Мой профиль</Text>
                        </Group>
                    </UnstyledButton>
                    <UnstyledButton
                        className={classes.popoverButton}
                        ref={rippleSecond}
                        onPointerDown={eventSecond}
                        onClick={() => {
                            openSettings()
                            setExpanded(!expanded)
                        }}
                        p={rem(8)}
                    >
                        <Group align="center">
                            <IconSettings stroke={1.5} />
                            <Text className={classes.text}>Настройки</Text>
                        </Group>
                    </UnstyledButton>
                    <SignOutButton>
                        <UnstyledButton
                            className={classes.popoverButton}
                            ref={rippleThird}
                            onPointerDown={eventThird}
                            onClick={() => {
                                setExpanded(!expanded)
                                NProgress.start()
                                NProgress.done()
                            }}
                            p={rem(8)}
                        >
                            <Group align="center">
                                <IconLogout stroke={1.5} />
                                <Text className={classes.text}>Выйти</Text>
                            </Group>
                        </UnstyledButton>
                    </SignOutButton>
                </Stack>
            </SignedIn>
            <SignedOut>
                <Stack p={rem(8)} gap={0}>
                    <Title className={classes.title} pb={rem(8)} order={2}>Аккаунт</Title>
                    <UnstyledButton
                        className={classes.popoverButton}
                        ref={rippleFirst}
                        onPointerDown={eventFirst}
                        onClick={() => {
                            setExpanded(!expanded)
                            openSignIn()
                        }}
                        p={rem(8)}
                    >
                        <Group align="center">
                            <IconLogin stroke={1.5}/>
                            <Text className={classes.text}>Войти</Text>
                        </Group>
                    </UnstyledButton>
                    <UnstyledButton
                        className={classes.popoverButton}
                        ref={rippleSecond}
                        onPointerDown={eventSecond}
                        onClick={() => {
                            setExpanded(!expanded)
                            openSignUp()
                        }}
                        p={rem(8)}
                    >
                        <Group align="center">
                            <IconCloudLockOpen stroke={1.5} />
                            <Text className={classes.text}>Зарегистрироваться</Text>
                        </Group>
                    </UnstyledButton>
                </Stack>
            </SignedOut>
        </>
    )

    return (
        <>
            <Transition
                mounted={settingsOpened}
                transition="fade-down"
                duration={400}
                timingFunction="ease"
            >
                {
                    (styles) => (
                        <Flex style={styles} gap={rem(32)} align="center" direction="column" className={classes.modal}>
                            <Button style={styles} className={classes.closeButton} onClick={closeSettings}>Закрыть</Button>
                            <UserProfile />
                        </Flex>
                    )
                }
            </Transition>
            <Transition
                mounted={signInOpened}
                transition="fade-down"
                duration={400}
                timingFunction="ease"
            >
                {
                    (styles) => (
                        <Flex style={styles} gap={rem(32)} align="center" direction="column" className={classes.modal}>
                            <Button style={styles} className={classes.closeButton} onClick={closeSignIn}>Закрыть</Button>
                            <SignIn routing="virtual" />
                        </Flex>
                    )
                }
            </Transition>
            <Transition
                mounted={signUpOpened}
                transition="fade-down"
                duration={400}
                timingFunction="ease"
            >
                {
                    (styles) => (
                        <Flex style={styles} gap={rem(32)} align="center" direction="column" className={classes.modal}>
                            <Button style={styles} className={classes.closeButton} onClick={closeSignUp}>Закрыть</Button>
                            <SignUp routing="virtual" />
                        </Flex>
                    )
                }
            </Transition>
            <Popover
                classNames={{
                    dropdown: classes.dropdown,
                }}
                opened={expanded}
                onChange={setExpanded}
                position="right"
                transitionProps={{ transition: 'fade-right', duration: 150 }}
            >
                <Popover.Target>
                    {button}
                </Popover.Target>
                <Popover.Dropdown>
                    {dropdown}
                </Popover.Dropdown>
            </Popover>
        </>
    )
}