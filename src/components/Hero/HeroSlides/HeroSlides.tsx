import {Carousel} from "@mantine/carousel";
import {useInViewport} from "@mantine/hooks";
import {BackgroundImage, Box, rem, Text, Title, Transition} from "@mantine/core";

export default function HeroSlides() {
    const { ref, inViewport } = useInViewport();

    return (
        <Carousel.Slide
            ref={ref}
        >
            <BackgroundImage
                style={{
                    backgroundSize: inViewport ? rem(896) : rem(704),
                    opacity: inViewport ? 1 : 0.5,
                    transition: "1000ms ease",
                    height: "100%",
                }}
                src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-6.png"
            >
                <Transition
                    mounted={inViewport}
                    transition="fade-left"
                    duration={1000}
                    timingFunction="ease"
                >
                    {
                        (styles) => (
                            <Box
                                p={24}
                                style={styles}
                            >
                                <Title>Some title</Title>
                                <Text>DescriptionDescriptionDescriptionDescription</Text>
                            </Box>
                        )
                    }
                </Transition>
            </BackgroundImage>
        </Carousel.Slide>
    )
}