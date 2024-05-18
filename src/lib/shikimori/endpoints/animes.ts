import axios from "axios";
import {options} from "@/lib/shikimori/options";
import {AnimesType} from "@/types/Shikimori/Queries/Animes.type";
import {OptionType} from "@/types/Shikimori/Queries/Option.type";
import {ResponseType} from "@/types/Shikimori/Responses/Types/Response.type";

export const animes = () => {
    const byId = async ({ ids, filter }: { ids: string, filter?: OptionType[] }) => {
        const params = options({ ids: ids, filter: filter })

        return await axios
            .request(params)
            .then((response: ResponseType) => response.data.data)
    }

    const list = async ({ search, limit, status, year, order, page, filter }: AnimesType) => {
        const params = options({
            search: search,
            limit: limit,
            status: status,
            year: year,
            order: order,
            page: page,
            filter: filter,
        })

        return await axios
            .request(params)
            .then((response: ResponseType) => response.data.data)
    }

    return {
        byId,
        list,
    }
}