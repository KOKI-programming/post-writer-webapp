import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import {getServerSession} from "next-auth";
import { db } from "@/lib/db";
import * as z from "zod";

const postCreateSchema = z.object({
    title: z.string(),
    content: z.string().optional(),
});

// POST /api/posts

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json("Unauthorized", { status: 403 });
        }

        const { user } = session;

        const json = await req.json();
        const body = postCreateSchema.parse(json);
        const{ title, content } = body;

        const post = await db.post.create({
            data: {
                title,
                content,
                authorId: user.id,
                },
                select: {
                    id: true,
                },
        });

    return NextResponse.json(post);
    } catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json(err.errors, { status: 422 });
        }

        return NextResponse.json(null, { status: 500 });
    }
}








