"use client"

import {comments} from "@/api/comments/comments";
import {Avatar, Group, Loader, Text} from "@mantine/core";
import AddComment from "@/components/Comments/AddComment";
import {useQuery, useQueryClient} from "@tanstack/react-query";

export default function Comments() {
    const { isPending, data } = useQuery({
        queryKey: ["comments"],
        queryFn: async () => {
            return await comments.get("ookami-to-koushinryou-merchant-meets-the-wise-wolf")
        },
        refetchInterval: 3000
    })

    const commentsData = data ?? []

    const commentsSection = commentsData.map((comment) => {
        return (
            <div key={comment.uuid}>
                <Group>
                    <Avatar src={comment.avatar} size={64} />
                    <Group>
                        <Text>{comment.uuid}</Text>
                        <Text>{comment.title}</Text>
                        <Text>{comment.username}</Text>
                        <Text>{comment.date}</Text>
                        <Text>{comment.likes}</Text>
                        <Text>{comment.dislikes}</Text>
                    </Group>
                    <Text>{comment.message}</Text>
                </Group>
            </div>
        )
    })

    return (
        <>
            <AddComment />
            {isPending && <Loader color="blue" />}
            {commentsSection}
        </>
    )
}