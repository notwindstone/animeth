import {add} from "@/lib/comments/functions/add";
import {remove} from "@/lib/comments/functions/remove";
import {edit} from "@/lib/comments/functions/edit";
import {like} from "@/lib/comments/functions/like";
import {dislike} from "@/lib/comments/functions/dislike";
import {get} from "@/lib/comments/functions/get";

export const comments = {
    get: get,
    add: add,
    edit: edit,
    remove: remove,
    like: like,
    dislike: dislike,
}