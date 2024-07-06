import axios from "axios";

export const animes = () => {
    const getSubsEmbed = async ({ id, episode }: { id: string, episode: number }) => {
        return await axios
            .get(`https://animetize-api.vercel.app/watch/${id}-episode-${episode}`)
            .then((response: {
                data: {
                    headers: {
                        Referer: string;
                    },
                }
            }) => response.data)
            .catch(() => {
                return {
                    headers: {
                        Referer: undefined
                    }
                };
            });
    };

    const getDubsEmbed = async ({ id, episode }: { id: string, episode: number }) => {
        return await axios
            .get(`https://animetize-api.vercel.app/watch/${id}-dub-episode-${episode}`)
            .then((response: {
                data: {
                    headers: {
                        Referer: string;
                    },
                }
            }) => response.data)
            .catch(() => {
                return {
                    headers: undefined
                };
            });
    };

    const getAnimeInfo = async ({ id }: { id: string }) => {
        return await axios
            .get(`https://animetize-api.vercel.app/info/${id}`)
            .then((response: {
                data: {
                    episodes: never[];
                }
            }) => response.data)
            .catch(() => {
                return {
                    episodes: []
                };
            });
    };

    return {
        getSubsEmbed,
        getDubsEmbed,
        getAnimeInfo,
    };
};