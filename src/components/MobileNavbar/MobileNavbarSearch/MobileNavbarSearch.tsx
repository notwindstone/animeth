import {IconSearch} from "@tabler/icons-react";
import {Center, rem, Text, ThemeIcon, UnstyledButton} from "@mantine/core";
import classes from "@/components/MobileNavbar/MobileNavbar.module.css";
import NProgress from "nprogress";
import {usePathname, useRouter} from "next/navigation";
import {useTranslations} from "next-intl";

export default function MobileNavbarSearch() {
    const translate = useTranslations('Translations');
    const router = useRouter();
    const pathname = usePathname();
    const info = useTranslations('Info');
    const locale = info('locale');

    function redirectUser() {
        NProgress.start();
        router.push(`/${locale}/titles`);

        if (pathname === `/${locale}/titles`) {
            NProgress.done();
        }
    }

    return (
        <>
            <Center flex={1}>
                <UnstyledButton onClick={redirectUser} className={classes.buttonWrapper}>
                    <ThemeIcon
                        className={`${classes.button} ${pathname === "/titles" && classes.activeButton}`}
                    >
                        <IconSearch className={classes.icon} stroke={1.5} size={rem(28)} />
                    </ThemeIcon>
                    <Text className={classes.text}>
                        {translate('common__search-placeholder')}
                    </Text>
                </UnstyledButton>
            </Center>
        </>
    );
}