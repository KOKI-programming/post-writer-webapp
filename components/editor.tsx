"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import TextareaAutoSize from 'react-textarea-autosize';
import EditorJS from '@editorjs/editorjs';
import { useCallback, useEffect, useRef, useState } from "react";
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Code from '@editorjs/code';
import LinkTool from '@editorjs/link';
import { useForm } from "react-hook-form";
import { Post } from "@prisma/client";
import {zodResolver} from "@hookform/resolvers/zod";
import { postPatchSchema, postPatchSchemaType } from "@/lib/validations/post";
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation";
import { Icon } from "./icon";


interface EditorProps {
    post: Pick<Post, "id" | "title" | "content" | "published">;
}

export default function Editor({post} : EditorProps) {
    const { toast } = useToast();
    const ref = useRef<EditorJS >();
    const router = useRouter();
    const[isMounted, setIsMounted] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const initializeEditor = useCallback( async () => {

        const body = postPatchSchema.parse(post);


        const editor = new EditorJS({
            holder: 'editor',
            onReady: () => {
                ref.current = editor;
            },
            placeholder: 'ここに記事を書く',
            inlineToolbar: true,
            data: body.content ,
            tools: {
                header:Header,
                list:List,
                code: Code,
                linkTool: LinkTool,
            }
        });
    }, [post]);







    

    useEffect(() => {
        if(typeof window !== 'undefined') {
            setIsMounted(true);
        }
    } , []);

    useEffect(() => {
        if(isMounted) {
            initializeEditor();
        }
        return () => {
            ref.current?.destroy();
            ref.current = undefined;
        };
    }, [isMounted ,initializeEditor]);



const {
    register ,
    handleSubmit,
    formState:{errors},
} = useForm<postPatchSchemaType>({
     resolver: zodResolver(postPatchSchema),
});


const onSubmit = async (data: postPatchSchemaType) => {
    setIsSaving(true);
    const blocks = await ref.current?.save();

  const response =  await fetch(`/api/posts/${post.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: data.title,
            content: blocks,
        }),
    });

    setIsSaving(false);


    if(!response.ok) {
        return toast({
            title:'問題が発生しました',
            description: '記事の保存中に問題が発生しました。もう一度お試しください。',
            variant: "destructive"
        });
    }
    router.refresh();

    return toast({
        title: '記事が保存されました',
        description: '記事が正常に保存されました',
    });
};

    return (
        <form onSubmit={handleSubmit(onSubmit) }>
            <div className="grid w-full gap-10">
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center space-x-10">
                        <Link
                        href = {"/dashboard"}
                        className = {cn(buttonVariants({variant: "ghost"}))}
                        >
                          戻る
                        </Link>
                        <p className="text-sm text-muted-foreground">公開</p>
                    </div>
                    <button className={cn(buttonVariants())} type="submit">
                        {isSaving && <Icon.spinner className="animate-spin mr-2"/>}
                        <span>保存</span>
                    </button>
                </div>
                <div className="w-[800px] mx-auto">
                    <TextareaAutoSize
                        id="title"
                        autoFocus
                        defaultValue={post.title}
                        placeholder="Post title"
                        className="w-full resize-none overflow-hidden bg-transparent text-5xl focus:outline-none font-bold"
                        {...register("title")}
                    />
                </div>
                <div id="editor" className="min-h-[500px]"/>
                <p className="text-sm text-gray-500">
                    Use
                    <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">Tab</kbd>
                    to open the command menu
                </p>
            </div>
        </form>
   )
}